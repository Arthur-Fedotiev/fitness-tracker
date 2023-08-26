import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import {
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  tap,
  filter,
} from 'rxjs';
import { ROLES } from 'shared-package';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { inject } from '@angular/core';
import { USER_DATA_QUERY_TOKEN } from '@fitness-tracker/shared/models';

@UntilDestroy()
@Directive({
  selector: '[ftRoles]',
  standalone: true,
})
export class RolesDirective implements OnInit {
  @Input('ftRoles') set allowedRole(role: ROLES) {
    this.allowedRole$$.next(role);
  }

  private readonly isAdmin$: Observable<boolean> = inject(USER_DATA_QUERY_TOKEN)
    .isAdmin$;
  private readonly allowedRole$$: ReplaySubject<ROLES> =
    new ReplaySubject<ROLES>();

  private readonly show$ = combineLatest([
    this.isAdmin$,
    this.allowedRole$$.asObservable(),
  ]).pipe(
    map(this.toShouldRender.bind(this)),
    tap(() => this.vcRef.clear()),
    filter(Boolean),
    tap(() => this.vcRef.createEmbeddedView(this.template)),
    untilDestroyed(this),
  );

  constructor(
    private readonly template: TemplateRef<unknown>,
    private readonly vcRef: ViewContainerRef,
  ) {}

  public ngOnInit(): void {
    this.show$.subscribe();
  }

  private toShouldRender([isAdmin, allowedRole]: [boolean, ROLES]) {
    return allowedRole === ROLES.TRAINEE ? true : isAdmin;
  }
}
