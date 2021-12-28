import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  ConcreteSingleWorkoutItemInstruction,
  SingleWorkoutItem,
  WorkoutItem,
  WorkoutItemFlatNode,
} from '../..';

@Injectable()
export class WorkoutDatabase {
  dataChange = new BehaviorSubject<WorkoutItem[]>([]);

  get data(): WorkoutItem[] {
    return this.dataChange.value;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public initialData: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
  ) {
    this.initialize(initialData);
  }

  private initialize(
    initialData: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
  ) {
    const data = this.buildFileTree(initialData, 0);

    console.log(data);

    this.dataChange.next(data);
  }

  public buildFileTree(
    initialData: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
    level: number,
    parentId: string = '0',
  ): WorkoutItem[] {
    return initialData.map(
      ({ name, id }) =>
        new SingleWorkoutItem(
          name,
          `${level}/${id}`,
          new ConcreteSingleWorkoutItemInstruction(),
        ),
    );
  }
}

export const transformer = (
  node: WorkoutItem,
  level: number,
): WorkoutItemFlatNode => node.setLevel(level);

export const getLevel = (node: WorkoutItemFlatNode) => node.level;
export const isExpandable = (node: WorkoutItemFlatNode) => node.expandable;
export const getChildren = (node: WorkoutItem): Observable<WorkoutItem[]> =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  of(node.children!);
export const hasChild = (_: number, nodeData: WorkoutItemFlatNode) =>
  nodeData.expandable;
