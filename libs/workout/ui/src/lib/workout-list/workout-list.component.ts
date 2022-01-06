import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { WithId } from '@fitness-tracker/shared/utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ft-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutListComponent {
  @Input() listData: WithId<unknown>[] = [];
  @ContentChild(TemplateRef) workoutTemplate!: TemplateRef<unknown>;

  public trackById(index: number, item: WithId<unknown>): string | number {
    return item.id ?? index;
  }
}
