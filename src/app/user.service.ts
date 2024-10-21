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

/**
 * @class UserService
 * 
 * @requires module:@angular/core
 * @requires module:@angular/material/dialog
 * @requires module:@angular/material/snack-bar
 * @requires module:@angular/router
 * @requires module:@angular/forms
 * @requires module:rxjs
 * @requires module:@angular/common/http
 * 
 * @export UserService
 * 
 * @description 
 * 
 * @constructor
 * @param {FetchApiDataService} fetchApiData - Service to interact with the backend API.
 * 
 * @property {Object} user
 * @description Getter and setter for the user object. The setter handles user login and logout, while the getter retrieves the user data from local storage.
 * @returns {Object} The user object containing username and token.
 * 
 * @method registrate
 * @description Registers a new user and logs them in upon successful registration.
 * @param {Object} user - The user object containing username, password, email, and birthday.
 * @param {MatDialogRef<RegistrationFormComponent>} dialog - Reference to the registration form dialog.
 * @param {Router} router - Angular router to navigate to other pages.
 * @param {MatSnackBar} [snackBar] - Angular Material snack bar to show notifications.
 * @returns {void}
 * 
 * @method patch
 * @description Updates user data.
 * @param {Object} user - The user object containing fields to update: username, password, email, birthday, and favourites.
 * @returns {Observable<any>} An observable that emits the result of the update operation.
 * 
 * @method favourites
 * @description Retrieves the user's favourite movies.
 * @returns {Observable<Movie[] | null>} An observable that emits the list of favourite movies or null.
 * 
 * @method deleteFavourite
 * @description Deletes a movie from the user's favourites.
 * @param {string} movieId - The ID of the movie to delete from favourites.
 * @returns {Observable<Movie[] | null>} An observable that emits the updated list of favourite movies or null.
 * 
 * @method addFavourite
 * @description Adds a movie to the user's favourites.
 * @param {string} movieId - The ID of the movie to add to favourites.
 * @returns {Observable<Movie[] | null>} An observable that emits the updated list of favourite movies or null.
 * 
 * @method usernameExistsValidator
 * @description Validator function to check if a username already exists.
 * @param {string} currentUsername - The current username to compare against.
 * @returns {AsyncValidatorFn} An asynchronous validator function.
 * 
 * @method passwordValidator
 * @description Validator function to check if a password meets the minimum length requirement.
 * @returns {ValidatorFn} A synchronous validator function.
 * 
 * @method emailValidator
 * @description Validator function to check if an email address is valid.
 * @returns {ValidatorFn} A synchronous validator function.
 * 
 * @method birthdayValidator
 * @description Validator function to check if a birthday is in the correct format.
 * @returns {ValidatorFn} A synchronous validator function.
 */
/**
 * This service is responsible for managing user data, including login, registration, and user updates.
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * @param fetchApiData Service to interact with the backend API.
   */
  constructor(private fetchApiData: FetchApiDataService) { }

  /**
   * This setter function handles user login and logout. It also stores the user data in local storage.
   * @param login The login object containing username, password, dialog, router, and a snackbar. If null, the user is logged out.
   * @param login.username The username of the user.
   * @param login.password The password of the user.
   * @param login.dialog Reference to the login or registration form dialog.
   * @param login.router Angular router to navigate to other pages.
   * @param login.snackBar Angular Material snack bar to show notifications.
   */
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

  /**
   * This getter function retrieves the user data from local storage.
   */
  public get user(): { username: string, token: string } {
    let username = localStorage.getItem('username');
    username = username ? username : '';
    let token = localStorage.getItem('token');
    token = token ? token : '';
    return { username, token };
  }

  /**
   * This function registers a new user and logs them in upon successful registration.
   * @param user Object containing user details
   * @param user.username The username of the user
   * @param user.password The password of the user
   * @param user.email The email of the user
   * @param user.birthday The birthday of the user
   * @param dialog Reference to the registration form dialog
   * @param router Router to navigate to other pages
   * @param snackBar Angular Material snack bar to show notifications
   */
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

  /**
   * 
   * @param user Object containing user details to update
   * @param user.username The new username of the user
   * @param user.password The new password of the user
   * @param user.email The new email of the user
   * @param user.birthday The new birthday of the user
   * @param user.favourites The new list of favourite movies of the user
   * @returns {Observable<any>} An observable that emits the result of the update operation
   */
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

  /**
   * Retrieves the user's favourite movies.
   * @returns {Observable<Movie[] | null>} An observable that emits the list of favourite movies or null.
   */
  public get favourites(): Observable<Movie[] | null> {
    return this.fetchApiData.favourites;
  }

  /**
   * Function to delete a movie from the user's favourites.
   * @param movieId The id of the movie to delete from favourites
   * @returns {Observable<Movie[] | null>} An observable that emits the updated list of favourite movies or null.
   */
  public deleteFavourite(movieId: string): Observable<Movie[] | null> {
    return this.fetchApiData.deleteFavourite(movieId);
  }

  /**
   * Function to add a movie to the user's favourites.
   * @param movieId The id of the movie to add to favourites
   * @returns {Observable<Movie[] | null>} An observable that emits the updated list of favourite movies or null.
   */
  public addFavourite(movieId: string): Observable<Movie[] | null> {
    return this.fetchApiData.addFavourite(movieId);
  }

  /**
   * A validator function to check if a username already exists.
   * @param currentUsername The username to check
   * @returns {AsyncValidatorFn} An asynchronous validator function
   */
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

  /**
   * A validator function to check if a password meets the minimum length requirement.
   * @returns {ValidatorFn} A synchronous validator function
   */
  public passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.length < 8) {
        return { passwordTooShort: true };
      }
      return null;
    };
  }

  /**
   * A validator function to check if an email address is valid.
   * @returns {ValidatorFn} A synchronous validator function
   */
  public emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }

  /**
   * A validator function to check if a birthday is in the correct format.
   * @returns {ValidatorFn} A synchronous validator function
   */
  public birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value.match(/^\d{2}.\d{2}.\d{4}$/)) {
        return { invalidBirthday: true };
      }
      return null;
    };
  }

}
