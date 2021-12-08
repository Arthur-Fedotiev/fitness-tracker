import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ftRoles]'
})
export class RolesDirective implements OnChanges {
  @Input('ftRoles') allowedRoles: string[] = [];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ftRolesExclude') disallowedRoles: string[] = [];

  constructor(
    private readonly template: TemplateRef<unknown>,
    private readonly vcRef: ViewContainerRef
  ) { }

  public ngOnChanges({ allowedRoles, disallowedRoles }: SimpleChanges): void {
    console.log('CHANGES:', allowedRoles)
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.template);
  }

}
