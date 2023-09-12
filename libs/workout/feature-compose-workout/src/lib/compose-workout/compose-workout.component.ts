import { getLanguageRefresh$ } from '@fitness-tracker/shared/i18n/domain';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  Input,
  OnDestroy,
  computed,
  ViewChild,
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import {
  ExerciseDescriptors,
  EXERCISE_DESCRIPTORS_TOKEN,
} from '@fitness-tracker/exercise/public-api';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
  ComposeWorkoutData,
} from '@fitness-tracker/workout-domain';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComposeWorkoutComponentService } from './services/compose-workout-component.service';
import { ComposeWorkoutDropService } from './services/compose-workout-drop.service';
import { ComposeWorkoutTreeService } from './services/compose-workout-tree.service';
import { hasChild, WorkoutDatabase } from './services/workout-db';
import { WorkoutItemRestComponent } from './components/workout-item-rest/workout-item-rest.component';
import { WorkoutItemLoadSubformComponent } from './components/workout-item-load-subform/workout-item-load-subform.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutBasicInfoComponent } from './components/workout-basic-info/workout-basic-info.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexModule } from '@angular/flex-layout/flex';
import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/domain';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    FlexModule,
    MatExpansionModule,
    WorkoutBasicInfoComponent,
    MatTreeModule,
    MatChipsModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    ExtendedModule,
    FormsModule,
    WorkoutItemLoadSubformComponent,
    WorkoutItemRestComponent,
    TranslateModule,
  ],
})
export class ComposeWorkoutComponent implements OnInit, OnDestroy {
  @ViewChild('workoutForm') workoutForm!: NgForm;

  @Input({ required: true }) resolvedComposedWorkoutData!: ComposeWorkoutData;

  public treeControl: FlatTreeControl<WorkoutItemFlatNode> =
    this.composeWorkoutPresenter.treeControl;
  public dataSource: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode> =
    this.composeWorkoutPresenter.dataSource;
  public treeExpansionModel: SelectionModel<string> =
    this.composeWorkoutPresenter.expansionModel;

  protected readonly hasChild = hasChild;
  protected isSupersetComposeUnderway = false;
  protected temporarySupersetNodeIds = computed(
    () =>
      new Set(
        this.composeWorkoutPresenter.temporarySuperset().map((node) => node.id),
      ),
  );

  constructor(
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    protected readonly exerciseDescriptors: ExerciseDescriptors,
    private readonly composeWorkoutPresenter: ComposeWorkoutComponentService,
    private readonly router: Router,
  ) {
    getLanguageRefresh$().pipe(untilDestroyed(this)).subscribe();
  }

  ngOnInit() {
    const { treeControl, dataSource, expansionModel } =
      this.composeWorkoutPresenter.init(this.resolvedComposedWorkoutData);

    this.treeControl = treeControl;
    this.dataSource = dataSource;
    this.treeExpansionModel = expansionModel;
  }

  ngOnDestroy() {
    this.releaseResources();
  }

  protected toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutPresenter.resetSuperset();
  }

  protected saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.composeWorkoutPresenter.saveSuperset();
  }

  protected decompose(decomposedNode: WorkoutItemFlatNode) {
    this.composeWorkoutPresenter.decompose(decomposedNode);
  }

  protected remove(node: WorkoutItemFlatNode) {
    this.composeWorkoutPresenter.removeFromWorkout(node);
  }

  protected saveWorkout() {
    this.composeWorkoutPresenter.saveWorkout({
      ...(this.resolvedComposedWorkoutData.workoutBasicInfo ?? {}),
      ...this.workoutForm.value['workoutBasicInfo'],
    });

    this.releaseResources();
    this.router.navigate(['workouts', 'all']);
  }

  protected trackById(_: number, node: WorkoutItem): string | number {
    return node.id;
  }

  protected drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    this.composeWorkoutPresenter.drop(event);
  }

  protected addToSuperset(node: WorkoutItemFlatNode) {
    this.composeWorkoutPresenter.addToSuperset(node);
  }

  protected removeFromTemporarySuperset(node: WorkoutItemFlatNode) {
    this.composeWorkoutPresenter.removeFromTemporarySuperset(node);
  }

  protected showExerciseDetails(id: string) {
    this.composeWorkoutPresenter.showExerciseDetails(id);
  }

  private releaseResources() {
    this.composeWorkoutPresenter.releaseResources();
  }
}
