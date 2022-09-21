import { MatDialogConfig } from '@angular/material/dialog';
import { WorkoutBasicInfo, WorkoutItem } from '@fitness-tracker/shared/utils';

export interface ComposeWorkoutData {
  workoutContent: WorkoutItem[];
  workoutBasicInfo?: WorkoutBasicInfo;
}

export const getDialogConfig = (
  workoutContent: WorkoutItem[],
  workoutBasicInfo?: WorkoutBasicInfo,
) => {
  console.log('getDialogConfig', workoutContent, workoutBasicInfo);

  const dialogConfig = new MatDialogConfig<ComposeWorkoutData>();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.minWidth = '100vw';
  dialogConfig.minHeight = '100vh';
  dialogConfig.height = '100%';
  dialogConfig.data = { workoutContent, workoutBasicInfo };

  return dialogConfig;
};
