import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

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
    templateUrl: './user-registration-form.component.html',
    styleUrl: './user-registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit {

    @Input({ required: true })
    private _snackBar = inject(MatSnackBar);
    userData = { username: '', password: '', email: '', birthday: undefined };

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<RegistrationFormComponent>
    ) { }

    ngOnInit(): void {
    }

    protected registerUser(): void {
        const { unsubscribe } = this.fetchApiData.userRegistration(this.userData).subscribe({
            next: (result) => console.log(result),
            complete: () => {
                this.dialogRef.close();
                this._snackBar.open('User registered successfully!', 'OK', {
                    duration: 2000
                });
                unsubscribe();
            },
            error: (error: HttpErrorResponse) => {
                console.error(error);
                this._snackBar.open(error.error, 'OK', {
                    duration: 2000
                });
                unsubscribe();
            }
        });
    }
}
