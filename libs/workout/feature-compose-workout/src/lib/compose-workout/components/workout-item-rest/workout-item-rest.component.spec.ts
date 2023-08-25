import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutItemRestComponent } from './workout-item-rest.component';

describe('WorkoutItemRestComponent', () => {
  let component: WorkoutItemRestComponent;
  let fixture: ComponentFixture<WorkoutItemRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutItemRestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutItemRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
