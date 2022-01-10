import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPreviewComponent } from './workout-preview.component';

describe('WorkoutPreviewComponent', () => {
  let component: WorkoutPreviewComponent;
  let fixture: ComponentFixture<WorkoutPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
