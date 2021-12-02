import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fitness-tracker-layout-ui',
  templateUrl: './layout-ui.component.html',
  styleUrls: ['./layout-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutUiComponent implements OnInit {
  @Input() public isLoggedIn: boolean | null = false;
  @Input() public isLoggedOut: boolean | null = true;
  @Output() public readonly loggedOutChange = new EventEmitter<void>();

  // constructor() { }

  ngOnInit(): void {
  }

  public logOut(): void {
    this.loggedOutChange.emit()
  }

}
