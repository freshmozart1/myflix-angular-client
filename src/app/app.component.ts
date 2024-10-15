import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    protected user: UserService['user'] | null; //user is either of type 'user' from UserService or null
    constructor(
        protected userService: UserService
    ) {
        this.user = this.userService.user;
    }
}
