import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { AuthFacadeService } from './auth-facade.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authFacade = inject(AuthFacadeService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.authFacade.authJwtToken$.pipe(
      map((authJwtToken: string | null) =>
        authJwtToken ? this.addAuthorizationHeader(request, authJwtToken) : request,
      ),
      switchMap((req) => next.handle(req)),
    );
  }

  private addAuthorizationHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', token),
    });
  }
}
