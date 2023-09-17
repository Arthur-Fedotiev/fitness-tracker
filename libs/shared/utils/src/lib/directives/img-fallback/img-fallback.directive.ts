import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';
import { DEFAULT_FALLBACK_IMG } from './fallback.constants';

@Directive({
  selector: 'img[ftWithFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
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

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
  ) {}
}
