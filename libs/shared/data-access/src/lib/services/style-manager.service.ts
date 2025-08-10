
import { Injectable, Renderer2, RendererFactory2, DOCUMENT, inject } from '@angular/core';
import { MODE_PARAMS } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class StyleManagerService {
  private readonly document = inject<Document>(DOCUMENT);
  readonly rendererFactory = inject(RendererFactory2);

  private readonly styleSheetsCache: Set<string> = new Set();
  private readonly renderer: Renderer2;

  constructor() {
    const rendererFactory = this.rendererFactory;

    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public toggleDarkMode(isDark: boolean) {
    isDark ? this.activateDarkMode() : this.activateLightMode();
  }

  public loadStylesheet(styleRef: string): void {
    if (this.styleSheetsCache.has(styleRef)) return;

    this.createLinkElement(styleRef);
    this.styleSheetsCache.add(styleRef);
  }

  private createLinkElement(styleRef: string) {
    const linkEl = this.renderer.createElement('link');

    this.renderer.setAttribute(linkEl, 'rel', 'stylesheet');
    this.renderer.setAttribute(linkEl, 'href', styleRef);

    this.renderer.appendChild(this.document.head, linkEl);

    return linkEl;
  }

  private activateDarkMode(): void {
    this.loadStylesheet(MODE_PARAMS.DARK_BUNDLE);
    this.renderer.addClass(this.document.body, MODE_PARAMS.DARK_CLASS);
  }

  private activateLightMode(): void {
    this.loadStylesheet(MODE_PARAMS.LIGHT_BUNDLE);
    this.renderer.removeClass(this.document.body, MODE_PARAMS.DARK_CLASS);
  }
}
