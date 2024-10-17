import { Injectable } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router } from '@angular/router';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Movie } from './model/movie.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fetchApiData: FetchApiDataService) { }

  public set user(login: { username: string, password: string, dialog: MatDialogRef<LoginFormComponent | RegistrationFormComponent>, router: Router, snackBar?: MatSnackBar | undefined } | null) {
    if (login) {
      const loginSubscriber = this.fetchApiData.userLogin({ username: login.username, password: login.password }).subscribe({
        next: (result) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('username', result.user.username);
        },
        complete: () => {
          login.dialog.close();
          if (login.snackBar) {
            const snackBarText = login.dialog.componentInstance instanceof RegistrationFormComponent
              ? 'Registration successful!'
              : 'Login successful!';
            login.snackBar.open(snackBarText, 'OK', {
              duration: 2000
            });
          }
          loginSubscriber.unsubscribe();
          login.router.navigate(['movies']);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          if (login.snackBar) login.snackBar.open(error.error.message, 'OK', { //error.error.message is the error message from the backend
            duration: 2000
          });
          loginSubscriber.unsubscribe();
        }
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    }
  }

  public get user(): { username: string | null, token: string | null } | null {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return username && token ? { username, token } : null;
  }

  public registrate(
    user: {
      username: string,
      password: string,
      email: string,
      birthday?: string | undefined
    },
    dialog: MatDialogRef<RegistrationFormComponent>,
    router: Router,
    snackBar?: MatSnackBar | undefined): void {
    const registrationSubscriber = this.fetchApiData.userRegistration(user).subscribe({
      next: () => {
        this.user = {
          username: user.username,
          password: user.password,
          dialog,
          router,
          snackBar
        };
        registrationSubscriber.unsubscribe();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        if (snackBar) snackBar.open(error.error, 'OK', {
          duration: 2000
        });
        registrationSubscriber.unsubscribe();
      }
    });
  }

  public patch(user: { username?: string, password?: string, email?: string, birthday?: string, favourites: string[] }): void {
    const patchSubscriber = this.fetchApiData.patchUser(user).subscribe({
      next: (result) => {
        console.log('User updated successfully', result);
        patchSubscriber.unsubscribe();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating user', error);
        patchSubscriber.unsubscribe();
      }
    });
  }

  public get favourites(): Observable<Movie[] | null> {
    return this.fetchApiData.favourites;
  }
}
