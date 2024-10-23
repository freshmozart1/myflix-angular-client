import { Component, Input, inject } from '@angular/core';
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
export class RegistrationFormComponent {

    /**
     * @private
     * This object contains the snack bar service.
     */
    private _snackBar = inject(MatSnackBar);

    /**
     * @protected
     * This object contains the user data from the registration form.
     */
    @Input({ required: true })
    protected userData = { username: '', password: '', email: '', birthday: undefined };

    /**
     * This component is responsible for handling user registration.
     * @param dialogRef Reference to the dialog containing this component.
     * @param userService This service manages user data.
     * @param router This service navigates to other pages.
     */
    constructor(
        private dialogRef: MatDialogRef<RegistrationFormComponent>,
        private userService: UserService,
        private router: Router
    ) { }

    /**
     * @protected
     * Registers a new user using the user service and provides feedback via a snack bar.
     * @returns {void}
     */
    protected registerUser(): void {
        this.userService.registrate(this.userData, this.dialogRef, this.router, this._snackBar);
    }
}
