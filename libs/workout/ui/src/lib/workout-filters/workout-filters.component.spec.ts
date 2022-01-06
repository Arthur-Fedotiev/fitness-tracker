import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutFiltersComponent } from './workout-filters.component';

describe('WorkoutFiltersComponent', () => {
  let component: WorkoutFiltersComponent;
  let fixture: ComponentFixture<WorkoutFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
