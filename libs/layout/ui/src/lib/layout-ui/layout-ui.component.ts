import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-layout-ui',
  templateUrl: './layout-ui.component.html',
  styleUrls: ['./layout-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutUiComponent {
  readonly languages = [
    { value: 'en', label: 'English', img: '/assets/layout-ui/gb.svg' },
    { value: 'it', label: 'Italiano', img: '/assets/layout-ui/it.svg' },
    { value: 'ru', label: 'Русский', img: '/assets/layout-ui/ru.svg' },
  ];

  public language = this.languages[0];

  @Input() public isLoggedIn: boolean | null = false;
  @Input() public isLoggedOut: boolean | null = false;
  @Input() public photoUrl: string | null = null;

  @Output() public readonly loggedOutChange = new EventEmitter<void>();

  public readonly roles = ROLES;

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  selectLanguage(value: string) {
    this.language =
      this.languages.find((lang) => lang.value === value) ?? this.languages[0];
  }
}
