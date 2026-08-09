import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconService } from '@fitness-tracker/shared-ui-material';
import { PwaService } from '@fitness-tracker/shared/pwa';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RouterOutlet } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'ft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly pwa: PwaService,
    private readonly iconService: IconService,
  ) {}
  public ngOnInit() {
    this.iconService.registerIcons();
    this.pwa.initListeners();
  }
}
