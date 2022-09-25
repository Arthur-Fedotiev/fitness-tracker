import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
} from '@fitness-tracker/workout/data';

import { ComposeWorkoutTreeService } from './compose-wrkout-tree.service';

@Injectable()
export class ComposeWorkoutDropService {
  constructor(private readonly treeService: ComposeWorkoutTreeService) {}
  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    if (!event.isPointerOverContainer) return;

    const visibleNodes: WorkoutItem[] = this.visibleNodes();

    const isDroppedToBottomOfLevel = (
      nodeAtDest: WorkoutItem,
      siblings: WorkoutItem[],
    ): boolean => {
      return nodeAtDest.id === siblings[siblings.length - 1].id;
    };

    const isDraggedAcrossLevels = (
      previousLevel: number,
      currentLevel: number,
    ) => previousLevel !== currentLevel;

    // recursive find function to find siblings of node
    function findNodeSiblings(
      arr: WorkoutItem[],
      id: string,
    ): WorkoutItem[] | null {
      let result = null;
      let subResult;

      arr.forEach((item, i) => {
        if (item.id === id) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, id);
          if (subResult) result = subResult;
        }
      });
      return result;
    }

    // determine where to insert the node
    const nodeAtDest: WorkoutItem = visibleNodes[event.currentIndex];
    const flatNodeAtDest: WorkoutItemFlatNode =
      this.treeService.getFlatNode(nodeAtDest);

    const nodeDragged: WorkoutItemFlatNode = event.item.data;
    const nodeToInsert = this.treeService.getNestedNode(nodeDragged);

    if (nodeAtDest === nodeToInsert) return;

    const newSiblings: WorkoutItem[] | null = findNodeSiblings(
      this.treeService.dataSource.data,
      nodeAtDest?.id,
    );

    if (!newSiblings) return;

    const nodeAtDestFlatNode = this.treeService.treeControl.dataNodes.find(
      (n) => nodeAtDest.id === n.id,
    );

    if (nodeDragged.expandable && !nodeAtDestFlatNode?.expandable) {
      alert('Supersets cannot consist of other supersets!');
      return;
    }

    this.treeService.deleteItem(nodeToInsert);

    if (nodeAtDest.id === nodeDragged?.id) return;

    isDroppedToBottomOfLevel(nodeAtDest, newSiblings) &&
    !isDraggedAcrossLevels(flatNodeAtDest.level, nodeDragged.level)
      ? this.treeService.insertItemBelow(nodeAtDest, nodeToInsert)
      : this.treeService.insertItemAbove(nodeAtDest, nodeToInsert);
  }

  private visibleNodes(): WorkoutItem[] {
    const result: WorkoutItem[] = [];

    function addExpandedChildren(node: WorkoutItem, expanded: string[]) {
      result.push(node);
      if (expanded.includes(node.id) && node.children) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    this.treeService.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.treeService.expansionModel.selected);
    });
    return result;
  }
}
