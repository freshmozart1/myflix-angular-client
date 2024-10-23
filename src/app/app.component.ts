import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent {
    /**
     * This component is responsible for managing the main view of the application.
     * @param userService Service to manage user data.
     */
    constructor(
        protected userService: UserService
    ) { }

    /**
     * Logs out the current user by setting the user property in the UserService to null.
     * @returns {void}
     */
    protected logout(): void {
        this.userService.user = null;
    }
}
