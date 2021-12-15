import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ComponentNames, Locales } from '@fitness-tracker/shared/utils';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  @Input() public isLoggedOut: boolean | null = false;
  @Input() public layout!: 'row' | 'column';
  @Input()
  public localeData: Locales[ComponentNames.NavigationBarComponent] | null =
    null;
  public readonly roles = ROLES;
}
