import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  Language,
  Languages,
  LANGUAGES_LABELS_LIST,
} from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';

@Component({
  selector: 'ft-settings-bar',
  templateUrl: './settings-bar.component.html',
  styleUrls: ['./settings-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBarComponent {
  @Input() public isLoggedIn: boolean | null = false;
  @Input() public isLoggedOut: boolean | null = false;
  @Input() public photoUrl: string | null = null;
  @Input() public language: Language | null = null;
  @Input() public isDarkMode = false;

  @Output() public readonly loggedOutChange = new EventEmitter<void>();
  @Output() public readonly languageSelected =
    new EventEmitter<LanguageCodes>();
  @Output() public readonly darkModeChanged = new EventEmitter<void>();

  public readonly languages: Languages = LANGUAGES_LABELS_LIST;

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  public selectLanguage(language: LanguageCodes) {
    this.languageSelected.emit(language);
  }

  public toggleDarkMode(): void {
    this.darkModeChanged.emit();
  }
}
