import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
import { readFirst } from '@nrwl/angular/testing';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEffects } from './exercises.effects';
import { ExercisesFacade } from './exercises.facade';
import { ExercisesEntity } from './exercises.models';
import {
  EXERCISES_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './exercises.reducer';
import * as ExercisesSelectors from './exercises.selectors';

interface TestSchema {
  exercises: State;
}

describe('ExercisesFacade', () => {
  let facade: ExercisesFacade;
  let store: Store<TestSchema>;
  const createExercisesEntity = (id: string, name = ''): ExercisesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(EXERCISES_FEATURE_KEY, reducer),
          EffectsModule.forFeature([ExercisesEffects]),
        ],
        providers: [ExercisesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(ExercisesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allExercises$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allExercises$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadExercisesSuccess` to manually update list
     */
    it('allExercises$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allExercises$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        ExercisesActions.loadExercisesSuccess({
          exercises: [
            createExercisesEntity('AAA'),
            createExercisesEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allExercises$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
