import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';

/**
 * @class LoginFormComponent
 * 
 * @requires module:@angular/core
 * @requires module:@angular/material/snack-bar
 * @requires module:@angular/material/dialog
 * @requires module:@angular/router
 * @requires module:@angular/forms
 * @requires module:@angular/material/card
 * @requires module:@angular/material/form-field
 * @requires module:@angular/material/button
 * @requires module:@angular/material/input
 * 
 * @export LoginFormComponent
 * 
 * @description This component is responsible for handling the user login form and managing user authentication.
 * 
 * @constructor
 * @param {MatDialogRef<LoginFormComponent>} dialogRef - Reference to the dialog containing this component.
 * @param {Router} router - Angular router to navigate to other pages.
 * @param {UserService} userService - Service to manage user data.
 * 
 * @property {MatSnackBar} _snackBar - Angular Material snack bar for displaying notifications.
 * @property {Object} userData - Object containing user credentials.
 * @property {string} userData.username - The username entered by the user.
 * @property {string} userData.password - The password entered by the user.
 * 
 * @method loginUser
 * @description Authenticates the user with the provided credentials and updates the user service.
 * @returns {void}
 */
@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatInputModule
    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

    private _snackBar = inject(MatSnackBar);

    @Input({ required: true })
    userData = { username: '', password: '' };

    constructor(
        public dialogRef: MatDialogRef<LoginFormComponent>,
        public router: Router,
        private userService: UserService
    ) { }

    protected loginUser(): void {
        this.userService.user = {
            username: this.userData.username,
            password: this.userData.password,
            dialog: this.dialogRef,
            router: this.router,
            snackBar: this._snackBar
        };
    }
}
