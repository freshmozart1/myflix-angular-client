import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent as RegistrationForm } from '../registration-form/registration-form.component';
import { LoginFormComponent as LoginForm } from '../login-form/login-form.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

/**
 * This component is the welcome page of the application.
 */
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
    /**
     * @param dialog Service to open registration or login dialog
     * @param router Service to navigate to other pages
     * @param userService Service to manage user data
     */
    constructor(
        private dialog: MatDialog,
        private router: Router,
        private userService: UserService
    ) {
        if (this.userService.user.username) {
            this.router.navigate(['/movies']);
        }
    }

    /**
     * @protected
     * Opens the user registration dialog.
     * @returns {void}
     */
    protected openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationForm, { width: '280px' });
    }

    /**
     * @protected
     * Opens the user login dialog.
     * @returns {void}
     */
    protected openUserLoginDialog(): void {
        this.dialog.open(LoginForm, { width: '280px' });
    }
}
