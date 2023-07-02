import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposeWorkoutComponent } from './compose-workout.component';

import { FormsModule } from '@angular/forms';



import { FlexLayoutModule } from '@angular/flex-layout';

import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/api-public';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ComposeWorkoutComponent,
],
    providers: [EXERCISE_DESCRIPTORS_PROVIDER],
    exports: [ComposeWorkoutComponent],
})
export class ComposeWorkoutModule {}
