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
        this.userService.registrateUser(this.userData, this.dialogRef, this.router, this._snackBar);
    }
}
