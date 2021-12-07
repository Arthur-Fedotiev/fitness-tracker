import { Directive, Input, HostBinding, Renderer2, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { DEFAULT_FALLBACK_IMG } from './default-image';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[withFallback]'
})
export class ImgFallbackDirective {
  @Input() public withFallback: string | null = null;

  private readonly default = DEFAULT_FALLBACK_IMG;

  @HostListener('error') setDefault() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.withFallback || this.default);
  }



  constructor(private readonly renderer: Renderer2, private readonly el: ElementRef) {
  }

}
