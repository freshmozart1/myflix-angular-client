/**
 * @module app
 * @hidden
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
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
        path: '', redirectTo: '/welcome', pathMatch: 'full'
    }
];
export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideAnimationsAsync()
    ]
};