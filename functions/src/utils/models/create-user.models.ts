import { ROLES } from 'auth-package';

export interface CreateUserResponseBody {
  uid?: string;
  message: string;
}

export interface CreateUserRequestBody {
  email: string;
  password: string;
  admin: boolean;
  role: ROLES;
}

export interface WithHEaders {
  headers: { [key: string]: string };
}
