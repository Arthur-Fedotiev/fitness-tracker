import { Injectable } from '@angular/core';

import { SerializerStrategy, WithId } from '@fitness-tracker/shared/utils';
import {
  ConcreteCompositeWorkoutItemInstruction,
  ConcreteSingleWorkoutItemInstruction,
  InstructionType,
  SingleWorkoutItem,
  WorkoutItem,
  WorkoutItemComposite,
} from './workout';

export interface WorkoutBasicInfo {
  name: string;
  id?: string;
  targetMuscles: string[];
  importantNotes: string;
  description: string;
  coverUrl: string;
  avatarUrl: string;
  level: string;
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

export interface WorkoutDetails extends WorkoutBasicInfo {
  content: (SerializeWorkoutItem | (SerializeWorkoutItem & WithId<unknown>))[];
}

@Injectable({ providedIn: 'root' })
export class ConcreteWorkoutItemSerializer extends SerializerStrategy<
  SerializeWorkoutItem,
  WorkoutItem
> {
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
      children?.map((child: WorkoutItem) => this.serialize(child)) ?? null;
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
  public deserialize({
    children,
    id,
    name,
    load,
    type,
    restPauseAfterComplete,
    restPauseBetween,
    totalSets,
  }: SerializeWorkoutItem): WorkoutItem {
    const deserializedItem = children
      ? new WorkoutItemComposite(
          name,
          children.map((child) => this.createOrphan(child)),
          new ConcreteCompositeWorkoutItemInstruction(
            load,
            type,
            restPauseAfterComplete,
            restPauseBetween,
            totalSets,
          ),
          id,
          null,
        )
      : this.createOrphan({
          id,
          name,
          load,
          type,
          restPauseAfterComplete,
          restPauseBetween,
          totalSets,
        });

    deserializedItem.children &&
      deserializedItem.children.map((child) =>
        child.setParent(deserializedItem),
      );

    return deserializedItem;
  }

  private createOrphan({
    id,
    name,
    load,
    type,
    restPauseAfterComplete,
    restPauseBetween,
    totalSets,
  }: Omit<SerializeWorkoutItem, 'children' | 'parentId'>): WorkoutItem {
    return new SingleWorkoutItem(
      name,
      id,
      new ConcreteSingleWorkoutItemInstruction(
        load,
        type,
        restPauseAfterComplete,
        restPauseBetween,
        totalSets,
      ),
      null,
    );
  }
}
