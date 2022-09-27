import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import {
  WorkoutItem,
  SingleWorkoutItem,
  ConcreteSingleWorkoutItemInstruction,
  WorkoutItemFlatNode,
} from '@fitness-tracker/workout/data';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { ComposeWorkoutData } from '../models/compose-workout-data.interface';

@Injectable()
export class WorkoutDatabase {
  dataChange = new BehaviorSubject<WorkoutItem[]>([]);

  get data(): WorkoutItem[] {
    return this.dataChange.value;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: ComposeWorkoutData,
  ) {
    console.log('dialogData', dialogData);

    this.initialize(dialogData.workoutContent);
  }

  public buildFileTree(
    initialData: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
  ): WorkoutItem[] {
    return initialData.map(
      ({ name, id }) =>
        new SingleWorkoutItem(
          name,
          id,
          new ConcreteSingleWorkoutItemInstruction(),
        ),
    );
  }

  public insertItem(parent: WorkoutItem, child: WorkoutItem): WorkoutItem {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child.setParent(parent));

    this.dataChange.next(this.data);
    return child;
  }

  public insertItemAbove(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
    const parentNode = this.getParentFromNodes(node);
    if (parentNode?.children) {
      parentNode.children.splice(
        parentNode.children.indexOf(node),
        0,
        item.setParent(parentNode),
      );
    } else {
      this.data.splice(this.data.indexOf(node), 0, item.setParent(parentNode));
    }
    this.dataChange.next(this.data);
    return item;
  }

  public insertItemBelow(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
    const parentNode = this.getParentFromNodes(node);

    if (parentNode?.children) {
      parentNode.children.splice(
        parentNode.children.indexOf(node) + 1,
        0,
        item.setParent(parentNode),
      );
    } else {
      this.data.splice(
        this.data.indexOf(node) + 1,
        0,
        item.setParent(parentNode),
      );
    }
    this.dataChange.next(this.data);
    return item;
  }

  public addItem(node: WorkoutItem): WorkoutItem {
    this.data.push(node.setParent(null));
    this.dataChange.next(this.data);

    return node;
  }

  public deleteItem(node: WorkoutItem): void {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  private initialize(initialData: WorkoutItem[]) {
    this.dataChange.next(initialData);
  }

  private getParentFromNodes(node: WorkoutItem): WorkoutItem | null {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  private getParent(
    currentRoot: WorkoutItem,
    node: WorkoutItem,
  ): WorkoutItem | null {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
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
