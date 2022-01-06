/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { ExerciseMetaCollectionsDictionaryUnit } from '@fitness-tracker/exercises/model';
import {
  InstructionType,
  WorkoutItem,
  WorkoutItemComposite,
  ConcreteCompositeWorkoutItemInstruction,
  WorkoutItemFlatNode,
  WorkoutDatabase,
  getChildren,
  getLevel,
  isExpandable,
  hasChild,
  SerializedWorkout,
  ConcreteWorkoutItemSerializer,
  WorkoutBasicInfo,
} from '@fitness-tracker/shared/utils';
import { WorkoutService } from '@fitness-tracker/workout/data';
import { WorkoutLevel } from '@fitness-tracker/workout/model';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, merge, Observable, scan, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'ft-compose-workout',
  templateUrl: './compose-workout.component.html',
  styleUrls: ['./compose-workout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkoutDatabase],
})
export class ComposeWorkoutComponent implements OnInit {
  private flatNodeMap = new Map<WorkoutItemFlatNode, WorkoutItem>();
  private nestedNodeMap = new Map<WorkoutItem, WorkoutItemFlatNode>();

  public treeControl: FlatTreeControl<WorkoutItemFlatNode>;
  public treeFlattener: MatTreeFlattener<WorkoutItem, WorkoutItemFlatNode>;
  public dataSource: MatTreeFlatDataSource<WorkoutItem, WorkoutItemFlatNode>;
  public expansionModel = new SelectionModel<string>(true);

  public hasChild = hasChild;

  public readonly metaCollections$: Observable<ExerciseMetaCollectionsDictionaryUnit> =
    this.exercisesFacade.exercisesMetaCollections$.pipe(filter(Boolean));

  public readonly nestedDrag = new BehaviorSubject(false);
  public readonly nestedDrag$ = this.nestedDrag
    .asObservable()
    .pipe(debounceTime(50), tap(console.log));

  public readonly instructionType = InstructionType;
  public isSupersetComposeUnderway = false;

  public readonly addToComposableSuperset = new Subject<WorkoutItemFlatNode>();
  public readonly reset = new Subject<void>();
  public readonly saveSupersetSubj = new Subject<void>();
  public readonly saveWorkoutSubj = new Subject<SerializedWorkout['content']>();
  private readonly workoutBasicInfoSubj = new Subject<WorkoutBasicInfo>();

  public readonly temporarySuperset$ = merge(
    this.addToComposableSuperset.asObservable(),
    this.reset,
  ).pipe(
    scan(
      (acc, curr) => (curr ? [...acc, curr] : []),
      [] as WorkoutItemFlatNode[],
    ),
    shareReplay(1),
  );

  public readonly createSuperset$ = this.saveSupersetSubj.asObservable().pipe(
    withLatestFrom(this.temporarySuperset$),
    map(([, superset]: [void, WorkoutItemFlatNode[]]) => superset),
    tap((superset) =>
      superset.forEach((node: WorkoutItemFlatNode) =>
        this.workoutDB.deleteItem(this.flatNodeMap.get(node)!),
      ),
    ),
    debounceTime(0),
    tap((superset) => {
      const supersetsNth = this.dataSource.data.reduce(
        (acc, curr) => (curr instanceof WorkoutItemComposite ? ++acc : acc),
        1,
      );

      const set = new WorkoutItemComposite(
        `Superset #${supersetsNth}`,
        [],
        new ConcreteCompositeWorkoutItemInstruction(),
        String(supersetsNth),
      );

      const parent = this.workoutDB.addItem(set);

      superset.forEach((node) =>
        this.workoutDB.insertItem(parent, this.flatNodeMap.get(node)!),
      );
    }),
    tap(() => this.reset.next()),
    untilDestroyed(this),
  );

  private readonly saveWorkout$ = this.saveWorkoutSubj.asObservable().pipe(
    withLatestFrom(this.workoutBasicInfoSubj),
    map(([content, basicInfo]) => ({
      content,
      ...basicInfo,
    })),
    tap((serializedWorkout: SerializedWorkout) =>
      this.workoutAPI.createWorkout(serializedWorkout),
    ),
    tap(console.log),
  );

  constructor(
    private readonly workoutAPI: WorkoutService,
    private readonly workoutItemSerializeStrategy: ConcreteWorkoutItemSerializer,
    readonly workoutDB: WorkoutDatabase,
    private exercisesFacade: ExercisesFacade,
  ) {
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

    workoutDB.dataChange
      .pipe(untilDestroyed(this))
      .subscribe((data) => this.rebuildTreeForData(data));
  }

  ngOnInit(): void {
    this.exercisesFacade.loadExercisesMeta();
    this.createSuperset$.pipe(untilDestroyed(this)).subscribe();
    this.saveWorkout$.pipe(untilDestroyed(this)).subscribe();
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

  public toggleComposeSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.reset.next();
  }

  public saveSuperset() {
    this.isSupersetComposeUnderway = !this.isSupersetComposeUnderway;
    this.workoutDB.insertTest();
    this.saveSupersetSubj.next();
  }

  public decompose(decomposedNode: WorkoutItemFlatNode): void {
    console.log(decomposedNode);

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

  public saveWorkout(): void {
    if (!this.dataSource.data.every((workoutItem) => workoutItem.isValid())) {
      console.log('Data is not valid to be saved');
      return;
    }

    const serializedWorkoutContent = this.dataSource.data.map((workoutItem) =>
      this.workoutItemSerializeStrategy.serialize(workoutItem),
    );

    this.saveWorkoutSubj.next(serializedWorkoutContent);
  }

  public trackById(_: number, node: WorkoutItem): string | number {
    return node.id;
  }

  public visibleNodes(): WorkoutItem[] {
    const result: WorkoutItem[] = [];

    function addExpandedChildren(node: WorkoutItem, expanded: string[]) {
      result.push(node);
      if (expanded.includes(node.id) && node.children) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    console.log('this.expansionModel.selected', this.expansionModel.selected);
    return result;
  }

  drop(event: CdkDragDrop<unknown, unknown, WorkoutItemFlatNode>) {
    console.log('origin/destination', event.previousIndex, event.currentIndex);
    // ignore drops outside of the tree
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
    const flatNodeAtDest: WorkoutItemFlatNode | undefined =
      this.nestedNodeMap.get(nodeAtDest)!;

    const nodeDragged: WorkoutItemFlatNode = event.item.data;
    const nodeToInsert = this.flatNodeMap.get(nodeDragged)!;

    if (nodeAtDest === nodeToInsert) return;

    const newSiblings: WorkoutItem[] | null = findNodeSiblings(
      this.dataSource.data,
      nodeAtDest?.id,
    );

    console.log('visibleNodes', visibleNodes);

    console.log('nodeAtDest', nodeAtDest);
    console.log('newSiblings', newSiblings);

    if (!newSiblings) return;

    const nodeAtDestFlatNode = this.treeControl.dataNodes.find(
      (n) => nodeAtDest.id === n.id,
    );
    if (nodeAtDestFlatNode?.expandable && nodeDragged.expandable) {
      alert('Items can only be moved within the same level.');
      return;
    }

    this.workoutDB.deleteItem(nodeToInsert);

    if (nodeAtDest.id === nodeDragged?.id) return;

    console.log('CHECK', isDroppedToBottomOfLevel(nodeAtDest, newSiblings));

    isDroppedToBottomOfLevel(nodeAtDest, newSiblings) &&
    !isDraggedAcrossLevels(flatNodeAtDest.level, nodeDragged.level)
      ? this.workoutDB.insertItemBelow(nodeAtDest, nodeToInsert)
      : this.workoutDB.insertItemAbove(nodeAtDest, nodeToInsert);
  }
  rebuildTreeForData(data: any) {
    this.dataSource.data = [];
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === id);
      node && this.treeControl.expand(node);
    });
  }

  public saveBasicInfo($event: WorkoutBasicInfo): void {
    this.workoutBasicInfoSubj.next($event);
  }
}
