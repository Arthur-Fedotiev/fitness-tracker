import {
  Component,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { WithId } from '@fitness-tracker/shared/utils';
import { NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ft-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, NgTemplateOutlet],
})
export class WorkoutListComponent {
  @Input() listData: WithId<unknown>[] = [];
  @ContentChild(TemplateRef) workoutTemplate!: TemplateRef<unknown>;

  public trackById(index: number, item: WithId<unknown>): string | number {
    return item.id ?? index;
  }
}
