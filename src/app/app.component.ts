/**
 * @class AppComponent
 * 
 * @requires module:@angular/core
 * @requires module:@angular/router
 * @requires module:@angular/common
 * 
 * @export AppComponent
 * 
 * @description This component serves as the root component of the application, managing the main layout and user interactions.
 * 
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 * 
 * @method logout
 * @description Logs out the current user by setting the user property in the UserService to null.
 * @returns {void}
 */

import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    constructor(
        protected userService: UserService
    ) { }

    protected logout() {
        this.userService.user = null;
    }
}
