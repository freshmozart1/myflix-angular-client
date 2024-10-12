import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

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
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<LoginFormComponent>,
        public router: Router
    ) { }

    protected loginUser(): void {
        const loginSubscriber = this.fetchApiData.userLogin(this.userData).subscribe({
            next: (result) => {
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', result.user.username);
                console.log(result);
            },
            complete: () => {
                this.dialogRef.close();
                this._snackBar.open('Login successfull!', 'OK', {
                    duration: 2000
                });
                if (!loginSubscriber.closed) loginSubscriber.unsubscribe();
                this.router.navigate(['movies']);
            },
            error: (error: HttpErrorResponse) => {
                console.error(error);
                this._snackBar.open(error.error.message, 'OK', {
                    duration: 2000
                });
                if (!loginSubscriber.closed) loginSubscriber.unsubscribe();
            }
        });
    }
}
