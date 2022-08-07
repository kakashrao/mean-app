import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) {}

  isLoading: boolean = false;
  private authStatusSub = new Subscription();

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogin(loginForm: NgForm) {
    if(loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
