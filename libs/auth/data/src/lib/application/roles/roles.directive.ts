import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, tap } from 'rxjs';
import { ROLES } from 'shared-package';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthFacadeService } from '@fitness-tracker/auth/data';

@UntilDestroy()
@Directive({
    selector: '[ftRoles]',
    standalone: true,
})
export class RolesDirective implements OnInit {
  @Input('ftRoles') set allowedRole(role: ROLES) {
    this.allowedRole$$.next(role);
  }

  private readonly isAdmin$: Observable<boolean> = this.authFacade.isAdmin$;
  private readonly allowedRole$$: ReplaySubject<ROLES> =
    new ReplaySubject<ROLES>();

  private readonly show$ = combineLatest([
    this.isAdmin$,
    this.allowedRole$$.asObservable(),
  ]).pipe(
    map(([isAdmin, allowedRole]: [boolean, ROLES]) =>
      allowedRole === ROLES.TRAINEE ? true : isAdmin,
    ),
    tap((isRender: boolean) => {
      this.vcRef.clear();
      isRender && this.vcRef.createEmbeddedView(this.template);
    }),
    untilDestroyed(this),
  );

  constructor(
    private readonly template: TemplateRef<unknown>,
    private readonly vcRef: ViewContainerRef,
    private readonly authFacade: AuthFacadeService,
  ) {}

  public ngOnInit(): void {
    this.show$.subscribe();
  }
}
