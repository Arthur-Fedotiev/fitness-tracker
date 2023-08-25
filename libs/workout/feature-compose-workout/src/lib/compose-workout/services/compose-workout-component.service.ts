import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';

import {
  ConcreteCompositeWorkoutItemInstruction,
  ConcreteSingleWorkoutItemInstruction,
  ConcreteWorkoutItemSerializer,
  InstructionType,
  SerializedWorkout,
  WorkoutBasicInfo,
  WorkoutFacadeService,
  WorkoutItem,
  WorkoutItemComposite,
  WorkoutItemFlatNode,
} from '@fitness-tracker/workout-domain';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import {
  Subject,
  merge,
  scan,
  shareReplay,
  withLatestFrom,
  map,
  tap,
} from 'rxjs';
import { ComposeWorkoutData } from '../models/compose-workout-data.interface';
import { ComposeWorkoutDropService } from './compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './compose-workout-tree.service';

@UntilDestroy()
@Injectable()
export class ComposeWorkoutComponentService {
  public treeControl!: FlatTreeControl<WorkoutItemFlatNode>;
  public dataSource!: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  public expansionModel!: SelectionModel<string>;

  public readonly instructionType = InstructionType;

  public readonly addToComposableSuperset = new Subject<WorkoutItemFlatNode>();
  public readonly reset = new Subject<void>();
  public readonly saveSupersetSubj = new Subject<void>();
  public readonly saveWorkoutSubj = new Subject<SerializedWorkout['content']>();
  private readonly workoutBasicInfoSubj = new Subject<
    WorkoutBasicInfo | undefined
  >();

  public readonly workoutBasicInfo$ = this.workoutBasicInfoSubj.asObservable();

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
        this.treeService.deleteItem(this.treeService.getNestedNode(node)),
      ),
    ),
    tap((superset) => {
      const supersetsNth = this.dataSource.data.reduce(
        (acc, curr) => (curr instanceof WorkoutItemComposite ? ++acc : acc),
        1,
      );

      const set = new WorkoutItemComposite(
        `Superset`,
        [],
        new ConcreteCompositeWorkoutItemInstruction(),
        String(supersetsNth),
      );

      const parent: WorkoutItem = this.treeService.addItem(set);

      superset.forEach((node) => this.treeService.insertItem(node, parent));
    }),
    tap(() => this.reset.next()),
    untilDestroyed(this),
  );

  private readonly saveWorkout$ = this.saveWorkoutSubj.asObservable().pipe(
    withLatestFrom(this.workoutBasicInfoSubj),
    map(
      ([content, basicInfo]) =>
        ({
          content,
          ...basicInfo,
        } as SerializedWorkout),
    ),
    tap((serializedWorkout: SerializedWorkout) =>
      this.workoutFacade.createWorkout(serializedWorkout),
    ),
  );

  constructor(
    private readonly treeService: ComposeWorkoutTreeService,
    private readonly workoutItemSerializeStrategy: ConcreteWorkoutItemSerializer,
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly dropService: ComposeWorkoutDropService,
  ) {}

  public init(composedWorkoutData: ComposeWorkoutData) {
    this.treeService.initialize(composedWorkoutData.workoutContent);
    this.treeControl = this.treeService.treeControl;
    this.dataSource = this.treeService.dataSource;
    this.expansionModel = this.treeService.expansionModel;

    this.workoutBasicInfoSubj.next(composedWorkoutData.workoutBasicInfo);
    this.createSuperset$.pipe(untilDestroyed(this)).subscribe();
    this.saveWorkout$.pipe(untilDestroyed(this)).subscribe();

    return {
      treeControl: this.treeControl,
      dataSource: this.dataSource,
      expansionModel: this.expansionModel,
    };
  }

  public saveWorkout(): void {
    if (!this.dataSource.data.every((workoutItem) => workoutItem.isValid())) {
      console.log('Data is not valid to be saved');

      return;
    }

    const serializedWorkoutContent = this.dataSource.data.map((workoutItem) =>
      this.workoutItemSerializeStrategy.serialize(workoutItem),
    );

    this.saveWorkoutSubj.next(serializedWorkoutContent);
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    this.treeService.decompose(decomposedNode);
  }

  public removeFromSuperset(node: WorkoutItemFlatNode): void {
    this.treeService.removeFromSuperset(node);
  }

  public removeFromWorkout(node: WorkoutItemFlatNode): void {
    this.treeService.removeFromWorkout(node);
  }

  public saveBasicInfo($event: WorkoutBasicInfo): void {
    this.workoutBasicInfoSubj.next($event);
  }

  public resetSuperset(): void {
    this.reset.next();
  }

  public saveSuperset(): void {
    this.saveSupersetSubj.next();
  }

  public addToSuperset(node: WorkoutItemFlatNode): void {
    this.addToComposableSuperset.next(node);
  }

  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.dropService.drop(event);
  }

  public addToWorkout(exercise: {
    avatarUrl: string;
    id: string;
    name: string;
  }): void {
    this.treeService.addItem(
      this.workoutItemSerializeStrategy.deserialize({
        ...exercise,
        children: null,
        parentId: null,
        ...new ConcreteSingleWorkoutItemInstruction(),
      }),
    );
  }
}
