import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import {
  InstructionType,
  WorkoutItem,
  SingleWorkoutItem,
  WorkoutItemComposite,
  ConcreteCompositeWorkoutItemInstruction,
  ConcreteSingleWorkoutItemInstruction,
  WorkoutItemFlatNode,
  WorkoutDatabase,
  getChildren,
  getLevel,
  isExpandable,
  transformer,
  hasChild,
} from '@fitness-tracker/shared/utils';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, merge, Observable, of, scan, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'ft-compose-workout',
  templateUrl: './compose-workout.component.html',
  styleUrls: ['./compose-workout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkoutDatabase],
})
export class ComposeWorkoutComponent implements OnInit {
  treeControl: FlatTreeControl<WorkoutItemFlatNode>;
  treeFlattener: MatTreeFlattener<WorkoutItem, WorkoutItemFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);

  public hasChild = hasChild;

  public readonly nestedDrag = new BehaviorSubject(false);
  public readonly nestedDrag$ = this.nestedDrag
    .asObservable()
    .pipe(debounceTime(50), tap(console.log));

  public readonly instructionType = InstructionType;
  public isSupersetComposeUnderway = false;

  public readonly addToComposableSuperset = new Subject<SingleWorkoutItem>();
  public readonly reset = new Subject<void>();
  public readonly saveSupersetSubj = new Subject<void>();

  public readonly temporarySuperset$ = merge(
    this.addToComposableSuperset.asObservable(),
    this.reset,
  ).pipe(
    scan(
      (acc, curr) => (curr ? [...acc, curr] : []),
      [] as SingleWorkoutItem[],
    ),
    shareReplay(1),
  );

  public readonly createSuperset$ = this.saveSupersetSubj.asObservable().pipe(
    withLatestFrom(this.temporarySuperset$),
    map(([, superset]: [void, SingleWorkoutItem[]]) => superset),
    tap(
      (superset) =>
        (this.dataSource.data = this.dataSource.data.filter(({ id }) =>
          !id ? true : !superset.map((ex) => ex.id).includes(id),
        )),
    ),
    map((superset) => {
      const set = new WorkoutItemComposite(
        'Superset',
        superset,
        new ConcreteCompositeWorkoutItemInstruction(),
        `${this.dataSource.data.reduce(
          (acc, curr) => (curr instanceof WorkoutItemComposite ? ++acc : acc),
          0,
        )}`,
      );
      set.children.map((node) => node.setParent(set));

      return set;
    }),
    tap(
      (workoutSet) =>
        (this.dataSource.data = [...this.dataSource.data, workoutSet]),
    ),
    // tap(console.log),
    tap(() => this.reset.next()),
  );

  constructor(
    // @Inject(MAT_DIALOG_DATA)
    // public data: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
    readonly workoutDB: WorkoutDatabase, // private dialogRef: MatDialogRef<ComposeWorkoutComponent>, // private readonly cdr: ChangeDetectorRef,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      transformer,
      getLevel,
      isExpandable,
      getChildren,
    );
    this.treeControl = new FlatTreeControl<WorkoutItemFlatNode>(
      getLevel,
      isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );

    workoutDB.dataChange
      .pipe(untilDestroyed(this))
      .subscribe((data) => this.rebuildTreeForData(data));
  }

  ngOnInit(): void {
    this.createSuperset$.pipe(untilDestroyed(this)).subscribe();
  }

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.reset.next();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.saveSupersetSubj.next();
  }

  public decompose(decomposedNode: WorkoutItemComposite): void {
    console.log(decomposedNode);

    const newData = this.dataSource.data
      .filter((node) => node.id !== decomposedNode.id)
      .concat(
        decomposedNode.children.map((node: WorkoutItem) => {
          node.setParent(null).instructionStrategy.reset();
          return node;
        }),
      );
    this.resetDataSource(newData);
  }

  // public saveStrategy(node: WorkoutItem, instructionStrategy: any): void {
  //   console.log('[saveStrategy]:', node, instructionStrategy);
  //   node.getInstructions().setInstruction(instructionStrategy);
  // }

  public removeFromSuperset(
    node: SingleWorkoutItem,
    parent: WorkoutItemComposite,
  ): void {
    // console.log(node, parent);

    if (parent.children && parent.children.length <= 2) {
      this.decompose(parent);
    } else {
      parent.remove(node);
      node.getInstructions().reset();
      const newData = [...this.dataSource.data, node.setParent(null)];
      this.resetDataSource(newData);
    }
  }

  public saveWorkout(): void {
    console.log(this.dataSource.data);
  }

  private resetDataSource(newData: WorkoutItem[]): void {
    this.dataSource.data = [];
    this.workoutDB.dataChange.next(newData);
  }
  public trackById(_: number, node: WorkoutItem): string | number {
    return node.id;
  }

  drop(event: CdkDragDrop<WorkoutItem[]>) {
    const newData = [...this.dataSource.data];
    console.log(event.previousIndex, event.currentIndex);

    // const previousNode = this.dataSource.data[event.previousIndex];
    // newData[event.previousIndex] = this.dataSource.data[event.currentIndex];
    // newData[event.currentIndex] = previousNode;

    // this.resetDataSource(newData);

    // moveItemInArray(
    //   this.dataSource.data,
    //   event.previousIndex,
    //   event.currentIndex,
    // );
    console.log(event.container.data);
  }

  rebuildTreeForData(data: any) {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === id);
      node && this.treeControl.expand(node);
    });
  }
}
