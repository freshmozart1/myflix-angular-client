/**
 * @class MovieCardComponent
 * 
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * 
 * @requires module:@angular/core
 * @requires module:@angular/common
 * @requires module:@angular/material/card
 * @requires module:@angular/material/button
 * @requires module:@angular/material/icon
 * @requires module:@angular/material/dialog
 * @requires module:@angular/ripple
 * 
 * @export MovieCardComponent
 * 
 * @description This component is responsible for displaying movie cards and managing user interactions with them.
 * 
 * @property {Movie[]} movies - List of movies to display.
 * @property {string[]} favouriteIds - List of favourite movie IDs.
 * @property {UserService['user']} user - Service to manage user data.
 * 
 * @constructor
 * @param {FetchApiDataService} fetchApiData - Service to fetch data from the API.
 * @param {ElementRef} el - Reference needed to add a ripple effect to the component's buttons.
 * @param {MatDialog} dialog - Angular Material dialog to show movie, director, and genre details.
 * @param {UserService} userService - Service to manage user data.
 * 
 * @method openDirectorDetailsDialog
 * @description Opens the director details dialog.
 * @param {Director} director - Director object to display.
 * @returns {void}
 * 
 * @method openMovieDetailsDialog
 * @description Opens the movie details dialog.
 * @param {Movie} movie - Movie object to display.
 * @returns {void}
 * 
 * @method toggleFavourite
 * @description Toggles the favourite status of a movie.
 * @param {string} movieId - ID of the movie to toggle favourite status.
 * @returns {void}
 * 
 * @method ngOnInit
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 * @returns {void}
 * 
 * @method ngAfterViewInit
 * @description Lifecycle hook that is called after a component's view has been fully initialized.
 * @returns {void}
 */

import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NgForOf, AsyncPipe, NgIf } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../model/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MDCRipple } from '@material/ripple';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MovieViewComponent } from '../movie-view/movie-view.component';
import { AwsImagesPipe } from '../aws-images.pipe';
import { Observable } from 'rxjs';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { Director } from '../model/director.model';
import { UserService } from '../user.service';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [
        MatCardModule,
        NgForOf,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        AwsImagesPipe,
        NgIf
    ],
    templateUrl: './movie-card.component.html',
    styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent implements OnInit, AfterViewInit {
    protected movies: Movie[] = [];
    protected favouriteIds: string[] = [];
    protected user: UserService['user'] | null = null;

    constructor(
        protected fetchApiData: FetchApiDataService,
        private el: ElementRef,
        protected dialog: MatDialog,
        protected userService: UserService
    ) {
        this.user = this.userService.user;
    }

    protected openDirectorDetailsDialog(director: Director): void {
        this.dialog.open(DirectorViewComponent, {
            data: { director },
            autoFocus: '#closeButton'
        });
    }

    protected openMovieDetailsDialog(movie: Movie): void {
        this.dialog.open(MovieViewComponent, {
            data: { movie },
            autoFocus: '#closeButton'
        });
    }

    protected toggleFavourite(movieId: string): void {
        ((favouriteObserver: Observable<Movie[] | null>) => {
            favouriteObserver.subscribe({
                next: (response) => {
                    if (response) {
                        this.favouriteIds = [];
                        for (const { _id } of response) this.favouriteIds.push(_id);
                    }
                },
                error: (error: any) => {
                    console.error(error);
                }
            });
        })(this.favouriteIds.includes(movieId) ? this.userService.deleteFavourite(movieId) : this.userService.addFavourite(movieId));
    }

    ngOnInit(): void {
        const movieSubscriber = this.fetchApiData.movies.subscribe({
            next: (movies: Movie[]) => {
                this.movies = movies;
                movieSubscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error(error);
                movieSubscriber.unsubscribe();
            }
        });
        if (this.user?.username) {
            const favouritesSubscriber = this.userService.favourites.subscribe({
                next: (favourites: Movie[] | null) => {
                    this.favouriteIds = [];
                    if (!favourites) return
                    for (const { _id } of favourites) this.favouriteIds.push(_id);
                    favouritesSubscriber.unsubscribe();
                },
                error: (error: any) => {
                    console.error(error);
                    favouritesSubscriber.unsubscribe();
                }
            });
        }
    }

    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
