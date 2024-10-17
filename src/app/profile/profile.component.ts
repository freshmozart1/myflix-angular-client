import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    protected user: UserService['user'] | null = null;
    constructor(private userService: UserService, private router: Router) {
        this.user = this.userService.user;
        if (!this.user) this.router.navigate(['/welcome']);
    }
}
