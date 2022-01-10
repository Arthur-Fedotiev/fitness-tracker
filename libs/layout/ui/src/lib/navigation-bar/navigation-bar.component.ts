import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  @Input() public layout!: 'row' | 'column';
  public readonly roles = ROLES;
}
