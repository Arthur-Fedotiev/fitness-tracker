import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeWorkoutComponent } from './compose-workout.component';

describe('ComposeWorkoutComponent', () => {
  let component: ComposeWorkoutComponent;
  let fixture: ComponentFixture<ComposeWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeWorkoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
