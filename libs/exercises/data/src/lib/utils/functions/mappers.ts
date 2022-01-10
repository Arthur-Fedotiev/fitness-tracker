import {
  ExerciseBaseData,
  ExerciseMetaDTO,
  ExercisesEntity,
} from '@fitness-tracker/exercises/model';
import { convertOneSnap, WithId } from '@fitness-tracker/shared/utils';
import { map, first } from 'rxjs';
import { Translations, COLLECTIONS, LanguageCodes } from 'shared-package';
import { ExercisesService } from '../../exercises.service';
import firebase from 'firebase/compat/app';

export function toExerciseTranslation$(
  this: ExercisesService,
  lang: LanguageCodes,
) {
  return (exercise: Required<ExerciseBaseData>) =>
    this.afs
      .doc<Translations<ExercisesEntity>[typeof lang]>(
        `${COLLECTIONS.EXERCISES}/${exercise.id}/${COLLECTIONS.TRANSLATIONS}/${lang}`,
      )
      .get()
      .pipe(
        map<
          firebase.firestore.DocumentSnapshot<
            Translations<ExercisesEntity>[typeof lang]
          >,
          Translations<ExercisesEntity>[typeof lang]
        >(convertOneSnap),
        map(
          (
            translation: Translations<
              Translations<ExercisesEntity>[typeof lang]
            >[typeof lang],
          ) => ({
            ...translation,
            ...exercise,
          }),
        ),
        first(),
      );
}

export const toBaseDataWithId = ({
  baseData,
  id,
}: WithId<ExerciseMetaDTO>): Required<ExerciseBaseData> => ({
  ...baseData,
  id,
});

export const shouldSplitToChunks = (ids: string[]) => ids?.length > 10;
