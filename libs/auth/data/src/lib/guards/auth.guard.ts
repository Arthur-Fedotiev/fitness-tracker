import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { first, mapTo, Observable, tap } from 'rxjs';
import { AuthFacadeService } from '../services/auth-facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authFacade: AuthFacadeService) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authFacade.isLoggedIn$.pipe(
      first(),
      tap((isLoggedIn: boolean) => !isLoggedIn && this.authFacade.setDestinationURL(state.url)),
      mapTo(true),
    )
  }

}
