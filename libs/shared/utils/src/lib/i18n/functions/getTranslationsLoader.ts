import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TRANSLATION_ASSET_FORMAT } from '..';

export const translationsLoaderFactory = (path: string) => (http: HttpClient) =>
  new TranslateHttpLoader(http, path, `.${TRANSLATION_ASSET_FORMAT}`);
