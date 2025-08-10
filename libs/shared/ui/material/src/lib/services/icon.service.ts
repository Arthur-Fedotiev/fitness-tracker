import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_PROVIDER, IconProvider } from '../providers/icon-token';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly iconProviders = inject<IconProvider[]>(ICON_PROVIDER);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  public registerIcons(): void {
    if (!this.iconProviders) {
      return;
    }
    this.iconProviders.forEach(this.loadIcons.bind(this));
  }

  private loadIcons({ iconKeys, iconUrl }: IconProvider): void {
    iconKeys.forEach((key) => {
      this.matIconRegistry.addSvgIcon(key, this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`));
    });
  }
}
