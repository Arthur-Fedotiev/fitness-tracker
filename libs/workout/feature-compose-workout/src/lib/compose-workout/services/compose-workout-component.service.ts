import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable, signal } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';

import {
  ComposeWorkoutData,
  ConcreteCompositeWorkoutItemInstruction,
  ConcreteSingleWorkoutItemInstruction,
  ConcreteWorkoutItemSerializer,
  InstructionType,
  WorkoutBasicInfo,
  WorkoutFacadeService,
  WorkoutItem,
  WorkoutItemComposite,
  WorkoutItemFlatNode,
} from '@fitness-tracker/workout-domain';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComposeWorkoutDropService } from './compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './compose-workout-tree.service';
import { ExerciseFacade } from '@fitness-tracker/exercise/domain';

@UntilDestroy()
@Injectable()
export class ComposeWorkoutComponentService {
  treeControl!: FlatTreeControl<WorkoutItemFlatNode>;
  dataSource!: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  expansionModel!: SelectionModel<string>;

  readonly instructionType = InstructionType;

  readonly temporarySuperset = signal<WorkoutItemFlatNode[]>([]);

  constructor(
    private readonly treeService: ComposeWorkoutTreeService,
    private readonly workoutItemSerializeStrategy: ConcreteWorkoutItemSerializer,
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly dropService: ComposeWorkoutDropService,
    private readonly exercisesFacade: ExerciseFacade,
  ) {}

  init(composedWorkoutData: ComposeWorkoutData) {
    this.treeService.initialize(composedWorkoutData.workoutContent);
    this.treeControl = this.treeService.treeControl;
    this.dataSource = this.treeService.dataSource;
    this.expansionModel = this.treeService.expansionModel;

    return {
      treeControl: this.treeControl,
      dataSource: this.dataSource,
      expansionModel: this.expansionModel,
    };
  }

  saveWorkout(basicInfo: WorkoutBasicInfo) {
    if (!this.dataSource.data.every((workoutItem) => workoutItem.isValid())) {
      console.log('Data is not valid to be saved');

      return;
    }

    const serializedWorkoutContent = this.dataSource.data.map((workoutItem) =>
      this.workoutItemSerializeStrategy.serialize(workoutItem),
    );

    this.workoutFacade.createWorkout({
      ...basicInfo,
      content: serializedWorkoutContent,
    });
  }

  decompose(decomposedNode: WorkoutItemFlatNode) {
    this.treeService.decompose(decomposedNode);
  }

  removeFromSuperset(node: WorkoutItemFlatNode) {
    this.treeService.removeFromSuperset(node);
  }

  removeFromWorkout(node: WorkoutItemFlatNode) {
    this.treeService.removeFromWorkout(node);
  }

  resetSuperset() {
    this.temporarySuperset.set([]);
  }

  saveSuperset() {
    const parent = this.treeService.addItem(this.createSuperset());

    this.temporarySuperset().forEach((node: WorkoutItemFlatNode) => {
      this.treeService.deleteItem(this.treeService.getNestedNode(node));
      this.treeService.insertItem(node, parent);
    });

    this.resetSuperset();
  }

  addToSuperset(node: WorkoutItemFlatNode) {
    this.temporarySuperset.update((superset) => [...superset, node]);
  }

  removeFromTemporarySuperset(node: WorkoutItemFlatNode) {
    this.temporarySuperset.update((superset) =>
      superset.filter((item) => item !== node),
    );
  }

  drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.dropService.drop(event);
  }

  addToWorkout(exercise: { avatarUrl: string; id: string; name: string }) {
    this.treeService.addItem(
      this.workoutItemSerializeStrategy.deserialize({
        ...exercise,
        children: null,
        parentId: null,
        ...new ConcreteSingleWorkoutItemInstruction(),
      }),
    );
  }

  releaseResources() {
    this.workoutFacade.onNavigatedFromWorkoutCompose();
  }

  showExerciseDetails(id: string) {
    this.exercisesFacade.openExerciseDetailsDialog(id);
  }

  private createSuperset() {
    const set = new WorkoutItemComposite(
      `Superset`,
      [],
      new ConcreteCompositeWorkoutItemInstruction(),
      String(this.treeService.getSupersetsTotal() + 1),
    );
    return set;
  }
}
