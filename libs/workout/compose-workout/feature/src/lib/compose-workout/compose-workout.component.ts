import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
  WorkoutBasicInfo,
} from '@fitness-tracker/workout/data';

import { UntilDestroy } from '@ngneat/until-destroy';
import { NgAisInstantSearch } from 'angular-instantsearch';
import { Observable } from 'rxjs';
import { ComposeWorkoutComponentService } from './services/compose-workout-component.service';
import { ComposeWorkoutDropService } from './services/compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './services/compose-wrkout-tree.service';
import { hasChild, WorkoutDatabase } from './services/workout-db';

@UntilDestroy()
@Component({
  selector: 'ft-compose-workout',
  templateUrl: './compose-workout.component.html',
  styleUrls: ['./compose-workout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WorkoutDatabase,
    ComposeWorkoutTreeService,
    ComposeWorkoutDropService,
    ComposeWorkoutComponentService,
  ],
})
export class ComposeWorkoutComponent implements OnInit {
  public readonly treeControl: FlatTreeControl<WorkoutItemFlatNode> =
    this.composeWorkoutPresenter.treeControl;
  public readonly dataSource: MatTreeFlatDataSource<
    WorkoutItem,
    WorkoutItemFlatNode
  > = this.composeWorkoutPresenter.dataSource;
  public readonly expansionModel: SelectionModel<string> =
    this.composeWorkoutPresenter.expansionModel;
  public readonly workoutBasicInfo$: Observable<WorkoutBasicInfo | undefined> =
    this.composeWorkoutPresenter.workoutBasicInfo$;
  public readonly searchConfig: NgAisInstantSearch['config'] =
    this.composeWorkoutPresenter.searchConfig;
  public readonly hasChild = hasChild;
  public isSupersetComposeUnderway = false;

  constructor(
    private readonly composeWorkoutPresenter: ComposeWorkoutComponentService,
  ) {}

  public ngOnInit(): void {
    this.composeWorkoutPresenter.initializeListeners();
  }

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutPresenter.resetSuperset();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutPresenter.saveSuperset();
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    this.composeWorkoutPresenter.decompose(decomposedNode);
  }

  public remove(node: WorkoutItemFlatNode): void {
    node.level !== 0
      ? this.composeWorkoutPresenter.removeFromSuperset(node)
      : this.composeWorkoutPresenter.removeFromWorkout(node);
  }

  public saveWorkout(): void {
    this.composeWorkoutPresenter.saveWorkout();
  }

  public trackById(_: number, node: WorkoutItem): string | number {
    return node.id;
  }

  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.composeWorkoutPresenter.drop(event);
  }

  public saveBasicInfo($event: WorkoutBasicInfo): void {
    this.composeWorkoutPresenter.saveBasicInfo($event);
  }

  public addToSuperset(node: WorkoutItemFlatNode): void {
    this.composeWorkoutPresenter.addToSuperset(node);
  }

  public exerciseHitSelected(hit: any): void {
    const exercise: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'> = {
      avatarUrl: hit['baseData.avatarUrl'],
      id: hit.objectID,
      name: hit['translatableData.name'],
    };

    this.composeWorkoutPresenter.addToWorkout(exercise);
  }
}
