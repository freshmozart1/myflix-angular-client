/**
 * @class RegistrationFormComponent
 * 
 * @requires module:@angular/core
 * @requires module:@angular/material/dialog
 * @requires module:@angular/material/snack-bar
 * @requires module:@angular/material/card
 * @requires module:@angular/material/form-field
 * @requires module:@angular/forms
 * @requires module:@angular/material/button
 * @requires module:@angular/material/input
 * @requires module:@angular/router
 * @requires module:../user.service
 * 
 * @export RegistrationFormComponent
 * 
 * @description This component is responsible for handling user registration, including form input and submission.
 * 
 * @constructor
 * @param {MatDialogRef<RegistrationFormComponent>} dialogRef - Reference to the dialog containing this component.
 * @param {UserService} userService - Service to manage user data.
 * @param {Router} router - Angular router to navigate to other pages.
 * 
 * @property {Object} userData - The user data object containing username, password, email, and birthday.
 * @property {string} userData.username - The username of the user.
 * @property {string} userData.password - The password of the user.
 * @property {string} userData.email - The email of the user.
 * @property {Date | undefined} userData.birthday - The birthday of the user.
 * 
 * @method ngOnInit
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 * @returns {void}
 * 
 * @method registerUser
 * @description Registers a new user using the user service and provides feedback via a snack bar.
 * @returns {void}
 */

import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-registration-form',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatInputModule
    ],
    templateUrl: './registration-form.component.html',
    styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit {

    private _snackBar = inject(MatSnackBar);

    @Input({ required: true })
    userData = { username: '', password: '', email: '', birthday: undefined };

    constructor(
        public dialogRef: MatDialogRef<RegistrationFormComponent>,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    protected registerUser(): void {
        this.userService.registrate(this.userData, this.dialogRef, this.router, this._snackBar);
    }
}
