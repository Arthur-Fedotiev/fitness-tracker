import { Directive, Input, Renderer2, ElementRef, HostListener } from '@angular/core';
import { DEFAULT_FALLBACK_IMG } from './default-image';

@Directive({
  selector: 'img[ftWithFallback]'
})
export class ImgFallbackDirective {
  @Input() public withFallback: string | null = null;

  private readonly default = DEFAULT_FALLBACK_IMG;

  @HostListener('error') setDefault() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.withFallback || this.default);
  }

  constructor(private readonly renderer: Renderer2, private readonly el: ElementRef) { }
}
