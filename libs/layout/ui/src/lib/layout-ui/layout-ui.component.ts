import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ComponentNames,
  Language,
  Locales,
} from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';

@Component({
  selector: 'ft-layout-ui',
  templateUrl: './layout-ui.component.html',
  styleUrls: ['./layout-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutUiComponent {
  @Input() public isLoggedIn: boolean | null = false;
  @Input() public isLoggedOut: boolean | null = false;
  @Input() public photoUrl: string | null = null;
  @Input() public language: Language | null = null;
  @Input()
  public navigationBarLocaleData:
    | Locales[ComponentNames.NavigationBarComponent]
    | null = null;
  @Output() public readonly loggedOutChange = new EventEmitter<void>();
  @Output() public readonly languageSelected =
    new EventEmitter<LanguageCodes>();

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  public selectLanguage(language: LanguageCodes) {
    this.languageSelected.emit(language);
  }
}
