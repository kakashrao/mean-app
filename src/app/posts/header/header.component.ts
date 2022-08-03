import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSub: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy(): void {
    this.authListenerSub?.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}
