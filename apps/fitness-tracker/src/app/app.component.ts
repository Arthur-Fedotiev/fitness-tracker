import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { IconService } from '@fitness-tracker/shared-ui-material';
import { PwaService } from '@fitness-tracker/shared/pwa';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';

const NAVIGATION_FAILED_MESSAGE =
  'Could not open that page. Check your connection and try again.';
const RELOAD_ACTION = 'Reload';

@UntilDestroy()
@Component({
  selector: 'ft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule],
})
export class AppComponent implements OnInit {
  /**
   * Route chunks and route-level resolvers both run before the new page
   * renders, which on a slow connection leaves the UI looking unresponsive.
   * This drives a progress bar for the whole of that window.
   */
  protected readonly isNavigating = signal(false);

  private readonly pwa = inject(PwaService);
  private readonly iconService = inject(IconService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.iconService.registerIcons();
    this.pwa.initListeners();
    this.trackNavigationProgress();
  }

  private trackNavigationProgress(): void {
    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): boolean =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
        untilDestroyed(this),
      )
      .subscribe((event: RouterEvent) => {
        this.isNavigating.set(event instanceof NavigationStart);

        if (event instanceof NavigationError) {
          this.notifyNavigationFailed();
        }
      });
  }

  /**
   * A failed navigation is usually a chunk that could not be fetched on a
   * flaky connection, which a reload recovers from. Without this the router
   * swallows the error and the button simply looks dead.
   */
  private notifyNavigationFailed(): void {
    this.snackBar
      .open(NAVIGATION_FAILED_MESSAGE, RELOAD_ACTION)
      .onAction()
      .pipe(untilDestroyed(this))
      .subscribe(() => location.reload());
  }
}
