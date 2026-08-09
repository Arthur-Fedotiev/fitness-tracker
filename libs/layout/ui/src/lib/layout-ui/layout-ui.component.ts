import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { SettingsBarComponent } from '../settings/settings-bar.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgTemplateOutlet } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'ft-layout-ui',
  templateUrl: './layout-ui.component.html',
  styleUrls: ['./layout-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    NgTemplateOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NavigationBarComponent,
    SettingsBarComponent,
  ],
})
export class LayoutUiComponent {
  @Input() public isLoggedIn: boolean | null = false;
  @Input() public isLoggedOut: boolean | null = false;
  @Input() public photoUrl: string | null = null;
  @Input() public isDarkMode = false;

  @Output() public readonly loggedOutChange = new EventEmitter<void>();
  @Output() public readonly darkModeChanged = new EventEmitter<void>();

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  public toggleDarkMode(): void {
    this.darkModeChanged.emit();
  }
}
