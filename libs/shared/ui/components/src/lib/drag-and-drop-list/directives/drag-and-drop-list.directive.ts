import { Directive, TemplateRef } from '@angular/core';

import { DragAndDropListContext } from './drag-and-drop-list-context';

@Directive({
  selector: '[ftDragAndDropListItemDef]',
})
export class DragAndDropListItemDefDirective<T> {
  constructor(public template: TemplateRef<DragAndDropListContext<T>>) {}

  static ngTemplateContextGuard<T>(
    _dir: DragAndDropListItemDefDirective<T>,
    ctx: unknown,
  ): ctx is DragAndDropListContext<T> {
    return true;
  }
}
