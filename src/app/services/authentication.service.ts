import { Injectable } from '@angular/core';
import { AppUser } from '../model/user.model';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users: AppUser[] = [];
  public authenticatedUser: AppUser | undefined;

  constructor() {
    this.users.push({ userId: UUID.UUID(), useremail: "user1@gmail.com", password: "1234", firstname: "oussama", lastname: "sami", roles: ["USER"] });
    this.users.push({ userId: UUID.UUID(), useremail: "user2@gmail.com", password: "1234", firstname: "oussama", lastname: "sami", roles: ["USER"] });
    this.users.push({ userId: UUID.UUID(), useremail: "user3@gmail.com", password: "1234", firstname: "oussama", lastname: "sami", roles: ["USER", "ADMIN"] });
  }
  
  public login(useremail: string, password: string, firstname: string, lastname: string): Observable<AppUser> {
  console.log('Attempting login with:', { useremail, password, firstname, lastname });
  let appUser = this.users.find(u => u.useremail === useremail);
  console.log('Found user:', appUser);
  
  if (!appUser) return throwError(() => new Error("User not found"));
  if (appUser.password !== password) {
    return throwError(() => new Error("Bad credentials :("));
  }
  return of(appUser);
}


  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    // authentication memory
    localStorage.setItem("authUser", JSON.stringify({ useremail: appUser.useremail, roles: appUser.roles, jwt: "JWT_TOKEN" }));
    return of(true);
  }

  public hasRole(role: string): boolean {
    return this.authenticatedUser!.roles.includes(role);
  }

  public isAuthenticated(): boolean {
    return this.authenticatedUser != undefined;
  }
  public logout(): Observable<boolean>{
    this.authenticatedUser=undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
}
