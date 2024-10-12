import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent as RegistrationForm } from '../registration-form/registration-form.component';
import { LoginFormComponent as LoginForm } from '../login-form/login-form.component';
import { MatButtonModule } from '@angular/material/button';

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
    constructor(public dialog: MatDialog) { }

    openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationForm, { width: '280px' });
    }

    openUserLoginDialog(): void {
        this.dialog.open(LoginForm, { width: '280px' });
    }
}
