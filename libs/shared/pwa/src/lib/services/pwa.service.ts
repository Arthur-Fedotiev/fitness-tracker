import { Inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { PlatformType } from '@fitness-tracker/shared/utils';

import { LOCAL_STORAGE, LOCATION } from '@ng-web-apis/common';
import {
  filter,
  first,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { PwaSnackbarComponent } from '../components/pwa-snackbar.component';
import { LoadPwaPayload, AddToHomeScreenStrategy } from '../models/pwa.models';

import {
  dismissSnackBar,
  versionReadyCondition,
} from '../utils/pwa-helpers.functions';
import { ADD_TO_HOME_SCREEN_TOKEN } from '../utils/pwa-platform.provider';
import {
  IS_PROMPTED_KEY,
  UPDATE_VERSION_DATA,
} from '../utils/update-version-snackbar-data';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly loadPwa$: Observable<void> =
    this.addToHomeScreenStrategy.loadPwa$.pipe(
      filter(
        (payload: LoadPwaPayload | null): payload is Required<LoadPwaPayload> =>
          payload?.pwaPlatform === PlatformType.Android,
      ),
      // filter(() => !this.localStorage.getItem(IS_PROMPTED_KEY)),
      tap(() =>
        this.localStorage.setItem(IS_PROMPTED_KEY, JSON.stringify(true)),
      ),
      map(({ snackBarData, pwaEvent }: LoadPwaPayload) => ({
        pwaEvent: pwaEvent as Event,
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
          pwaEvent: Event;
        }) =>
          this.snackBarAction$(
            snackbarRef,
            this.addToHomeScreen.bind(this, pwaEvent),
          ),
      ),
    );

  private readonly addTomeScreenSubj = new Subject<Event>();
  private readonly addToHomeScreen$ = this.addTomeScreenSubj
    .asObservable()
    .pipe(tap((event: Event) => (event as any)?.prompt()));

  constructor(
    @Inject(ADD_TO_HOME_SCREEN_TOKEN)
    private readonly addToHomeScreenStrategy: AddToHomeScreenStrategy,
    @Inject(LOCATION) private readonly location: Location,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
    private readonly swUpdate: SwUpdate,
    private readonly snackBar: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
  ) {}

  public updateVersion(this: PwaService): void {
    this.location.reload();
  }

  public addToHomeScreen(this: PwaService, pwaEvent: Event): void {
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

  private openSnackbar(
    data: Record<string, unknown>,
  ): MatSnackBarRef<PwaSnackbarComponent> {
    return this.snackBar.openFromComponent(PwaSnackbarComponent, {
      data,
    });
  }
}
