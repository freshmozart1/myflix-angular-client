import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

/**
 * This component is responsible for displaying and managing the user's profile information.
 */
@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgIf,
        AsyncPipe
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    /**
     * The current user object.
     */
    protected user;
    /**
     * Form control for the username.
     */
    protected username!: FormControl<string | null>;
    /**
     * Form control for the password.
     */
    protected password!: FormControl<string | null>;
    /**
     * Form control for the email.
     */
    protected email!: FormControl<string | null>;
    /**
     * Form control for the birthday.
     */
    protected birthday!: FormControl<string | null>;

    /**
     * @param userService This service manages user data.
     * @param router This service navigates to other pages.
     */
    constructor(private userService: UserService, private router: Router) {
        this.user = this.userService.user;
        if (!this.user || !this.user.username) {
            this.router.navigate(['/welcome']);
            return;
        }
    }

    /**
     * Function to determine if the submit button of the profile form should be disabled based on the form controls' states.
     * @returns {boolean} True if the submit button should be disabled, false otherwise.
     */
    protected disableSubmit(): boolean {
        return [this.username, this.email, this.password, this.birthday].every(control => control.pristine) ||
            [this.username, this.email, this.password, this.birthday].some(control => control.dirty && control.invalid);
    }

    /**
     * Function to submit the form data to update the user's profile.
     * @returns {void}
     */
    protected submit(): void {
        let controls = [{ name: 'username', control: this.username }, { name: 'email', control: this.email }, { name: 'password', control: this.password }, { name: 'birthday', control: this.birthday }];
        if (controls.some(({ control }) => control.dirty && control.invalid)) {
            return;
        }
        controls = controls.filter(({ control }) => control.dirty);
        const submitObject = controls.reduce((acc: { [key: string]: any }, { name, control }) => {
            acc[name] = control.value;
            return acc;
        }, {});
        this.userService.patch(submitObject).subscribe({
            next: () => {
                window.location.reload();
            }
        });
    }

    /**
     * Function to initialize the form controls with the user's current data and set up validators.
     */
    ngOnInit(): void {
        this.username = new FormControl<string | null>(this.user.username);
        this.username.addAsyncValidators([this.userService.usernameExistsValidator(this.user.username)]);
        this.email = new FormControl<string | null>('');
        this.email.addValidators([this.userService.emailValidator()]);
        this.password = new FormControl('');
        this.password.addValidators([this.userService.passwordValidator()]);
        this.birthday = new FormControl('');
        this.birthday.addValidators([this.userService.birthdayValidator()]);
    }
}
