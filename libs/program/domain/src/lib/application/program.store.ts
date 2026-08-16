import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { LoadingConstraint } from '../entities/models/loading-constraint';
import { AnchorSource } from '../entities/models/anchor-source';
import { MainLiftBlock } from '../entities/models/main-lift-block';
import { Program, ProgramStatus } from '../entities/models/program';
import { RepMaxTest } from '../entities/models/rep-max-test';
import { WeekPrescription } from '../entities/models/week-prescription';
import { ProgramService } from '../infrastructure/program.service';

interface ProgramsState {
  programs: Program[];
  loading: boolean;
  error: unknown;
  /**
   * Single-slot staged edit session — the dashboard only ever shows one selected
   * Program at a time, so a map keyed by programId would hold state the UI can
   * never exercise. See .scratch/training-planner-editing-model/issues/02-edit-session-architecture.md.
   */
  draftProgram: Program | null;
  /** Bumped on beginEditSession/cancelEditSession/saveProgram — a session-boundary signal for UI staleness resets, distinct from ordinary draft field patches. */
  sessionEpoch: number;
  /** Which Program the dashboard is currently showing — UI selection, not persisted. */
  selectedProgramId: string | null;
  /** Whether the selected Program's edit session is currently active (Save/Cancel visible vs. read-only). Single-slot, like `draftProgram` — only ever describes the selected Program. */
  sessionActive: boolean;
}

const initialState: ProgramsState = {
  programs: [],
  loading: false,
  error: null,
  draftProgram: null,
  sessionEpoch: 0,
  selectedProgramId: null,
  sessionActive: false,
};

function replaceProgram(programs: Program[], updated: Program): Program[] {
  return programs.map((program) => (program.id === updated.id ? updated : program));
}

function replaceDraftBlock(
  draft: Program,
  blockId: string,
  updater: (block: MainLiftBlock) => MainLiftBlock,
): Program {
  return {
    ...draft,
    mainLiftBlocks: draft.mainLiftBlocks.map((block) => (block.id === blockId ? updater(block) : block)),
  };
}

function findProgramOrThrow(programs: Program[], programId: string): Program {
  const program = programs.find((p) => p.id === programId);
  if (!program) {
    throw new Error(`Program not found: ${programId}`);
  }
  return program;
}

function everyBlockRetested(program: Program): boolean {
  return program.mainLiftBlocks.length > 0 && program.mainLiftBlocks.every((block) => block.week8Retest != null);
}

/** Strips bookkeeping fields that shouldn't count toward the dirty check. */
function normalizeForDiff(program: Program): unknown {
  const { name, mainLiftBlocks } = program;
  return { name, mainLiftBlocks };
}

/**
 * First `@ngrx/signals` `signalStore` in this repo — a deliberate pilot for the
 * `program` domain, safe because its internals stay private behind the module
 * boundary. Plain `async`/`await` Firestore I/O, no Observables/Effects. See
 * .scratch/strength-reload-calculator/issues/08-real-implementation-architecture.md.
 */
export const ProgramStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ programs, draftProgram }) => ({
    draftPrograms: computed(() => programs().filter((program) => program.status === 'draft')),
    activePrograms: computed(() => programs().filter((program) => program.status === 'active')),
    completedPrograms: computed(() => programs().filter((program) => program.status === 'completed')),
    /**
     * Structural diff of `draftProgram` against its last-persisted counterpart — not a
     * sticky touched-flag, so e.g. adding then removing a block nets to not-dirty. See
     * .scratch/training-planner-editing-model/issues/06-unsaved-changes-navigation-guard.md.
     */
    dirty: computed(() => {
      const draft = draftProgram();
      if (!draft) {
        return false;
      }
      const persisted = programs().find((program) => program.id === draft.id);
      if (!persisted) {
        return false;
      }
      return JSON.stringify(normalizeForDiff(draft)) !== JSON.stringify(normalizeForDiff(persisted));
    }),
  })),
  withMethods((store, programService = inject(ProgramService)) => ({
    async loadPrograms(userId: string): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const programs = await programService.findPrograms(userId);
        patchState(store, { programs, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    /** Stays immediate — a real Firestore id is needed to seed/anchor the draft slot at all. */
    async createProgram(userId: string, name: string): Promise<Program> {
      const now = Date.now();
      const created = await programService.createProgram({
        userId,
        name,
        status: 'draft',
        strategy: 'strength-reload',
        mainLiftBlocks: [],
        createdAt: now,
        updatedAt: now,
      });
      patchState(store, { programs: [...store.programs(), created] });
      return created;
    },

    /** Stays immediate — whole-entity removal, not a field Save owns, orthogonal to editing. */
    async deleteProgram(programId: string): Promise<void> {
      await programService.deleteProgram(programId);
      const programs = store.programs().filter((program) => program.id !== programId);
      patchState(store, {
        programs,
        draftProgram: store.draftProgram()?.id === programId ? null : store.draftProgram(),
      });
    },

    /** Selects a Program for viewing; always ends any active session for whatever was previously selected. */
    selectProgram(programId: string): void {
      patchState(store, { selectedProgramId: programId, sessionActive: false });
    },

    /** Clears the selection — used when the selected Program is deleted and nothing takes its place. */
    clearSelection(): void {
      patchState(store, { selectedProgramId: null, sessionActive: false });
    },

    /** Seeds `draftProgram` from the current live Program — called automatically right after creation and on explicit Edit click otherwise. */
    beginEditSession(programId: string): void {
      const program = findProgramOrThrow(store.programs(), programId);
      patchState(store, { draftProgram: { ...program }, sessionEpoch: store.sessionEpoch() + 1, sessionActive: true });
    },

    /** Discards staged changes and reverts `draftProgram` to last-persisted state. */
    cancelEditSession(): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const persisted = store.programs().find((program) => program.id === draft.id) ?? null;
      patchState(store, {
        draftProgram: persisted ? { ...persisted } : null,
        sessionEpoch: store.sessionEpoch() + 1,
        sessionActive: false,
      });
    },

    stageRename(name: string): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      patchState(store, { draftProgram: { ...draft, name } });
    },

    stageAddMainLiftBlock(exerciseId: string): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const newBlock: MainLiftBlock = {
        id: crypto.randomUUID(),
        exerciseId,
        test: null,
        loadingConstraint: { increment: 2.5, roundingMode: 'nearest' },
        anchorSource: null,
        cycle: null,
        manualWeek5: null,
        week8Retest: null,
      };
      patchState(store, { draftProgram: { ...draft, mainLiftBlocks: [...draft.mainLiftBlocks, newBlock] } });
    },

    /** Plain filter, no tombstone — a block added and removed within the same session nets to a no-op. */
    stageRemoveMainLiftBlock(blockId: string): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      patchState(store, {
        draftProgram: { ...draft, mainLiftBlocks: draft.mainLiftBlocks.filter((block) => block.id !== blockId) },
      });
    },

    /** Stages a block's Rep Max Test + Loading Constraint — driven by the form's automatic blur-stage, not an explicit click. */
    stageMainLiftBlockInputs(
      blockId: string,
      inputs: { test: RepMaxTest; loadingConstraint: LoadingConstraint },
    ): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const updated = replaceDraftBlock(draft, blockId, (block) => ({
        ...block,
        test: inputs.test,
        loadingConstraint: inputs.loadingConstraint,
      }));
      patchState(store, { draftProgram: updated });
    },

    /**
     * Generate is a pure, non-persisting preview — this only lands its result in the
     * draft slot for Save to later commit. `manualWeek5` is whatever was fed into the
     * generation call, so a regenerate without the override naturally nulls it out.
     */
    stageGeneratedCycle(
      blockId: string,
      cycle: WeekPrescription[],
      anchorSource: AnchorSource,
      manualWeek5: number | null,
    ): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const updated = replaceDraftBlock(draft, blockId, (block) => ({ ...block, anchorSource, cycle, manualWeek5 }));
      patchState(store, { draftProgram: updated });
    },

    /** Staged like every other field now — one write path into `status`/`week8Retest` at Save, not a special immediate case. */
    stageWeek8Retest(blockId: string, retest: number): void {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const updated = replaceDraftBlock(draft, blockId, (block) => ({ ...block, week8Retest: retest }));
      patchState(store, { draftProgram: updated });
    },

    /**
     * Commits the whole draft in one `setDoc`, recomputing status fresh against the
     * draft every time (so e.g. an Active Program silently reverts to Draft if a newly
     * added block hasn't been generated yet, and a Completed Program can silently
     * revert to Active): Draft → Active once every block has a generated cycle;
     * → Completed once every block also has a retest.
     */
    async saveProgram(): Promise<void> {
      const draft = store.draftProgram();
      if (!draft) {
        return;
      }
      const everyBlockGenerated =
        draft.mainLiftBlocks.length > 0 && draft.mainLiftBlocks.every((block) => block.cycle != null);
      const status: ProgramStatus = everyBlockRetested(draft)
        ? 'completed'
        : everyBlockGenerated
          ? 'active'
          : 'draft';
      const updated: Program = { ...draft, status, updatedAt: Date.now() };
      await programService.updateProgram(updated);
      patchState(store, {
        programs: replaceProgram(store.programs(), updated),
        draftProgram: updated,
        sessionEpoch: store.sessionEpoch() + 1,
        sessionActive: false,
      });
    },
  })),
);
