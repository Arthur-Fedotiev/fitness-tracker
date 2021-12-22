import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconService } from '@fitness-tracker/shared-ui-material';
import { environment } from '@fitness-tracker/shared/environments';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private iconService: IconService,
    private translateService: TranslateService,
  ) {}
  public ngOnInit() {
    this.iconService.registerIcons();
    this.translateService.use(environment.defaultLocale);
    console.log(this.translateService);
  }
}
