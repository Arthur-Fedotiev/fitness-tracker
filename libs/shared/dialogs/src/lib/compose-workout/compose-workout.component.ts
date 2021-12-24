import { NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import { BehaviorSubject, merge, scan, Subject } from 'rxjs';
import {
  map,
  shareReplay,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

export class WorkoutItemInstruction {
  constructor(public type: string, public _load?: number) {}

  public getLoad(): number | null {
    return this._load || null;
  }

  public setLoad(load: number): WorkoutItemInstruction {
    this._load = load;
    return this;
  }

  public setType(load: number): WorkoutItemInstruction {
    this._load = load;
    return this;
  }
}

export interface WorkoutItemComposite {
  isNested: boolean;
  name: string;
  id?: string;
  children?: WorkoutItemComposite[];
  getInstructions: () => WorkoutItemInstruction | Record<string, never>;
}

export class WorkoutItem implements WorkoutItemComposite {
  public instructionStrategy;

  constructor(
    public name: string,
    public id: string,
    public isNested: boolean = false,
    instructionStrategy?: WorkoutItemInstruction | undefined,
  ) {
    this.instructionStrategy = instructionStrategy || {};
  }

  public getInstructions() {
    return this.instructionStrategy ?? {};
  }

  public setNested(isNested: boolean) {
    this.isNested = isNested;
    return this;
  }
}

export class WorkoutSet implements WorkoutItemComposite {
  public isNested = false;
  public instructionStrategy;
  constructor(
    public name: string,
    public children: WorkoutItem[],
    instructionStrategy?: WorkoutItemInstruction | undefined,
  ) {
    this.instructionStrategy = instructionStrategy || {};
  }

  public getInstructions() {
    return this.instructionStrategy ?? {};
  }
}

@Component({
  selector: 'ft-compose-workout',
  templateUrl: './compose-workout.component.html',
  styleUrls: ['./compose-workout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeWorkoutComponent implements OnInit {
  public isSupersetComposeUnderway = false;
  treeControl = new NestedTreeControl<WorkoutItemComposite>(
    (node) => node.children,
  );
  dataSource = new MatTreeNestedDataSource<WorkoutItemComposite>();

  public readonly addToComposableSuperset = new Subject<WorkoutItem>();
  public readonly reset = new Subject<void>();
  public readonly saveSupersetSubj = new Subject<void>();

  public readonly temporarySuperset$ = merge(
    this.addToComposableSuperset.asObservable(),
    this.reset,
  ).pipe(
    scan((acc, curr) => (curr ? [...acc, curr] : []), [] as WorkoutItem[]),
    shareReplay(1),
  );

  public readonly createSuperset$ = this.saveSupersetSubj.asObservable().pipe(
    withLatestFrom(this.temporarySuperset$),
    map(([_, superset]) => superset.map((item) => item.setNested(true))),
    tap(
      (superset) =>
        (this.dataSource.data = this.dataSource.data.filter(({ id }) =>
          !id ? true : !superset.map((ex) => ex.id).includes(id),
        )),
    ),
    map((superset) => new WorkoutSet('Superset', superset)),
    tap(
      (workoutSet) =>
        (this.dataSource.data = [...this.dataSource.data, workoutSet]),
    ),
    tap(console.log),
    tap(() => this.reset.next()),
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
    private dialogRef: MatDialogRef<ComposeWorkoutComponent>,
  ) {}

  ngOnInit(): void {
    this.createSuperset$.subscribe(console.log);
    this.dataSource.data = this.data.map(
      ({ name, id }) => new WorkoutItem(name, id, false),
    );
  }

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.reset.next();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.saveSupersetSubj.next();
  }

  public hasChild = (_: number, node: WorkoutItemComposite) =>
    !!node.children && node.children.length > 0;

  public decompose(decomposedSet: any): void {
    console.log(decomposedSet);

    this.dataSource.data = this.dataSource.data
      .filter((node) => node.name !== decomposedSet.name)
      .concat(
        decomposedSet.children.map((node: WorkoutItem) =>
          node.setNested(false),
        ),
      );
  }
}
