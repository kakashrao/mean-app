import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscriber, Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  private authStatusSub = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignup(signupForm: NgForm) {
    if(signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email, signupForm.value.password);
  }
}
