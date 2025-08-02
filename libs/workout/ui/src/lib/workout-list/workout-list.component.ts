import {
  Component,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { WithId } from '@fitness-tracker/shared/utils';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ft-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class WorkoutListComponent {
  @Input() listData: WithId<unknown>[] = [];
  @ContentChild(TemplateRef) workoutTemplate!: TemplateRef<unknown>;

  protected trackById(index: number, item: WithId<unknown>): string | number {
    return item.id ?? index;
  }
}
