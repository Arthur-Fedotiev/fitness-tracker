import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesDisplayComponent } from './exercises-display.component';

describe('ExercisesDisplayComponent', () => {
  let component: ExercisesDisplayComponent;
  let fixture: ComponentFixture<ExercisesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
