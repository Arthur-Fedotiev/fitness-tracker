import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';

import { DragAndDropListItemDefDirective } from './directives/drag-and-drop-list.directive';
import { DEFAULT_ITEM_SIZE } from './drag-and-drop-list.constants';

@Component({
  selector: 'ft-drag-and-drop-list',
  templateUrl: './drag-and-drop-list.component.html',
  styleUrls: ['./drag-and-drop-list.component.scss'],
})
export class DragAndDropListComponent<T extends { id: string | number }> {
  @Input() itemSize = DEFAULT_ITEM_SIZE;
  @Input() showCheckboxes = true;
  @Input() list!: T[];
  @Input() dragAndDropDisabled = false;

  @Output() listChange = new EventEmitter<T[]>();

  @ContentChild(DragAndDropListItemDefDirective, { static: true })
  listItemDef!: DragAndDropListItemDefDirective<T>;

  @ViewChild(CdkScrollable)
  private _scroll!: CdkScrollable;

  @Input()
  set scrollToIndex(index: number) {
    if (index == null) {
      return;
    }

    this.scrollVerticallyByPx(this.itemSize * index);
  }

  trackById(_: unknown, item: T) {
    return item.id;
  }

  drop(event: CdkDragDrop<T[]>) {
    moveItemInArray(this.list!, event.previousIndex, event.currentIndex);
    this.listChange.emit(this.list);
  }

  private scrollVerticallyByPx(px: number) {
    requestAnimationFrame(() => {
      this._scroll.getElementRef().nativeElement.scrollTo(0, px);
    });
  }
}
