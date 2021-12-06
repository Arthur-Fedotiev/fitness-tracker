export interface CreateUserResponseBody {
  uid?: string;
  message: string;
}

export interface CreateUserRequestBody {
  email: string;
  password: string;
  isAdmin: boolean;
}
