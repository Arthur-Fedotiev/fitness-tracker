import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fitness-tracker-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  login($event: any): void {
    console.log('LOGIN', $event);
    
  }

}
