/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
} from '@fitness-tracker/workout-domain';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import {
  WorkoutDatabase,
  getLevel,
  isExpandable,
  getChildren,
} from './workout-db';
import { ComposeWorkoutData } from '../models/compose-workout-data.interface';

@UntilDestroy()
@Injectable()
export class ComposeWorkoutTreeService {
  private readonly flatNodeMap = new Map<WorkoutItemFlatNode, WorkoutItem>();
  private readonly nestedNodeMap = new Map<WorkoutItem, WorkoutItemFlatNode>();

  public treeControl!: FlatTreeControl<WorkoutItemFlatNode>;
  public treeFlattener!: MatTreeFlattener<WorkoutItem, WorkoutItemFlatNode>;
  public dataSource!: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  public expansionModel = new SelectionModel<string>(true);

  constructor(private readonly workoutDB: WorkoutDatabase) {}

  public initialize(initialData: ComposeWorkoutData['workoutContent']) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      getLevel,
      isExpandable,
      getChildren,
    );
    this.treeControl = new FlatTreeControl<WorkoutItemFlatNode>(
      getLevel,
      isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );

    this.workoutDB.initialize(initialData);

    this.workoutDB.dataChange.pipe(untilDestroyed(this)).subscribe((data) => {
      this.rebuildTreeForData(data);
    });
  }

  public getNestedNode(flatNode: WorkoutItemFlatNode): WorkoutItem {
    return this.flatNodeMap.get(flatNode)!;
  }

  public getFlatNode(nestedNode: WorkoutItem): WorkoutItemFlatNode {
    return this.nestedNodeMap.get(nestedNode)!;
  }

  public transformer = (
    nodeItem: WorkoutItem,
    level: number,
  ): WorkoutItemFlatNode => {
    const existingNode = this.nestedNodeMap.get(nodeItem);
    const flatNode =
      existingNode?.workoutItem === nodeItem
        ? existingNode
        : new WorkoutItemFlatNode(nodeItem, Boolean(level), level);
    flatNode.workoutItem = nodeItem;
    flatNode.level = level;
    flatNode.expandable = Boolean(nodeItem.children);
    this.flatNodeMap.set(flatNode, nodeItem);
    this.nestedNodeMap.set(nodeItem, flatNode);
    return flatNode;
  };

  public deleteItem(node: WorkoutItem): void {
    this.workoutDB.deleteItem(node);
  }

  public insertItemAbove(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
    return this.workoutDB.insertItemAbove(node, item);
  }

  public insertItemBelow(node: WorkoutItem, item: WorkoutItem): WorkoutItem {
    return this.workoutDB.insertItemBelow(node, item);
  }

  public insertItem(node: WorkoutItemFlatNode, parent: WorkoutItem): void {
    this.workoutDB.insertItem(parent, this.flatNodeMap.get(node)!);
  }

  public addItem(set: WorkoutItem): WorkoutItem {
    return this.workoutDB.addItem(set);
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    this.flatNodeMap
      .get(decomposedNode)
      ?.children?.forEach((child) =>
        this.workoutDB.addItem(child.setParent(null)),
      );

    this.workoutDB.deleteItem(this.flatNodeMap.get(decomposedNode)!);
  }

  public removeFromSuperset(node: WorkoutItemFlatNode): void {
    const item: WorkoutItem = this.flatNodeMap.get(node)!;

    this.workoutDB.deleteItem(item);
    this.workoutDB.addItem(item.setParent(null));
  }

  public removeFromWorkout(node: WorkoutItemFlatNode): void {
    const item: WorkoutItem = this.flatNodeMap.get(node)!;

    this.workoutDB.deleteItem(item);
  }

  private rebuildTreeForData(data: WorkoutItem[]) {
    this.dataSource.data = [];
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === id);
      node && this.treeControl.expand(node);
    });
  }
}
