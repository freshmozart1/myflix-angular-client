import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationFormComponent as RegistrationForm } from './registration-form/registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        MatButtonModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'myFlix-Angular-client';
    constructor(public dialog: MatDialog) { }

    openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationForm, { width: '280px' });
    }
}
