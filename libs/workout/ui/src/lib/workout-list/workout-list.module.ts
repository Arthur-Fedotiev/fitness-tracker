import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutListComponent } from './workout-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [WorkoutListComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [WorkoutListComponent],
})
export class WorkoutListModule {}
