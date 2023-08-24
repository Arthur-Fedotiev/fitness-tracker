import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  E2eDirective,
  Language,
  Languages,
  LANGUAGES_LABELS_LIST,
} from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'ft-settings-bar',
  templateUrl: './settings-bar.component.html',
  styleUrls: ['./settings-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule,
    E2eDirective,
    FlexModule,
    MatIconModule,
    ExtendedModule,
    NgFor,
    MatOptionModule,
    NgIf,
    MatButtonModule,
    TranslateModule,
  ],
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
