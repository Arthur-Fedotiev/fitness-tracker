declare namespace Express {
  export interface Request {
    uid?: string;
    admin?: string;
    role?: 'ADMIN' | 'TRAINEE';
  }
}
