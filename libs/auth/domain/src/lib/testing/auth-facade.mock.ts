import { of } from 'rxjs';
import { AuthFacadeService } from '../services/auth-facade.service';

export class AuthFacadeMock {
  public readonly isAdmin$ = of(true);
}

export const AUTH_FACADE_MOCK_PROVIDER = {
  provide: AuthFacadeService,
  useClass: AuthFacadeMock,
};
