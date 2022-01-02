export enum InstructionType {
  'REPS' = 'REPS',
  'DURATION' = 'DURATION',
}

export const DEFAULT_REST_PAUSE = 0;
export const DEFAULT_TOTAL_SETS = 1;

export type IInstruction<T = Record<string, any>> = {
  [P in keyof T]: T[P];
};
export abstract class Instruction implements WorkoutItemInstruction {
  public abstract load: number | null;
  public abstract type: InstructionType | null;
  public abstract restPauseBetween: number;
  public abstract restPauseAfterComplete: number;
  public abstract totalSets: number;

  public isValid(): boolean {
    return Boolean(
      this.load &&
        this.load >= 0 &&
        this.type &&
        InstructionType[this.type] &&
        this.restPauseBetween >= DEFAULT_REST_PAUSE &&
        this.restPauseBetween >= DEFAULT_REST_PAUSE &&
        this.totalSets >= DEFAULT_TOTAL_SETS,
    );
  }

  public reset(): void {
    this.load = null;
    this.restPauseBetween = DEFAULT_REST_PAUSE;
    this.restPauseAfterComplete = DEFAULT_REST_PAUSE;
  }
}

export interface WorkoutItemInstruction {
  load: number | null;
  type: InstructionType | null;
  restPauseBetween: number;
  restPauseAfterComplete: number;
  totalSets: number;
  isValid: () => boolean;
  reset: () => void;
}

export interface CompositeWorkoutItemInstruction
  extends WorkoutItemInstruction {
  type: InstructionType.REPS;
}
export class ConcreteSingleWorkoutItemInstruction extends Instruction {
  public load: number | null = null;
  public type: InstructionType | null = null;
  public restPauseBetween: number = DEFAULT_REST_PAUSE;
  public restPauseAfterComplete: number = DEFAULT_REST_PAUSE;
  public totalSets: number = DEFAULT_TOTAL_SETS;

  public reset(): void {
    super.reset();
    this.load = null;
  }
}

export class ConcreteCompositeWorkoutItemInstruction extends Instruction {
  public readonly type = InstructionType.REPS;
  public load: number | null = null;
  public restPauseBetween: number = DEFAULT_REST_PAUSE;
  public restPauseAfterComplete: number = DEFAULT_REST_PAUSE;
  public totalSets: number = DEFAULT_TOTAL_SETS;

  public reset(): void {
    super.reset();
  }
}

export interface WorkoutItem {
  instructionStrategy: WorkoutItemInstruction;
  name: string;
  id: string;
  children?: WorkoutItem[];
  parent: WorkoutItem | null;
  getInstructions: () => WorkoutItemInstruction;
  isValid: () => boolean;
  setParent(parentNode: WorkoutItem | null): WorkoutItem;
  remove(childNode: WorkoutItem): void;
}

export class WorkoutItemFlatNode {
  public get id(): string {
    return this.workoutItem.id;
  }

  constructor(
    public workoutItem: WorkoutItem,
    public expandable: boolean,
    public level: number,
  ) {}
}

export class SingleWorkoutItem implements WorkoutItem {
  constructor(
    public name: string,
    public id: string,
    public instructionStrategy: WorkoutItemInstruction,
    public parent: WorkoutItem | null = null,
  ) {}

  public getInstructions(): WorkoutItemInstruction {
    return this.instructionStrategy;
  }

  public setParent(parent: WorkoutItem | null): SingleWorkoutItem {
    this.parent = parent;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public remove(): void {}

  public isValid(): boolean {
    return this.instructionStrategy.isValid();
  }
}
export class WorkoutItemComposite implements WorkoutItem {
  public get id(): string {
    return this.name + '/' + this._id;
  }

  constructor(
    public name: string,
    public children: WorkoutItem[],
    public instructionStrategy: CompositeWorkoutItemInstruction,
    private _id: string,
    public parent: WorkoutItem | null = null,
  ) {}

  public getInstructions(): CompositeWorkoutItemInstruction {
    return this.instructionStrategy;
  }

  public isValid(): boolean {
    return this.children.every((child) => child.isValid());
  }

  public setParent(parent: WorkoutItem | null): WorkoutItem {
    this.parent = parent;
    return this;
  }

  public remove(node: WorkoutItem): void {
    this.children = this.children.filter(
      (childNode) => childNode.id !== node.id,
    );
  }
}
