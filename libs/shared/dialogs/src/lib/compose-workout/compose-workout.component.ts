/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  InstructionType,
  WorkoutItem,
  SingleWorkoutItem,
  WorkoutItemComposite,
  ConcreteCompositeWorkoutItemInstruction,
  WorkoutItemFlatNode,
  WorkoutDatabase,
  getChildren,
  getLevel,
  isExpandable,
  hasChild,
} from '@fitness-tracker/shared/utils';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, merge, scan, Subject } from 'rxjs';
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
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<WorkoutItemFlatNode, WorkoutItem>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<WorkoutItem, WorkoutItemFlatNode>();

  treeControl: FlatTreeControl<WorkoutItemFlatNode>;
  treeFlattener: MatTreeFlattener<WorkoutItem, WorkoutItemFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);

  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;

  public hasChild = hasChild;

  public readonly nestedDrag = new BehaviorSubject(false);
  public readonly nestedDrag$ = this.nestedDrag
    .asObservable()
    .pipe(debounceTime(50), tap(console.log));

  public readonly instructionType = InstructionType;
  public isSupersetComposeUnderway = false;

  public readonly addToComposableSuperset = new Subject<WorkoutItemFlatNode>();
  public readonly reset = new Subject<void>();
  public readonly saveSupersetSubj = new Subject<void>();

  public readonly temporarySuperset$ = merge(
    this.addToComposableSuperset.asObservable(),
    this.reset,
  ).pipe(
    scan(
      (acc, curr) => (curr ? [...acc, curr] : []),
      [] as WorkoutItemFlatNode[],
    ),
    shareReplay(1),
  );

  public readonly createSuperset$ = this.saveSupersetSubj.asObservable().pipe(
    withLatestFrom(this.temporarySuperset$),
    map(([, superset]: [void, WorkoutItemFlatNode[]]) => superset),
    tap((superset) =>
      superset.forEach((node: WorkoutItemFlatNode) =>
        this.workoutDB.deleteItem(this.flatNodeMap.get(node)!),
      ),
    ),
    debounceTime(0),
    tap((superset) => {
      const set = new WorkoutItemComposite(
        'Superset',
        [],
        new ConcreteCompositeWorkoutItemInstruction(),
        `${this.dataSource.data.reduce(
          (acc, curr) => (curr instanceof WorkoutItemComposite ? ++acc : acc),
          0,
        )}`,
      );

      const parent = this.workoutDB.addItem(set);

      superset.forEach((node) =>
        this.workoutDB.insertItem(parent, this.flatNodeMap.get(node)!),
      );
    }),

    tap(() => this.reset.next()),
  );

  constructor(
    // @Inject(MAT_DIALOG_DATA)
    // public data: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
    readonly workoutDB: WorkoutDatabase, // private dialogRef: MatDialogRef<ComposeWorkoutComponent>, // private readonly cdr: ChangeDetectorRef,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
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

  public transformer = (
    nodeItem: WorkoutItem,
    level: number,
  ): WorkoutItemFlatNode => {
    const existingNode = this.nestedNodeMap.get(nodeItem);
    const flatNode =
      existingNode?.workoutItem === nodeItem
        ? existingNode
        : new WorkoutItemFlatNode(nodeItem, Boolean(level), level);
    flatNode.workoutItem = nodeItem;
    flatNode.level = level;
    flatNode.expandable = Boolean(nodeItem.children);
    this.flatNodeMap.set(flatNode, nodeItem);
    this.nestedNodeMap.set(nodeItem, flatNode);
    return flatNode;
  };

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.reset.next();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.workoutDB.insertTest();
    this.saveSupersetSubj.next();
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    console.log(decomposedNode);

    this.flatNodeMap
      .get(decomposedNode)
      ?.children?.forEach((child) =>
        this.workoutDB.addItem(child.setParent(null)),
      );

    this.workoutDB.deleteItem(this.flatNodeMap.get(decomposedNode)!);
  }

  public removeFromSuperset(node: WorkoutItemFlatNode): void {
    const item: WorkoutItem = this.flatNodeMap.get(node)!;

    this.workoutDB.deleteItem(item);
    this.workoutDB.addItem(item.setParent(null));
  }

  public saveWorkout(): void {
    console.log(this.dataSource.data);
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

  dragStart() {
    this.dragging = true;
  }
  dragEnd() {
    this.dragging = false;
  }
  dragHover(node: WorkoutItemFlatNode) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  dragHoverEnd() {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  rebuildTreeForData(data: any) {
    this.dataSource.data = [];
    this.dataSource.data = data;
    // this.expansionModel.selected.forEach((id) => {
    //   const node = this.treeControl.dataNodes.find((n) => n.id === id);
    //   node && this.treeControl.expand(node);
    // });
  }
}
