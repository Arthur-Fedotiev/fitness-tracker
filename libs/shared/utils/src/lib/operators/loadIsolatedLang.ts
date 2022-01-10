import { TranslateService } from '@ngx-translate/core';
import { MonoTypeOperatorFunction, pipe, tap } from 'rxjs';
import { LanguageCodes } from 'shared-package';

export const loadIsolatedLang: (
  translateService: TranslateService,
) => MonoTypeOperatorFunction<LanguageCodes> = (
  translateService: TranslateService,
): MonoTypeOperatorFunction<LanguageCodes> => {
  let isLoaded = false;
  return pipe(
    tap(() => (translateService.currentLang = '')),
    tap((language: LanguageCodes) => translateService.use(language)),
  );
  if (!isLoaded) {
    isLoaded = true;
    return pipe(
      tap(() => (translateService.currentLang = '')),
      tap((language: LanguageCodes) => translateService.use(language)),
    );
  }

  return pipe();
};
