import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { DragAndDropListItemDirective } from './directives/drag-and-drop-list-item.directive';
import { DragAndDropListItemDefDirective } from './directives/drag-and-drop-list.directive';
import { DragAndDropListComponent } from './drag-and-drop-list.component';

describe('DragAndDropListComponent', () => {
  @Component({
    selector: 'ft-test-drag-and-drop-list',
    template: `
      <ft-drag-and-drop-list [list]="list">
        <ft-drag-and-drop-list-item
          fxLayout="row"
          fxLayoutAlign="start center"
          *ftDragAndDropListItemDef="let item"
        >
          <span class="test-list">item.name</span>
        </ft-drag-and-drop-list-item>
      </ft-drag-and-drop-list>
    `,
  })
  class TestDragAndDropListComponent {
    list = getMockedList();
  }

  let testComponent: TestDragAndDropListComponent;
  let testFixture: ComponentFixture<TestDragAndDropListComponent>;
  let dragAndDropListComponent: DragAndDropListComponent<{ id: string }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DragDropModule, MatIconModule, ScrollingModule],
      declarations: [
        TestDragAndDropListComponent,
        DragAndDropListComponent,
        DragAndDropListItemDefDirective,
        DragAndDropListItemDirective,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testFixture = TestBed.createComponent(TestDragAndDropListComponent);
    testComponent = testFixture.componentInstance;
    testFixture.detectChanges();

    dragAndDropListComponent = testFixture.debugElement.query(
      By.directive(DragAndDropListComponent),
    ).componentInstance;
    dragAndDropListComponent.itemSize = 33;

    testFixture.detectChanges();
  });

  describe('init', () => {
    it('should create TestDragAndDropListComponent', () => {
      expect(testComponent).toBeTruthy();
    });

    it('should show element passed by ngTemplateOutlet', () => {
      const renderedList = testFixture.debugElement.queryAll(
        By.css('.test-list'),
      );

      expect([...renderedList].length).toEqual(getMockedList().length);
    });
  });

  describe('inputs', () => {
    it('should get list by input', () => {
      expect(dragAndDropListComponent.list).toEqual(getMockedList());
    });
  });

  describe('#drop', () => {
    it('should move elements in list and emit listChange', () => {
      const list = [
        { id: 'field1', name: 'col1', isChecked: true },
        { id: 'field2', name: 'col2', isChecked: false },
        { id: 'field3', name: 'col3', isChecked: false },
      ];

      const listChangeSpyEmit = spyOn(
        dragAndDropListComponent.listChange,
        'emit',
      );

      dragAndDropListComponent.list = list;

      dragAndDropListComponent.drop({
        previousIndex: 0,
        currentIndex: 2,
      } as CdkDragDrop<{ id: string }[]>);

      const movedList = [
        { id: 'field2', name: 'col2', isChecked: false },
        { id: 'field3', name: 'col3', isChecked: false },
        { id: 'field1', name: 'col1', isChecked: true },
      ];

      expect(dragAndDropListComponent.list).toEqual(movedList);

      expect(listChangeSpyEmit).toHaveBeenCalledWith(movedList);
    });
  });
});

const getMockedList = () => [
  { id: 'field1', name: 'col1', isChecked: true },
  { id: 'field2', name: 'col2', isChecked: false },
  { id: 'field3', name: 'col3', isChecked: false },
  { id: 'field4', name: 'col4', isChecked: true },
  { id: 'field5', name: 'col5', isChecked: false },
  { id: 'field6', name: 'col6', isChecked: false },
  { id: 'field7', name: 'col7', isChecked: true },
  { id: 'field8', name: 'col8', isChecked: false },
  { id: 'field9', name: 'col9', isChecked: false },
  { id: 'field10', name: 'col10', isChecked: true },
  { id: 'field11', name: 'col11', isChecked: false },
  { id: 'field12', name: 'col12', isChecked: false },
  { id: 'field13', name: 'col13', isChecked: true },
  { id: 'field14', name: 'col14', isChecked: false },
  { id: 'field15', name: 'col15', isChecked: false },
  { id: 'field16', name: 'col16', isChecked: false },
];
