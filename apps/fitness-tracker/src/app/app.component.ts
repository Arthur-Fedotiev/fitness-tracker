import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconService } from '@fitness-tracker/shared-ui-material';

@Component({
  selector: 'ft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private iconService: IconService) {}
  public ngOnInit() {
    this.iconService.registerIcons();
  }
}
