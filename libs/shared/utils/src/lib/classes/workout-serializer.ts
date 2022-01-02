import { MUSCLE_KEYS } from '@fitness-tracker/exercises/model';
import { SerializerStrategy } from '../interfaces/serializer.interface';
import { InstructionType, WorkoutItem } from './workout';

export interface WorkoutBasicInfo {
  name: string;
  id?: string;
  muscles: typeof MUSCLE_KEYS[number][];
  importantNotes: string[];
  description: string;
  coverUrl: string;
}

export interface SerializedWorkout extends WorkoutBasicInfo {
  content: SerializeWorkoutItem[];
}

export interface SerializeWorkoutItem {
  children: SerializeWorkoutItem[] | null;
  id: string;
  name: string;
  parentId: string | null;
  type: InstructionType | null;
  load: number | null;
  restPauseBetween: number;
  restPauseAfterComplete: number;
  totalSets: number;
}

export class ConcreteWorkoutItemSerializer
  implements SerializerStrategy<SerializeWorkoutItem, WorkoutItem>
{
  public serialize({
    id,
    name,
    parent,
    children,
    instructionStrategy: {
      load,
      type,
      restPauseAfterComplete,
      restPauseBetween,
      totalSets,
    },
  }: WorkoutItem): SerializeWorkoutItem {
    const serializedChildren =
      children?.map((child: WorkoutItem) =>
        child.serializerStrategy.serialize(child),
      ) ?? null;
    return {
      children: serializedChildren,
      id,
      name,
      parentId: parent?.id ?? null,
      load,
      type,
      restPauseAfterComplete,
      restPauseBetween,
      totalSets,
    };
  }
  // public deserialize({
  //   children,
  //   id,
  //   name,
  //   parentId,
  //   load,
  //   type,
  //   restPauseAfterComplete,
  //   restPauseBetween,
  //   totalSets,
  // }: SerializeWorkoutItem): WorkoutItem {
  //   const deserializedItem = children
  //     ? new WorkoutItemComposite(
  //         name,
  //         [],
  //         new ConcreteCompositeWorkoutItemInstruction(
  //           load,
  //           type,
  //           restPauseAfterComplete,
  //           restPauseBetween,
  //           totalSets,
  //         ),
  //         id,
  //         null,
  //         new ConcreteWorkoutItemSerializer(),
  //       )
  //     : new SingleWorkoutItem();
  // }
}
