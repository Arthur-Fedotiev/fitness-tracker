import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Input,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ft-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutListComponent {
  @Input() listData: unknown[] = [];
  @ContentChild(TemplateRef) workoutTemplate!: TemplateRef<unknown>;
}
