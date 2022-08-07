import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: any;
  private userId: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticate() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.http.post("http://localhost:3000/api/user/signup", authData)
        .subscribe((response) => {
          console.log(response);
        })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
        .subscribe((response) => {
          const expiresInDuration = response.expiresIn;
          const token = response.token;
          this.token = token;
          if(token) {
            this.userId = response.userId;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration);
            this.setAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }

        })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if(authInformation) {
    const now = new Date();
    const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation?.token;
      this.setAuthTimer(expiresIn / 3000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000)
  }

  logoutUser() {
    this.token = '';
    this.userId = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer)
  }

  private setAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if(!token || !expirationDate) {
      return null;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
