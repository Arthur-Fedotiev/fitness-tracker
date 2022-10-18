import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconService } from '@fitness-tracker/shared-ui-material';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { PwaService } from '@fitness-tracker/shared/pwa';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly refreshLang$ = this.settingsFacade.language$.pipe(
    tap((language) => this.translateService.use(language)),
    untilDestroyed(this),
  );
  constructor(
    private readonly pwa: PwaService,
    private readonly iconService: IconService,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly translateService: TranslateService,
  ) {}
  public ngOnInit() {
    this.iconService.registerIcons();
    this.refreshLang$.subscribe();
    this.pwa.initListeners();
  }
}
