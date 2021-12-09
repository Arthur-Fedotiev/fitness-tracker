import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { User } from '@fitness-tracker/create-user/models'
import { environment } from '../../../../../../apps/fitness-tracker/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(private readonly http: HttpClient) { }

  public createUser(user: User): Observable<number> {
    const url: string = environment.api.createUser;

    return this.http.post<number>(url, user);
  }
}
