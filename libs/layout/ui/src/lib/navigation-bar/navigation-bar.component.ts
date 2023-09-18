import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { ROLES } from 'shared-package';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { E2eDirective } from '@fitness-tracker/shared/utils';
import { RolesDirective } from '@fitness-tracker/shared/ui/directives';

@Component({
  selector: 'ft-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatListModule,
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
  @HostBinding('style.--nav-container-direction')
  @Input({ required: true })
  layout: 'row' | 'column' = 'row';

  protected readonly roles = ROLES;
}
