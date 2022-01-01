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

  public insertTest(): void {
    console.log('this.data[WorkoutDatabase]', this.data);
  }

  insertItem(parent: WorkoutItem, child: WorkoutItem): WorkoutItem {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child.setParent(parent));

    this.dataChange.next(this.data);
    return child;
  }

  public addItem(node: WorkoutItem): WorkoutItem {
    this.data.push(node);
    this.dataChange.next(this.data);

    return node;
  }

  public deleteItem(node: WorkoutItem): void {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  private deleteNode(nodes: WorkoutItem[], nodeToDelete: WorkoutItem) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}

export const getLevel = (node: WorkoutItemFlatNode) => node.level;
export const isExpandable = (node: WorkoutItemFlatNode) => node.expandable;
export const getChildren = (node: WorkoutItem): Observable<WorkoutItem[]> =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  of(node.children!);
export const hasChild = (_: number, nodeData: WorkoutItemFlatNode) =>
  nodeData.expandable;
