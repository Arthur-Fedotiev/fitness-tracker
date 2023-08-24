import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import {
  ExerciseDescriptors,
  EXERCISE_DESCRIPTORS_TOKEN,
} from '@fitness-tracker/exercise/public-api';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
  WorkoutBasicInfo,
} from '@fitness-tracker/workout-domain';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ComposeWorkoutComponentService } from './services/compose-workout-component.service';
import { ComposeWorkoutDropService } from './services/compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './services/compose-wrkout-tree.service';
import { hasChild, WorkoutDatabase } from './services/workout-db';
import { WorkoutItemRestComponent } from './components/workout-item-rest/workout-item-rest.component';
import { WorkoutItemLoadSubformComponent } from './components/workout-item-load-subform/workout-item-load-subform.component';
import { FormsModule } from '@angular/forms';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutBasicInfoComponent } from './components/workout-basic-info/workout-basic-info.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatDialogModule } from '@angular/material/dialog';
import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/domain';

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
    EXERCISE_DESCRIPTORS_PROVIDER,
  ],
  standalone: true,
  imports: [
    MatDialogModule,
    FlexModule,
    MatExpansionModule,
    WorkoutBasicInfoComponent,
    MatTreeModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    NgIf,
    MatIconModule,
    ExtendedModule,
    FormsModule,
    WorkoutItemLoadSubformComponent,
    WorkoutItemRestComponent,
    AsyncPipe,
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

  public readonly hasChild = hasChild;
  public isSupersetComposeUnderway = false;

  constructor(
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    public readonly exerciseDescriptors: ExerciseDescriptors,
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

  public exerciseHitSelected(hit: {
    baseData: { avatarUrl: string };
    objectID: string;
    translatableData: { name: string };
  }): void {
    const exercise = {
      avatarUrl: hit.baseData.avatarUrl,
      id: hit.objectID,
      name: hit.translatableData.name,
    };

    this.composeWorkoutPresenter.addToWorkout(exercise);
  }
}
