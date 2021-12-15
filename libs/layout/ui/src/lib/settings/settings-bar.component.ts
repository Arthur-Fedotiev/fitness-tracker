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
import { Store } from '@ngrx/store';
import { languageSelected } from 'libs/shared/data-access/src/lib/+state/actions/settings.actions';
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

  @Output() public readonly loggedOutChange = new EventEmitter<void>();
  @Output() public readonly languageSelected =
    new EventEmitter<LanguageCodes>();

  constructor(private readonly store: Store) {}

  public readonly languages: Languages = LANGUAGES_LABELS_LIST;

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  selectLanguage(language: LanguageCodes) {
    this.languageSelected.emit(language);
  }
}
