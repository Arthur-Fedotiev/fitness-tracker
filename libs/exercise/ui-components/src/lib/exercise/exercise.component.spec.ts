import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AUTH_FACADE_MOCK_PROVIDER } from '@fitness-tracker/auth/data';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { TranslateTestingModule } from '@fitness-tracker/shared/testing';
import { ImgFallbackModule } from '@fitness-tracker/shared/utils';

import { ExerciseComponent } from './exercise.component';

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        ImgFallbackModule,
        RolesModule,
        TranslateTestingModule,
      ],
      providers: [AUTH_FACADE_MOCK_PROVIDER],
      declarations: [ExerciseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;

    component.exercise = {
      id: '1',
      name: 'name',
      avatarSecondaryUrl: 'avatarSecondaryUrl',
      avatarUrl: 'avatarUrl',
      coverUrl: 'coverUrl',
      equipment: 'equipment',
      targetMuscle: 'targetMuscle',
      exerciseType: 'exerciseType',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct markup', () => {
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  describe('emit events', () => {
    const verifyEmitEvent = (eventHandler: string, emitterName: string) => {
      const spy = jest.spyOn(component[emitterName], 'emit');

      component[eventHandler]({ id: '1' });

      expect(spy).toHaveBeenCalledWith('1');
    };

    const eventsTestingData = [
      ['editExercise', 'exerciseEdited'],
      ['deleteExercise', 'exerciseDeleted'],
      ['viewExercise', 'exerciseViewed'],
      ['addedToWorkout', 'exerciseAddedToWorkout'],
    ];

    it.each(eventsTestingData)(
      'should emit %s event',
      (eventHandler, emitterName) => {
        verifyEmitEvent(eventHandler, emitterName);
      },
    );
  });
});
