import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { EXERCISE_PICKER_QUERY, LOAD_EXERCISE_PICKER_LIST_COMMAND } from '@fitness-tracker/exercise/public-api';
import {
  calculateRampUpGuidance,
  computeDefaultProgramName,
  ensureUniqueProgramName,
  generateReloadCycle,
  LoadingConstraint,
  ProgramExcelExportService,
  ProgramStore,
  RepMaxTest,
} from '@fitness-tracker/program/domain';
import {
  AddMainLiftBlockComponent,
  DiscardChangesDialogService,
  MainLiftBlockCardComponent,
  ProgramDeleteButtonComponent,
  ProgramEditToggleComponent,
  ProgramNameHeaderComponent,
  ProgramStatus,
  ProgramStatusTabsComponent,
  RampUpGuidanceFn,
} from '@fitness-tracker/program/ui';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'ft-program-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ProgramStatusTabsComponent,
    ProgramNameHeaderComponent,
    MainLiftBlockCardComponent,
    AddMainLiftBlockComponent,
    ProgramEditToggleComponent,
    ProgramDeleteButtonComponent,
  ],
  template: `
    <div class="dashboard">
      <div class="toolbar">
        <button mat-flat-button color="primary" (click)="onCreateProgram()">
          <mat-icon>add</mat-icon> New Program
        </button>
      </div>

      <ft-program-status-tabs
        [draftPrograms]="store.draftPrograms()"
        [activePrograms]="store.activePrograms()"
        [completedPrograms]="store.completedPrograms()"
        [selectedProgramId]="store.selectedProgramId()"
        [activeStatus]="activeStatus()"
        (selectProgram)="onSelectProgram($event)"
        (statusChange)="onStatusTabChange($event)"
      />

      @if (selectedProgram(); as program) {
        <div class="name-row">
          <ft-program-name-header
            class="name-header"
            [name]="program.name"
            [readOnly]="readOnly()"
            [existingNames]="otherProgramNames()"
            (rename)="onRenameProgram($event)"
          />

          <div class="actions">
            @if (canDownloadExcel()) {
              <button mat-flat-button color="primary" (click)="onDownloadExcel()">
                <mat-icon>download</mat-icon>
                Download Excel
              </button>
            }

            <ft-program-edit-toggle
              [readOnly]="readOnly()"
              [dirty]="store.dirty()"
              [saveDisabled]="saveDisabled()"
              (startEdit)="startEdit(program.id)"
              (save)="saveProgram()"
              (cancelEditing)="cancelEdit()"
            />

            <ft-program-delete-button [programName]="program.name" (delete)="onDeleteProgram(program.id)" />
          </div>
        </div>

        @if (!readOnly()) {
          <mat-chip-set class="editing-chip-set">
            <mat-chip>Editing</mat-chip>
          </mat-chip-set>
        }

        <div class="grid" [class.editing-frame]="!readOnly()">
          @for (block of program.mainLiftBlocks; track block.id) {
            <ft-main-lift-block-card
              [block]="block"
              [exerciseName]="exerciseName(block.exerciseId)"
              [rampUpGuidance]="rampUpGuidance"
              [readOnly]="readOnly()"
              [sessionEpoch]="store.sessionEpoch()"
              (save)="onSaveBlock(block.id, $event)"
              (generate)="onGenerate(block.id, $event)"
              (remove)="onRemoveBlock(block.id)"
              (retestChange)="onRetestChange(block.id, $event)"
              (validityChange)="onBlockValidityChange(block.id, $event)"
            />
          }

          @if (!readOnly()) {
            <ft-add-main-lift-block [exercises]="exercises()" (add)="onAddBlock($event)" />
          }
        </div>
      } @else if (hasNoDraftPrograms()) {
        <div class="welcome">
          <mat-icon class="welcome-icon">trending_up</mat-icon>
          <h2>Start your Training Plan</h2>
          <p>Build a Program around your main lifts and generate a reload cycle to follow.</p>
          <button mat-flat-button color="primary" (click)="onCreateProgram()">
            <mat-icon>add</mat-icon> New Program
          </button>
        </div>
      } @else {
        <p class="empty">No Program selected in this status.</p>
      }
    </div>
  `,
  styleUrl: './program-dashboard.component.scss',
})
export class ProgramDashboardComponent {
  protected readonly store = inject(ProgramStore);
  private readonly auth = inject(AuthFacadeService);
  private readonly exercisePicker = inject(EXERCISE_PICKER_QUERY);
  private readonly loadExercisePickerList = inject(LOAD_EXERCISE_PICKER_LIST_COMMAND);
  private readonly snackBar = inject(MatSnackBar);
  private readonly discardChangesDialog = inject(DiscardChangesDialogService);
  private readonly excelExport = inject(ProgramExcelExportService);

  private readonly blockValidity = signal<Record<string, boolean>>({});

  protected readonly exercises = this.exercisePicker.exercisePickerList;
  protected readonly activeStatus = signal<ProgramStatus>('draft');

  /** A lifter with active or completed Programs but no draft still gets the CTA — there is nothing in progress to pick up. */
  protected readonly hasNoDraftPrograms = computed(
    () => this.store.draftPrograms().length === 0,
  );

  /** The selected Program's last-persisted state, never the draft — `selectedProgram`/`readOnly` key off this to stay correct even when a session is active. */
  private readonly livePersistedProgram = computed(
    () => this.store.programs().find((program) => program.id === this.store.selectedProgramId()) ?? null,
  );

  protected readonly selectedProgram = computed(() => {
    const persisted = this.livePersistedProgram();
    if (!persisted || persisted.status !== this.activeStatus()) {
      return null;
    }
    if (this.store.sessionActive()) {
      const draft = this.store.draftProgram();
      return draft && draft.id === persisted.id ? draft : persisted;
    }
    return persisted;
  });

  protected readonly readOnly = computed(() => {
    const persisted = this.livePersistedProgram();
    return !!persisted && !this.store.sessionActive();
  });

  protected readonly saveDisabled = computed(() => {
    const program = this.selectedProgram();
    if (!program) {
      return false;
    }
    if (program.mainLiftBlocks.length === 0) {
      return true;
    }
    const validity = this.blockValidity();
    return program.mainLiftBlocks.some((block) => validity[block.id] !== true);
  });

  /**
   * Download is a read-only action on a plan that exists to be followed — so it is
   * hidden on a `draft` (which has nothing worth taking to the gym yet) and while an
   * edit session is open (where the sheet would capture unsaved, in-flux numbers).
   */
  protected readonly canDownloadExcel = computed(() => {
    const program = this.selectedProgram();
    return !!program && program.status !== 'draft' && this.readOnly();
  });

  private readonly exerciseNameById = computed(() => new Map(this.exercises().map((e) => [e.id, e.name])));

  /** Program names are unique per user — every other Program's name, for the rename field to validate against. */
  protected readonly otherProgramNames = computed(() =>
    this.store
      .programs()
      .filter((program) => program.id !== this.store.selectedProgramId())
      .map((program) => program.name),
  );

  constructor() {
    this.loadExercisePickerList.loadExercisePickerList();
  }

  protected exerciseName(exerciseId: string): string {
    return this.exerciseNameById().get(exerciseId) ?? 'Unknown exercise';
  }

  protected readonly rampUpGuidance: RampUpGuidanceFn = calculateRampUpGuidance;

  protected async onCreateProgram(): Promise<void> {
    if (!(await this.guardLeavingSession())) {
      return;
    }
    const userId = this.auth.userInfo()?.uid;
    if (!userId) {
      return;
    }
    const name = ensureUniqueProgramName(
      computeDefaultProgramName(Date.now()),
      this.store.programs().map((program) => program.name),
    );
    const program = await this.store.createProgram(userId, name);
    this.activeStatus.set('draft');
    this.store.selectProgram(program.id);
    this.store.beginEditSession(program.id); // auto-start — see ticket 01 point 3
    this.blockValidity.set({});
  }

  protected async onSelectProgram(program: { id: string }): Promise<void> {
    if (!(await this.guardLeavingSession())) {
      return;
    }
    this.store.selectProgram(program.id);
    this.blockValidity.set({});
  }

  /**
   * Switches optimistically, then reverts on a blocked guard — not guard-first like
   * `onSelectProgram`. `MatTabGroup` mutates its own visual selection synchronously on
   * click, before any async guard can resolve; if `activeStatus()` never changes when
   * blocked, Angular's one-way `[selectedIndex]` binding has no diff to push and the
   * tab header stays stuck on the clicked tab. Reverting is a genuine value change, so
   * the binding does push it — the tab snaps back correctly. Safe to do optimistically:
   * `store.dirty()` only reflects the draft edit session, not `activeStatus()`.
   */
  protected async onStatusTabChange(status: ProgramStatus): Promise<void> {
    const previous = this.activeStatus();
    if (previous === status) {
      return;
    }
    this.activeStatus.set(status);
    if (!(await this.guardLeavingSession())) {
      this.activeStatus.set(previous);
      return;
    }
    this.store.cancelEditSession();
  }

  protected async onDeleteProgram(programId: string): Promise<void> {
    await this.store.deleteProgram(programId);
    if (this.store.selectedProgramId() === programId) {
      this.store.clearSelection();
    }
    this.notify('Program deleted');
  }

  protected onRenameProgram(name: string): void {
    this.store.stageRename(name);
  }

  /** Everything about the sheet and the file lives in the domain's export sink; this only reports failure. */
  protected async onDownloadExcel(): Promise<void> {
    const program = this.selectedProgram();
    if (!program) {
      return;
    }
    try {
      await this.excelExport.downloadProgram(program, this.exerciseNameById());
    } catch {
      this.notify('Could not generate the Excel file');
    }
  }

  protected onAddBlock(exerciseId: string): void {
    this.store.stageAddMainLiftBlock(exerciseId);
  }

  protected onRemoveBlock(blockId: string): void {
    this.store.stageRemoveMainLiftBlock(blockId);
  }

  protected onSaveBlock(blockId: string, inputs: { test: RepMaxTest; loadingConstraint: LoadingConstraint }): void {
    this.store.stageMainLiftBlockInputs(blockId, inputs);
  }

  protected onGenerate(blockId: string, fiveRepMaxGoal: number): void {
    const draft = this.store.draftProgram();
    const block = draft?.mainLiftBlocks.find((b) => b.id === blockId);
    if (!block?.test) {
      return;
    }
    const cycle = generateReloadCycle({
      test: block.test,
      loadingConstraint: block.loadingConstraint,
      fiveRepMaxGoal,
    });
    this.store.stageGeneratedCycle(blockId, cycle, fiveRepMaxGoal);
    this.notify('Reload Cycle generated');
  }

  protected onRetestChange(blockId: string, retest: number): void {
    this.store.stageWeek8Retest(blockId, retest);
  }

  protected onBlockValidityChange(blockId: string, valid: boolean): void {
    this.blockValidity.update((validity) => ({ ...validity, [blockId]: valid }));
  }

  protected startEdit(programId: string): void {
    this.store.beginEditSession(programId);
    this.blockValidity.set({});
  }

  protected async saveProgram(): Promise<void> {
    await this.store.saveProgram();
    this.notify('Saved');
  }

  protected cancelEdit(): void {
    this.store.cancelEditSession();
  }

  /** `CanDeactivate` entry point for the training-planner route guard — see program.routes.ts. */
  confirmLeave(): Promise<boolean> {
    return this.guardLeavingSession();
  }

  @HostListener('window:beforeunload', ['$event'])
  protected onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.store.dirty()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  /**
   * The shared three-option confirm for every leave-surface that can show a real dialog
   * (in-page Program/status-tab switch, route nav-away). Resolves `true` once it's safe
   * to proceed. See .scratch/training-planner-editing-model/issues/06-unsaved-changes-navigation-guard.md.
   */
  private async guardLeavingSession(): Promise<boolean> {
    if (!this.store.dirty()) {
      return true;
    }
    const result = await firstValueFrom(
      this.discardChangesDialog.confirm({
        title: 'Discard changes?',
        body: 'You have unsaved changes to this Program. Leaving will lose them unless you save first.',
        keepEditingLabel: 'Stay',
        discardLabel: 'Discard & leave',
        saveLabel: 'Save & leave',
      }),
    );

    switch (result) {
      case 'save':
        await this.store.saveProgram();
        return true;
      case 'discard':
        this.store.cancelEditSession();
        return true;
      default:
        return false;
    }
  }

  private notify(message: string): void {
    this.snackBar.open(message, undefined, { duration: 2000 });
  }
}
