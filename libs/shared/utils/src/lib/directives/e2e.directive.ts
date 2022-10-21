import { Directive, NgModule, HostBinding, Attribute } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[ftE2e]',
})
export class E2eDirective {
  @HostBinding('attr.data-cy') cy = this.e2e;

  constructor(@Attribute('ftE2e') private readonly e2e: string) {}
}

@NgModule({
  imports: [CommonModule],
  declarations: [E2eDirective],
  exports: [E2eDirective],
})
export class E2eDirectiveModule {}
