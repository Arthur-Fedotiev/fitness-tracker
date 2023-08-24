import { Directive, HostBinding, Attribute } from '@angular/core';

@Directive({
  selector: '[ftE2e]',
  standalone: true,
})
export class E2eDirective {
  @HostBinding('attr.data-cy') cy = this.e2e;

  constructor(@Attribute('ftE2e') private readonly e2e: string) {}
}
