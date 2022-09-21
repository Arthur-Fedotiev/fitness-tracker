import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import {
  WorkoutItem,
  WorkoutItemFlatNode,
  WorkoutDatabase,
  hasChild,
  WorkoutBasicInfo,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NgAisInstantSearch } from 'angular-instantsearch';
import { Observable } from 'rxjs';
import { ComposeWorkoutComponentService } from './services/compose-workout-component.service';
import { ComposeWorkoutDropService } from './services/compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './services/compose-wrkout-tree.service';

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
    this.composeWorkoutService.treeControl;
  public readonly dataSource: MatTreeFlatDataSource<
    WorkoutItem,
    WorkoutItemFlatNode
  > = this.composeWorkoutService.dataSource;
  public readonly expansionModel: SelectionModel<string> =
    this.composeWorkoutService.expansionModel;
  public readonly workoutBasicInfo$: Observable<WorkoutBasicInfo | undefined> =
    this.composeWorkoutService.workoutBasicInfo$;
  public readonly searchConfig: NgAisInstantSearch['config'] =
    this.composeWorkoutService.searchConfig;
  public readonly hasChild = hasChild;
  public isSupersetComposeUnderway = false;

  constructor(
    private readonly composeWorkoutService: ComposeWorkoutComponentService,
  ) {}

  public ngOnInit(): void {
    this.composeWorkoutService.initializeListeners();
  }

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutService.resetSuperset();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutService.saveSuperset();
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    this.composeWorkoutService.decompose(decomposedNode);
  }

  public remove(node: WorkoutItemFlatNode): void {
    node.level !== 0
      ? this.composeWorkoutService.removeFromSuperset(node)
      : this.composeWorkoutService.removeFromWorkout(node);
  }

  public saveWorkout(): void {
    this.composeWorkoutService.saveWorkout();
  }

  public trackById(_: number, node: WorkoutItem): string | number {
    return node.id;
  }

  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.composeWorkoutService.drop(event);
  }

  public saveBasicInfo($event: WorkoutBasicInfo): void {
    this.composeWorkoutService.saveBasicInfo($event);
  }

  public addToSuperset(node: WorkoutItemFlatNode): void {
    this.composeWorkoutService.addToSuperset(node);
  }

  public exerciseHitSelected(hit: any): void {
    const exercise: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'> = {
      avatarUrl: hit['baseData.avatarUrl'],
      id: hit.objectID,
      name: hit['translatableData.name'],
    };

    this.composeWorkoutService.addToWorkout(exercise);
  }
}
