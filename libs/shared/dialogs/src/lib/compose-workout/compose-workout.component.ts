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

export enum InstructionType {
  'REPS' = 'REPS',
  'DURATION' = 'DURATION',
}

export const DEFAULT_REST_PAUSE = 0;

export type IInstruction<T = Record<string, any>> = {
  [P in keyof T]: T[P];
};
export abstract class Instruction implements WorkoutItemInstruction {
  public abstract load: number | null;
  public abstract type: InstructionType | null;
  public abstract restPauseBetween: number;
  public abstract restPauseAfterComplete: number;

  public isValid(): boolean {
    return Boolean(
      this.load &&
        this.load >= 0 &&
        this.type &&
        InstructionType[this.type] &&
        this.restPauseBetween >= 0 &&
        this.restPauseBetween >= 0,
    );
  }

  public reset(): void {
    this.load = null;
    this.restPauseBetween = DEFAULT_REST_PAUSE;
    this.restPauseAfterComplete = DEFAULT_REST_PAUSE;
  }
}

export interface WorkoutItemInstruction {
  load: number | null;
  type: InstructionType | null;
  restPauseBetween: number;
  restPauseAfterComplete: number;
  isValid: () => boolean;
  reset: () => void;
}

export interface CompositeWorkoutItemInstruction
  extends WorkoutItemInstruction {
  type: InstructionType.REPS;
}
export class ConcreteSingleWorkoutItemInstruction extends Instruction {
  public load: number | null = null;
  public type: InstructionType | null = null;
  public restPauseBetween: number = DEFAULT_REST_PAUSE;
  public restPauseAfterComplete: number = DEFAULT_REST_PAUSE;

  public reset(): void {
    super.reset();
    this.load = null;
  }
}

export class ConcreteCompositeWorkoutItemInstruction extends Instruction {
  public readonly type = InstructionType.REPS;
  public load: number | null = null;
  public restPauseBetween: number = DEFAULT_REST_PAUSE;
  public restPauseAfterComplete: number = DEFAULT_REST_PAUSE;

  public reset(): void {
    super.reset();
  }
}

export interface WorkoutItem {
  isNested: boolean;
  name: string;
  id: string;
  children?: WorkoutItem[];
  parent: WorkoutItem | null;
  getInstructions: () => WorkoutItemInstruction;
  isValid: () => boolean;
}
export class SingleWorkoutItem implements WorkoutItem {
  constructor(
    public name: string,
    public id: string,
    public instructionStrategy: WorkoutItemInstruction,
    public parent: WorkoutItem | null = null,
    public isNested: boolean = false,
  ) {}

  public getInstructions(): WorkoutItemInstruction {
    return this.instructionStrategy;
  }

  public setNested(isNested: boolean): SingleWorkoutItem {
    this.isNested = isNested;
    return this;
  }

  public setParent(parent: WorkoutItem | null): SingleWorkoutItem {
    this.parent = parent;
    return this;
  }

  public isValid(): boolean {
    return this.instructionStrategy.isValid();
  }
}
export class WorkoutItemComposite implements WorkoutItem {
  public isNested = false;
  public parent = null;

  public get id() {
    return this.name;
  }
  constructor(
    public name: string,
    public children: SingleWorkoutItem[],
    public instructionStrategy: CompositeWorkoutItemInstruction,
  ) {}

  public getInstructions(): CompositeWorkoutItemInstruction {
    return this.instructionStrategy;
  }

  public isValid(): boolean {
    return this.children.every((child) => child.isValid());
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ft-compose-workout',
  templateUrl: './compose-workout.component.html',
  styleUrls: ['./compose-workout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeWorkoutComponent implements OnInit {
  public readonly instructionType = InstructionType;
  public isSupersetComposeUnderway = false;
  treeControl = new NestedTreeControl<WorkoutItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<WorkoutItem>();

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
    map(([_, superset]) => superset.map((item) => item.setNested(true))),
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
      );
      set.children.map((node) => node.setParent(set));

      return set;
    }),
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
      ({ name, id }) =>
        new SingleWorkoutItem(
          name,
          id,
          new ConcreteSingleWorkoutItemInstruction(),
        ),
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

  public hasChild = (_: number, node: WorkoutItem) =>
    !!node.children && node.children.length > 0;

  public decompose(decomposedSet: any): void {
    console.log(decomposedSet);

    this.dataSource.data = this.dataSource.data
      .filter((node) => node.name !== decomposedSet.name)
      .concat(
        decomposedSet.children.map((node: SingleWorkoutItem) => {
          node.setNested(false).setParent(null).instructionStrategy.reset();
          return node;
        }),
      );
  }

  // public saveStrategy(node: WorkoutItem, instructionStrategy: any): void {
  //   console.log('[saveStrategy]:', node, instructionStrategy);
  //   node.getInstructions().setInstruction(instructionStrategy);
  // }

  public removeFromSuperset(node: SingleWorkoutItem): void {
    console.log(node);
    // this.dataSource.data = this.dataSource.data
    //   .filter((node) => node.name !== decomposedSet.name)
    //   .concat(
    //     decomposedSet.children.map((node: SingleWorkoutItem) =>
    //       node.setNested(false),
    //     ),
    //   );
  }

  public saveWorkout(): void {
    console.log(this.dataSource.data);
  }
}
