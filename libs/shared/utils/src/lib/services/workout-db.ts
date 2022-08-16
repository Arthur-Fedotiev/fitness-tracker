import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Exercise } from 'shared-package';
import {
  ConcreteSingleWorkoutItemInstruction,
  SingleWorkoutItem,
  WithId,
  WorkoutItem,
  WorkoutItemFlatNode,
} from '../..';

export type Item = WithId<Exercise>;

@Injectable()
export class WorkoutDatabase {
  dataChange = new BehaviorSubject<WorkoutItem[]>([]);

  get data(): WorkoutItem[] {
    return this.dataChange.value;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public initialData: Item[],
  ) {
    this.initialize(initialData);
  }

  private initialize(initialData: Item[]) {
    this.dataChange.next(this.buildFileTree(initialData));
  }

  public buildFileTree(initialData: Item[]): WorkoutItem[] {
    return initialData.map(
      ({ name, id }) =>
        new SingleWorkoutItem(
          name,
          id,
          new ConcreteSingleWorkoutItemInstruction(),
        ),
    );
  }

  insertItem(parent: WorkoutItem, child: WorkoutItem): WorkoutItem {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child.setParent(parent));

    this.dataChange.next(this.data);
    return child;
  }

  insertItemAbove(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
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

  insertItemBelow(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
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

  getParentFromNodes(node: WorkoutItem): WorkoutItem | null {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: WorkoutItem, node: WorkoutItem): WorkoutItem | null {
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

  public addItem(node: WorkoutItem): WorkoutItem {
    this.data.push(node.setParent(null));
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
