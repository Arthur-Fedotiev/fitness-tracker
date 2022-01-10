import { ROLES } from 'shared-package';

export class User {
  public role!: ROLES;

  constructor(public readonly email: string,
    public readonly password: string,
    public readonly admin: string,
  ) {
    this.role = admin ? ROLES.ADMIN : ROLES.TRAINEE
  }
}
