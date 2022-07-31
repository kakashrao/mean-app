import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  isLoading: boolean = false;

  onSignup(signupForm: NgForm) {}
}
