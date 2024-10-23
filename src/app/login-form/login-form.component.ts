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

    /**
     * Angular Material snack bar for displaying login notifications.
     * @private
     */
    private _snackBar = inject(MatSnackBar);

    /**
     * Object containing user credentials.
     * @protected
     */
    @Input({ required: true })
    protected userData = { username: '', password: '' };

    /**
     * This component is responsible for handling the user login form and managing user authentication.
     * @param dialogRef Reference to the dialog containing this component.
     * @param router Angular router to navigate to other pages.
     * @param userService Service to manage user data.
     */
    constructor(
        private dialogRef: MatDialogRef<LoginFormComponent>,
        private router: Router,
        private userService: UserService
    ) { }

    /**
     * Authenticates the user with the provided credentials and updates the user service.
     * @protected
     * @returns {void}
     */
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
