import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutItemLoadSubformComponent } from './workout-item-load-subform.component';

describe('WorkoutItemLoadSubformComponent', () => {
  let component: WorkoutItemLoadSubformComponent;
  let fixture: ComponentFixture<WorkoutItemLoadSubformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutItemLoadSubformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutItemLoadSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
