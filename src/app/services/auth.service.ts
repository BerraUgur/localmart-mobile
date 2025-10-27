import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '../models/loginResponse';
import { LoginRequest } from '../models/loginRequest';
import { RegisterRequest } from '../models/registerRequest';
import { UpdateUserRequest } from '../models/userRequest';
import { Observable } from 'rxjs';
import { User } from '../models/comment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.httpClient.post(this.NewPath + 'reset-password', { email, token, newPassword });
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.httpClient.post(this.NewPath + 'forgot-password', { email });
  }
  localStorage: Storage;
  jwtHelperService: JwtHelperService = new JwtHelperService();
  currentUserId?: number;
  currentRoles?: string;
  NewPath = "http://localhost:5203/auth/"

  constructor(private httpClient: HttpClient, private logger: LoggerService) {
    this.setUserStats();
    this.localStorage = window.localStorage;
  }

  login(user: LoginRequest) {
    return this.httpClient.post<LoginResponse>(this.NewPath + "login", user);
  }

  Register(user: RegisterRequest) {
    return this.httpClient.post(this.NewPath + "register", user)
  }

  isAuthencation() {
    if (localStorage.getItem("token")) {
      return true;
    }

    else {
      return false;
    }
  }

  getDecodedToken(): any {
    const token = localStorage.getItem("token");
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  setCurrentUserId() {
    const decoded = this.getDecodedToken();
    if (decoded) {
      const propUserId = Object.keys(decoded).find(x => x.endsWith("/nameidentifier"));
      if (propUserId) {
        this.currentUserId = Number(decoded[propUserId]);
      }
    }
  }

  setRoles() {
    var decoded = this.getDecodedToken()
    var propUserId = Object.keys(decoded).filter(x => x.endsWith("/role"))[0];
    this.currentRoles = String(decoded[propUserId]);
  }

  getCurrentRoles(): string {
    this.logger.log('Debug', 'Current roles requested:', this.currentRoles);
    return this.currentRoles ?? "";
  }

  getCurrentUserId(): number {
    this.logger.log('Debug', 'Current userId requested:', this.currentUserId);
    return this.currentUserId!;
  }

  async setUserStats() {
    if (this.loggedIn()) {
      this.setCurrentUserId()
      this.setRoles()
    }
  }

  logout() {
    this.localStorage.removeItem("token");
  }

  loggedIn(): boolean {
    let isExpired = this.jwtHelperService.isTokenExpired(localStorage.getItem("token"));
    return !isExpired;
  }

  updateUser(userId: number, updateUserRequest: UpdateUserRequest): Observable<void> {
    return this.httpClient.put<void>(this.NewPath + userId + "/update", updateUserRequest);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.NewPath}${id}`);
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.NewPath + "userlist");
  }

  getUser(userId: number): Observable<User> {
    return this.httpClient.get<User>(this.NewPath + userId);
  }
}