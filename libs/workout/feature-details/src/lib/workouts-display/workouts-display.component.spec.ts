import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsDisplayComponent } from './workouts-display.component';

describe('WorkoutsDisplayComponent', () => {
  let component: WorkoutsDisplayComponent;
  let fixture: ComponentFixture<WorkoutsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutsDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
