import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import {
  ExerciseMetaCollectionsDictionaryUnit,
  ExercisesEntity,
  ExerciseVM,
  EXERCISE_MODE,
} from '@fitness-tracker/exercises/model';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
  loadIsolatedLang,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  merge,
  Observable,
  scan,
  skip,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ComposeWorkoutComponent } from '@fitness-tracker/shared/dialogs';
import { ROLES } from 'shared-package';

@UntilDestroy()
@Component({
  selector: 'ft-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDisplayComponent implements OnInit, OnDestroy {
  public readonly roles = ROLES;

  public readonly exerciseMode = EXERCISE_MODE;
  public readonly exercisesList$: Observable<ExerciseVM[]> =
    this.exerciseFacade.exercisesList$.pipe(
      tap(() => this.isLoadingProhibited.next(false)),
    );

  private readonly isLoadingProhibited = new BehaviorSubject(false);
  public readonly isLoadingProhibited$ =
    this.isLoadingProhibited.asObservable();

  private readonly loadExercises: Subject<{ isLoadMore: boolean }> =
    new Subject<{ isLoadMore: boolean }>();
  private readonly loadExercises$: Observable<Pagination> = this.loadExercises
    .asObservable()
    .pipe(
      tap(() => this.isLoadingProhibited.next(true)),
      map(({ isLoadMore }: { isLoadMore: boolean }) => ({
        ...DEFAULT_PAGINATION_STATE,
        firstPage: !isLoadMore,
      })),
      tap(this.findExercises.bind(this)),
      untilDestroyed(this),
    );

  private readonly refreshExercises$ = this.settingsFacade.language$.pipe(
    loadIsolatedLang(this.translateService),
    skip(1),
    tap(() => this.refreshExercises(DEFAULT_PAGINATION_STATE)),
    untilDestroyed(this),
  );

  private readonly composeWorkout = new Subject<{ id: string; add: boolean }>();
  public readonly composeWorkout$: Observable<
    Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[]
  > = this.composeWorkout.asObservable().pipe(
    scan((exercisesSet, { id, add }) => {
      add ? exercisesSet.add(id) : exercisesSet.delete(id);
      return exercisesSet;
    }, new Set<string>()),
    switchMap((idsSet) => this.exerciseFacade.exercisePreviews$(idsSet)),
  );

  constructor(
    private readonly exerciseFacade: ExercisesFacade,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.refreshExercises$.subscribe();
    this.loadExercises$.subscribe();
    this.loadExercises.next({ isLoadMore: false });
    this.exerciseFacade.loadExercisesMeta();
  }

  public ngOnDestroy(): void {
    this.releaseResources();
  }

  public navigate(mode: EXERCISE_MODE, id: string): void {
    this.router.navigate(['..', id, mode], { relativeTo: this.route });
  }

  public deleteExercise(id: string): void {
    this.exerciseFacade.deleteExercise(id);
  }

  public loadMoreExercises(isLoadMore: boolean): void {
    this.loadExercises.next({ isLoadMore });
  }

  public addToComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: true });
  }

  public proceedComposing(
    workoutExercisesList: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
  ): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '100vw';
    dialogConfig.minHeight = '100vh';

    dialogConfig.data = workoutExercisesList;

    const dialogRef = this.dialog.open(ComposeWorkoutComponent, dialogConfig);
  }

  public showExerciseDetails(id: string): void {
    this.exerciseFacade.openExerciseDetailsDialog(id);
  }

  public removeFromComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: false });
  }

  private findExercises(paginationData: Pagination): void {
    this.exerciseFacade.findExercises(paginationData);
  }

  private refreshExercises(paginationData: Pagination): void {
    this.exerciseFacade.refreshExercises(paginationData);
  }

  private releaseResources(): void {
    this.exerciseFacade.emptyExercisesList();
  }
}
