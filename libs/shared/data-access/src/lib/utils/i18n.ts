import { inject } from '@angular/core';
import { SettingsFacadeService } from '../+state/settings-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { loadIsolatedLang } from './load-isolated-lang';

export const getLanguageRefresh$ = () =>
  inject(SettingsFacadeService).language$.pipe(
    loadIsolatedLang(inject(TranslateService)),
  );
