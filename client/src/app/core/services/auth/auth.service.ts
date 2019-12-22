import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import * as _ from 'lodash';

import { environment } from 'src/environments/environment';
import { RouteNames } from 'src/app/shared/model/route-names.enum';
import { ErrorMessages } from 'src/app/shared/model/error-messages.enum';
import { Store } from 'src/app/shared/model/store.class';
import { Auth } from 'src/app/shared/model/auth.class';
import { ErrorService } from '../error/error.service';
import { Login, AuthCreds } from 'src/app/shared/model/auth-creds.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store: Store;
  private baseUrl = environment.baseUrl;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.store = new Store(new Auth());
    const token = localStorage.getItem('token');
    if (token) {
      this.setData(token);
    }
  }

  getData(): Observable<Auth> {
    return this.store.get([]);
  }

  login(form: FormGroup, alertMessage = 'Signed in successfully!'): void {
    form.disable();
    const model: AuthCreds = form.value;
    this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: { token: string }) => {
        if (response) {
          this.setData(response.token);
        }
      })
    ).subscribe(
      () => {
        this.router.navigate(
          [`${RouteNames.account}/${RouteNames.profile}`],
          { state: { alertMessage } }
        );
        form.reset();
        this.errorService.setLoginError('');
      },
      (error: HttpErrorResponse) => {
        form.enable();
        let message = error.error;
        if (error.status === 401) {
          message = 'Incorrect password';
        }
        this.errorService.setLoginError(message);
      }
    );
  }

  logout(): void {
    this.store.get(['tokenExpirationTimer']).pipe(
      map(timer => clearTimeout(timer))
    );
    this.store.set([], new Auth());
    localStorage.removeItem('token');
    this.router.navigate([`${RouteNames.account}/${RouteNames.auth}`]);
  }

  register(form: FormGroup): void {
    form.disable();
    const model: AuthCreds = form.value;
    this.http.post(this.baseUrl + 'register', model).subscribe(
      () => {
        this.login(form, 'Registered successfully!');
        this.errorService.setRegisterError('');
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          let message = error.error;
          const multipleErrors = !!(_.get(error, 'error.errors'));
          if (multipleErrors) {
            message = 'Failed to register new account';
          }
          this.errorService.setRegisterError(message);
        }
        form.enable();
      }
    );
  }

  getInputError(input: AbstractControl, inputName: string): Observable<string> {
    return input.statusChanges.pipe(
      startWith(''), // fire observable on load for cases where input is touched but not changed
      map(() => {
        if (input.errors) {
          const inputError = Object.keys(input.errors)[0];
          const errorMessage = `${inputName} is ${ErrorMessages[inputError]}`;
          return errorMessage;
        }
        return '';
      })
    );
  }

  private setData(token: string): void {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const tokenValid = !this.jwtHelper.isTokenExpired(token);
    const tokenExpirationDate = this.jwtHelper.getTokenExpirationDate(token);
    const timeUntilAutoLogout = tokenExpirationDate.getTime() - Date.now();
    const timer = window.setTimeout(() => this.logout(), timeUntilAutoLogout);
    this.store.set(['username'], decodedToken.unique_name);
    this.store.set(['token'], token);
    this.store.set(['tokenValid'], tokenValid);
    this.store.set(['tokenExpirationTimer'], timer);
    localStorage.setItem('token', token);
  }
}
