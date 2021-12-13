import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ROLES, LANG_CODES } from 'shared-package';
console.log(LANG_CODES);

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

  @Output() public readonly loggedOutChange = new EventEmitter<void>();

  public readonly roles = ROLES;

  public logOut(): void {
    this.loggedOutChange.emit();
  }
}
