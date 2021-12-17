import { Inject, Injectable, Optional } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LANG_CODES } from 'shared-package';
import { IconProvider, ICON_PROVIDER } from '../providers/icon-token';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    @Optional()
    @Inject(ICON_PROVIDER)
    private readonly iconProviders: IconProvider[],
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {}

  public registerIcons(): void {
    if (!this.iconProviders) {
      return;
    }
    this.iconProviders.forEach(this.loadIcons.bind(this));
  }

  private loadIcons({ iconKeys, iconUrl }: IconProvider): void {
    iconKeys.forEach((key) => {
      console.log(`${iconUrl}/${key}.svg`);
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `${iconUrl}/${key}.svg`,
        ),
      );
    });
  }
}
