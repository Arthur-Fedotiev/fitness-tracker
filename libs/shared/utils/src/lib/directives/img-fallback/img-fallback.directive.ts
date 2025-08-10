import { Directive, Input, Renderer2, ElementRef, HostListener, inject } from '@angular/core';
import { DEFAULT_FALLBACK_IMG } from './fallback.constants';

@Directive({
  selector: 'img[ftWithFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ftWithFallback') public withFallback: string | null = null;

  private readonly default = DEFAULT_FALLBACK_IMG;

  @HostListener('error') setDefault() {
    this.renderer.setAttribute(
      this.el.nativeElement,
      'src',
      this.withFallback || this.default,
    );
  }
}
