import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
    protected user;
    protected username!: FormControl<string | null>;
    protected password!: FormControl<string | null>;
    protected email!: FormControl<string | null>;
    protected birthday!: FormControl<string | null>;

    constructor(private userService: UserService, private router: Router) {
        this.user = this.userService.user;
        if (!this.user || !this.user.username) {
            this.router.navigate(['/welcome']);
            return;
        }
    }

    protected disableSubmit(): boolean {
        return [this.username, this.email, this.password, this.birthday].every(control => control.pristine) ||
            [this.username, this.email, this.password, this.birthday].some(control => control.dirty && control.invalid);
    }

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
