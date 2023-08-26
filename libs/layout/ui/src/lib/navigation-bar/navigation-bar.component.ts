import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ROLES } from 'shared-package';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { E2eDirective } from '@fitness-tracker/shared/utils';
import { RolesDirective } from '@fitness-tracker/auth/data';

@Component({
  selector: 'ft-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatListModule,
    FlexModule,
    ExtendedModule,
    E2eDirective,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    RolesDirective,
    MatTooltipModule,
  ],
})
export class NavigationBarComponent {
  @Input() public layout!: 'row' | 'column';
  public readonly roles = ROLES;
}
