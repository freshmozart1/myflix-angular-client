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
