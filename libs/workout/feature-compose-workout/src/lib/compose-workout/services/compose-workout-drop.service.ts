import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
} from '@fitness-tracker/workout-domain';

import { ComposeWorkoutTreeService } from './compose-workout-tree.service';

@Injectable()
export class ComposeWorkoutDropService {
  constructor(private readonly treeService: ComposeWorkoutTreeService) {}
  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    if (!event.isPointerOverContainer) return;

    const visibleNodes: WorkoutItem[] = this.visibleNodes();

    const isDraggedAcrossLevels = (
      previousLevel: number,
      currentLevel: number,
    ) =>
      previousLevel !== currentLevel ||
      !!(
        nodeAtDest.parent &&
        visibleNodes[event.currentIndex].parent &&
        nodeAtDest.parent.id !== visibleNodes[event.currentIndex].id
      );

    // recursive find function to find siblings of node
    function findNodeSiblings(
      currentFlatData: WorkoutItem[],
      destNodeId: string,
    ): WorkoutItem[] | null {
      let result = null;
      let subResult;

      currentFlatData.forEach((item, i) => {
        if (item.id === destNodeId) {
          result = currentFlatData;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, destNodeId);
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

    if (isDraggedAcrossLevels(flatNodeAtDest.level, nodeDragged.level)) {
      const isDroppedInto = nodeDragged.level < flatNodeAtDest.level;

      if (isDroppedInto) {
        nodeAtDest.children
          ? this.treeService.insertItemAbove(
              nodeAtDest.children[0],
              nodeToInsert,
            )
          : this.treeService.insertItemAbove(nodeAtDest, nodeToInsert);

        return;
      }
    }

    event.currentIndex > event.previousIndex
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
