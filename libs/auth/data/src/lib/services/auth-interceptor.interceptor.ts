import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { AuthFacadeService } from './auth-facade.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authFacade: AuthFacadeService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authFacade.authJwtToken$.pipe(
      map((authJwtToken: string | null) =>
        authJwtToken ? this.addAuthorizationHeader(request, authJwtToken) : request),
      switchMap(req => next.handle(req)),
    )
  }

  private addAuthorizationHeader(request: HttpRequest<unknown>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers
        .set("Authorization", token)
    });
  }
}
