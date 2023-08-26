import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuscleMultiSelectComponent } from './muscle-multi-select.component';

describe('MuscleMultiSelectComponent', () => {
  let component: MuscleMultiSelectComponent;
  let fixture: ComponentFixture<MuscleMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleMultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MuscleMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
