export interface CreateUserResponseBody {
  uid?: string;
  message: string;
}

export interface CreateUserRequestBody {
  email: string;
  password: string;
  admin: boolean;
  role: Role;
}

export type Role = 'ADMIN' | 'TRAINEE';
