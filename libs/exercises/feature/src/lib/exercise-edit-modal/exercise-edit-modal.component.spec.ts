import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditModalComponent } from './exercise-edit-modal.component';

describe('ExerciseEditModalComponent', () => {
  let component: ExerciseEditModalComponent;
  let fixture: ComponentFixture<ExerciseEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
