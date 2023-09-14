import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import {
  WorkoutItemFlatNode,
  WorkoutItem,
} from '@fitness-tracker/workout-domain';

import { ComposeWorkoutTreeService } from './compose-workout-tree.service';

@Injectable()
export class ComposeWorkoutDropService {
  constructor(
    private readonly treeService: ComposeWorkoutTreeService,
    private readonly snackBar: MatSnackBar,
  ) {}
  public drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    if (!event.isPointerOverContainer) return;

    const visibleNodes: WorkoutItem[] = this.visibleNodes();

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
      ({ id }) => nodeAtDest.id === id,
    )!;

    if (this.isSupersetDroppedIntoSuperset(nodeDragged, nodeAtDestFlatNode)) {
      this.showCannotDropIntoSupersetMessage();
      return;
    }

    if (nodeAtDest.id === nodeDragged?.id) {
      return;
    }

    this.treeService.deleteItem(nodeToInsert);

    const isDraggedBetweenSets =
      nodeAtDest.parent &&
      visibleNodes[event.currentIndex].parent &&
      nodeAtDest.parent.id !== visibleNodes[event.currentIndex].parent!.id;

    const isDraggedAcrossLevels =
      flatNodeAtDest.level !== nodeDragged.level || isDraggedBetweenSets;

    if (isDraggedAcrossLevels) {
      this.insertNodeIntoAnotherLevel(
        nodeDragged,
        flatNodeAtDest,
        nodeToInsert,
        nodeAtDest,
        event,
      );

      return;
    }

    event.currentIndex > event.previousIndex
      ? this.treeService.insertItemBelow(nodeAtDest, nodeToInsert)
      : this.treeService.insertItemAbove(nodeAtDest, nodeToInsert);
  }

  private insertNodeIntoAnotherLevel(
    nodeDragged: WorkoutItemFlatNode,
    flatNodeAtDest: WorkoutItemFlatNode,
    nodeToInsert: WorkoutItem,
    nodeAtDest: WorkoutItem,
    event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>,
  ): void {
    const upLevel = nodeDragged.level < flatNodeAtDest.level;

    if (upLevel) {
      nodeAtDest.children
        ? this.treeService.insertItemAbove(nodeAtDest.children[0], nodeToInsert)
        : this.treeService.insertItemAbove(nodeAtDest, nodeToInsert);
      return;
    }

    // TODO: verify that
    event.currentIndex > event.previousIndex
      ? this.treeService.insertItemBelow(nodeAtDest, nodeToInsert)
      : this.treeService.insertItemAbove(nodeAtDest, nodeToInsert);
  }

  private isSupersetDroppedIntoSuperset(
    draggedNode: WorkoutItemFlatNode,
    destinationNode: WorkoutItemFlatNode,
  ): boolean {
    return draggedNode.expandable && destinationNode.level > 0;
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

  private showCannotDropIntoSupersetMessage(): void {
    this.snackBar.open(
      'You cannot drop a superset into another superset',
      'OK',
      {
        duration: Infinity,
      },
    );
  }
}
