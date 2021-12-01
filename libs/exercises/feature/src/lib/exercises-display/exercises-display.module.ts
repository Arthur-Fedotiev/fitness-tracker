import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesDisplayRoutingModule } from './exercises-display-routing.module';
import { ExercisesDisplayComponent } from './exercises-display.component';
import { ExercisesUiModule } from '@fitness-tracker/exercises/ui';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';


@NgModule({
  declarations: [
    ExercisesDisplayComponent,
  ],
  imports: [
    CommonModule,
    ExercisesDisplayRoutingModule,
    ExercisesUiModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class ExercisesDisplayModule { }
