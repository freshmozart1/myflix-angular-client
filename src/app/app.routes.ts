import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {
        path: 'welcome', component: WelcomePageComponent
    },
    {
        path: 'movies', component: MovieCardComponent
    },
    {
        path: 'profile', component: ProfileComponent
    },
    {
        path: '', redirectTo: '/welcome', pathMatch: 'prefix'
    }
];
