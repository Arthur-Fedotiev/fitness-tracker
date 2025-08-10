import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';

import { WA_LOCAL_STORAGE, WA_LOCATION } from '@ng-web-apis/common';
import { filter, first, map, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { PwaSnackbarComponent } from '../components/pwa-snackbar.component';
import { PlatformType } from '../constants/platform-type.enum';
import { AddToHomeScreenStrategy, BeforeInstallPromptEvent, LoadPwaPayload } from '../models';

import { dismissSnackBar, versionReadyCondition } from '../utils/pwa-helpers.functions';
import { ADD_TO_HOME_SCREEN_TOKEN } from '../utils/pwa-platform.provider';
import { IS_PROMPTED_KEY, UPDATE_VERSION_DATA } from '../utils/update-version-snackbar-data';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly addToHomeScreenStrategy = inject<AddToHomeScreenStrategy>(ADD_TO_HOME_SCREEN_TOKEN);
  private readonly location = inject<Location>(WA_LOCATION);
  private readonly localStorage = inject<Storage>(WA_LOCAL_STORAGE);
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly loadPwa$: Observable<void> = this.addToHomeScreenStrategy.loadPwa$.pipe(
    filter(
      (payload: LoadPwaPayload | null): payload is LoadPwaPayload => payload?.pwaPlatform === PlatformType.Android,
    ),
    // filter(() => !this.localStorage.getItem(IS_PROMPTED_KEY)),
    tap(() => this.localStorage.setItem(IS_PROMPTED_KEY, JSON.stringify(true))),
    map(({ snackBarData, pwaEvent }: Required<LoadPwaPayload>) => ({
      pwaEvent: pwaEvent!,
      snackbarRef: this.openSnackbar({
        ...snackBarData,
        message: this.sanitizer.bypassSecurityTrustHtml(snackBarData.message),
      }),
    })),
    switchMap(
      ({
        snackbarRef,
        pwaEvent,
      }: {
        snackbarRef: MatSnackBarRef<PwaSnackbarComponent>;
        pwaEvent: BeforeInstallPromptEvent;
      }) => this.snackBarAction$(snackbarRef, this.addToHomeScreen.bind(this, pwaEvent)),
    ),
  );

  private readonly addTomeScreenSubj = new Subject<BeforeInstallPromptEvent>();
  private readonly addToHomeScreen$ = this.addTomeScreenSubj.asObservable().pipe(
    tap((event: BeforeInstallPromptEvent | null) => {
      if (!event) {
        console.warn('PWA event is null, cannot add to home screen');
        return;
      }

      event.prompt();
    }),
  );

  public updateVersion(this: PwaService): void {
    this.location.reload();
  }

  public addToHomeScreen(this: PwaService, pwaEvent: BeforeInstallPromptEvent): void {
    this.addTomeScreenSubj.next(pwaEvent);
  }

  public initListeners(): void {
    this.loadPwa$.subscribe();
    this.addToHomeScreen$.subscribe();

    this.swUpdate.isEnabled &&
      this.swUpdate.versionUpdates
        .pipe(
          filter(versionReadyCondition),
          map(() => this.openSnackbar(UPDATE_VERSION_DATA)),
          switchMap((snackbarRef: MatSnackBarRef<PwaSnackbarComponent>) =>
            this.snackBarAction$(snackbarRef, this.updateVersion),
          ),
        )
        .subscribe();
  }

  private snackBarAction$(
    snackbarRef: MatSnackBarRef<PwaSnackbarComponent>,
    onConfirm: (this: PwaService) => void,
  ): Observable<void> {
    return merge(
      snackbarRef.instance.confirm.pipe(
        tap(() => {
          onConfirm.call(this);
          dismissSnackBar(snackbarRef);
        }),
      ),
      snackbarRef.instance.cancel.pipe(tap(() => dismissSnackBar(snackbarRef))),
    ).pipe(first());
  }

  private openSnackbar(data: Record<string, unknown>): MatSnackBarRef<PwaSnackbarComponent> {
    return this.snackBar.openFromComponent(PwaSnackbarComponent, {
      data,
    });
  }
}
