import { MatSnackBarRef } from '@angular/material/snack-bar';
import { VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { PwaSnackbarComponent } from '../components/pwa-snackbar.component';
import { VERSION_READY } from './update-version-snackbar-data';

export const dismissSnackBar = (
  ref: MatSnackBarRef<PwaSnackbarComponent>,
): void => ref.dismiss();

export const versionReadyCondition = (
  evt: VersionEvent,
): evt is VersionReadyEvent => evt.type === VERSION_READY;
