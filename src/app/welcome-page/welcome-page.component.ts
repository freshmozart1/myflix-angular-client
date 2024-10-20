/**
 * @class WelcomePageComponent
 * 
 * @requires module:@angular/core
 * @requires module:@angular/material/dialog
 * @requires module:@angular/material/button
 * @requires module:@angular/router
 * 
 * @export WelcomePageComponent
 * 
 * @description This component is responsible for displaying the welcome page and managing user interactions with it.
 * 
 * @constructor
 * @param {MatDialog} dialog - Angular Material dialog to show registration and login forms.
 * @param {Router} router - Angular router to navigate to other pages.
 * @param {UserService} userService - Service to manage user data.
 * 
 * @method openUserRegistrationDialog
 * @description Opens the registration form dialog.
 * @returns {void}
 * 
 * @method openUserLoginDialog
 * @description Opens the login form dialog.
 * @returns {void}
 */

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent as RegistrationForm } from '../registration-form/registration-form.component';
import { LoginFormComponent as LoginForm } from '../login-form/login-form.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [
        MatButtonModule
    ],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
    constructor(
        protected dialog: MatDialog,
        private router: Router,
        private userService: UserService
    ) {
        if (this.userService.user.username) {
            this.router.navigate(['/movies']);
        }
    }


    protected openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationForm, { width: '280px' });
    }

    protected openUserLoginDialog(): void {
        this.dialog.open(LoginForm, { width: '280px' });
    }
}
