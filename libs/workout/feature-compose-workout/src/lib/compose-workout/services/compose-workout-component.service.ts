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

@UntilDestroy()
@Injectable()
export class ComposeWorkoutComponentService {
  public treeControl!: FlatTreeControl<WorkoutItemFlatNode>;
  public dataSource!: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  public expansionModel!: SelectionModel<string>;

  public readonly instructionType = InstructionType;

  public readonly temporarySuperset = signal<WorkoutItemFlatNode[]>([]);

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

    return {
      treeControl: this.treeControl,
      dataSource: this.dataSource,
      expansionModel: this.expansionModel,
    };
  }

  public saveWorkout(basicInfo: WorkoutBasicInfo): void {
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

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    this.treeService.decompose(decomposedNode);
  }

  public removeFromSuperset(node: WorkoutItemFlatNode): void {
    this.treeService.removeFromSuperset(node);
  }

  public removeFromWorkout(node: WorkoutItemFlatNode): void {
    this.treeService.removeFromWorkout(node);
  }

  public resetSuperset(): void {
    this.temporarySuperset.set([]);
  }

  public saveSuperset(): void {
    const parent = this.treeService.addItem(this.createSuperset());

    this.temporarySuperset().forEach((node: WorkoutItemFlatNode) => {
      this.treeService.deleteItem(this.treeService.getNestedNode(node));
      this.treeService.insertItem(node, parent);
    });

    this.resetSuperset();
  }

  public addToSuperset(node: WorkoutItemFlatNode): void {
    this.temporarySuperset.update((superset) => [...superset, node]);
  }

  public removeFromTemporarySuperset(node: WorkoutItemFlatNode) {
    this.temporarySuperset.update((superset) =>
      superset.filter((item) => item !== node),
    );
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

  public releaseResources(): void {
    this.workoutFacade.onNavigatedFromWorkoutCompose();
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
