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
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';

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

  public get user(): { username: string, token: string } {
    let username = localStorage.getItem('username');
    username = username ? username : '';
    let token = localStorage.getItem('token');
    token = token ? token : '';
    return { username, token };
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

  public patch(user: { username?: string, password?: string, email?: string, birthday?: string, favourites?: string[] }): Observable<any> {
    const userObservable = this.fetchApiData.patchUser(user);
    const patchSubscriber = userObservable.subscribe({
      next: () => {
        if (user.username) {
          localStorage.setItem('username', user.username);
        }
        alert('User updated successfully');
        patchSubscriber.unsubscribe();
      },
      error: (error: HttpErrorResponse) => {
        alert(`Error updating user: ${error.error}`,);
        patchSubscriber.unsubscribe();
      }
    });
    return userObservable;
  }

  public get favourites(): Observable<Movie[] | null> {
    return this.fetchApiData.favourites;
  }

  public deleteFavourite(movieId: string): Observable<Movie[] | null> {
    return this.fetchApiData.deleteFavourite(movieId);
  }

  public addFavourite(movieId: string): Observable<Movie[] | null> {
    return this.fetchApiData.addFavourite(movieId);
  }

  public usernameExistsValidator(currentUsername: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return new Observable(observer => {
        if (control.value === currentUsername) {
          observer.next(null);
          observer.complete();
          return;
        }
        this.fetchApiData.getUser(control.value).subscribe({
          next: () => {
            observer.next({ usernameExists: true });
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 404) {
              observer.next(null);
            } else {
              observer.next({ usernameExists: false });
            }
            observer.complete();
          }
        });
      });
    };
  }

  public passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.length < 8) {
        return { passwordTooShort: true };
      }
      return null;
    };
  }

  public emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }

  public birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value.match(/^\d{2}.\d{2}.\d{4}$/)) {
        return { invalidBirthday: true };
      }
      return null;
    };
  }

}
