import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutBasicInfoComponent } from './workout-basic-info.component';

describe('WorkoutBasicInfoComponent', () => {
  let component: WorkoutBasicInfoComponent;
  let fixture: ComponentFixture<WorkoutBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
