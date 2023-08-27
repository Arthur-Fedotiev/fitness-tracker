import { HttpClient } from '@angular/common/http';
import { TRANSLATION_ASSET_FORMAT } from '@fitness-tracker/shared/i18n/utils';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const translationsLoaderFactory = (path: string) => (http: HttpClient) =>
  new TranslateHttpLoader(http, path, `.${TRANSLATION_ASSET_FORMAT}`);
