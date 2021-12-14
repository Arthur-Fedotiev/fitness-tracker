import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

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

  @Output() public readonly loggedOutChange = new EventEmitter<void>();

  readonly languages = [
    { value: 'en', label: 'English', img: '/assets/layout-ui/gb.svg' },
    { value: 'it', label: 'Italiano', img: '/assets/layout-ui/it.svg' },
    { value: 'ru', label: 'Русский', img: '/assets/layout-ui/ru.svg' },
  ];

  public language = this.languages[0];

  public logOut(): void {
    this.loggedOutChange.emit();
  }

  selectLanguage(value: string) {
    this.language =
      this.languages.find((lang: any) => lang.value === value) ??
      this.languages[0];
  }
}
