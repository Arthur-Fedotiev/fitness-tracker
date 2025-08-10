import { Directive, HostBinding, HostAttributeToken, inject } from '@angular/core';

@Directive({
  selector: '[ftE2e]',
  standalone: true,
})
export class E2eDirective {
  private readonly e2e = inject(new HostAttributeToken('ftE2e'), { optional: true });

  @HostBinding('attr.data-cy') cy = this.e2e;
}
