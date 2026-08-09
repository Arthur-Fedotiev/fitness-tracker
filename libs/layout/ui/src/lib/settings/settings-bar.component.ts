import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { E2eDirective } from '@fitness-tracker/shared/utils';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'ft-settings-bar',
  templateUrl: './settings-bar.component.html',
  styleUrls: ['./settings-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule],
})
export class SettingsBarComponent {
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
