import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable, signal, inject } from '@angular/core';
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
import {
  OPEN_EXERCISE_DETAILS_DIALOG_COMMAND,
  OpenExerciseDetailsDialogCommand,
} from '@fitness-tracker/exercise/public-api';

@UntilDestroy()
@Injectable()
export class ComposeWorkoutComponentService {
  private readonly treeService = inject(ComposeWorkoutTreeService);
  private readonly workoutItemSerializeStrategy = inject(ConcreteWorkoutItemSerializer);
  private readonly workoutFacade = inject(WorkoutFacadeService);
  private readonly dropService = inject(ComposeWorkoutDropService);
  private readonly exerciseDetailsDialogCommand =
    inject<OpenExerciseDetailsDialogCommand>(
      OPEN_EXERCISE_DETAILS_DIALOG_COMMAND,
    );

  treeControl!: FlatTreeControl<WorkoutItemFlatNode>;
  dataSource!: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  expansionModel!: SelectionModel<string>;

  readonly instructionType = InstructionType;

  readonly temporarySuperset = signal<WorkoutItemFlatNode[]>([]);

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
    const superset = this.createSuperset();
    const parent = this.treeService.addItem(superset);

    console.log('%c Superset created:', 'color: green; font-weight: bold;', {
      superset,
      parent,
      temporarySuperset: this.temporarySuperset(),
    });

    this.temporarySuperset().forEach((node: WorkoutItemFlatNode) => {
      this.treeService.deleteItem(this.treeService.getNestedNode(node));
      this.treeService.insertItem(node, parent);
    });

    console.log('Superset saved:', parent);

    this.resetSuperset();
  }

  addToSuperset(node: WorkoutItemFlatNode) {
    this.temporarySuperset.update((superset) => [...superset, node]);
  }

  removeFromTemporarySuperset(node: WorkoutItemFlatNode) {
    this.temporarySuperset.update((superset) => superset.filter((item) => item !== node));
  }

  drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.dropService.drop(event);
  }

  addToWorkout(exercise: { id: string; name: string }) {
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
    this.exerciseDetailsDialogCommand.openExerciseDetailsDialog(id);
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
