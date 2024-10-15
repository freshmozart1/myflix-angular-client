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
        if (this.userService.user) {
            this.router.navigate(['/movies']);
        }
    }

    openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationForm, { width: '280px' });
    }

    openUserLoginDialog(): void {
        this.dialog.open(LoginForm, { width: '280px' });
    }
}
