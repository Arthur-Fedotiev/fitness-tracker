import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DragAndDropListComponent } from './drag-and-drop-list.component';
import { DragAndDropListItemDefDirective } from './directives/drag-and-drop-list.directive';
import { DragAndDropListItemDirective } from './directives/drag-and-drop-list-item.directive';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    FlexLayoutModule,
    ScrollingModule,
  ],
  declarations: [
    DragAndDropListComponent,
    DragAndDropListItemDefDirective,
    DragAndDropListItemDirective,
  ],
  exports: [
    DragAndDropListComponent,
    DragAndDropListItemDefDirective,
    DragAndDropListItemDirective,
  ],
})
export class DragAndDropListModule {}
