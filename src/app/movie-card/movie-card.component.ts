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
/**
 * This component is responsible for displaying movie cards and managing user interactions with them.
 */
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
    /**
     * List of movies to display.
     */
    protected movies: Movie[] = [];
    /**
     * List of favourite movie IDs.
     */
    protected favouriteIds: string[] = [];
    /**
     * Object that represents the current user.
     */
    protected user: UserService['user'] | null = null;

    /**
     * 
     * @param fetchApiData Service to fetch data from the API.
     * @param el Reference needed to add a ripple effect to the component's buttons.
     * @param dialog Serice for opening dialogs to display movie, director, and genre details.
     * @param userService Service to manage user data.
     */
    constructor(
        protected fetchApiData: FetchApiDataService,
        private el: ElementRef,
        protected dialog: MatDialog,
        protected userService: UserService
    ) {
        this.user = this.userService.user;
    }

    /**
     * This function opens the director details dialog.
     * @param director Director object to display.
     */
    protected openDirectorDetailsDialog(director: Director): void {
        this.dialog.open(DirectorViewComponent, {
            data: { director },
            autoFocus: '#closeButton'
        });
    }

    /**
     * This function opens the movie details dialog.
     * @param movie Movie object to display.
     */
    protected openMovieDetailsDialog(movie: Movie): void {
        this.dialog.open(MovieViewComponent, {
            data: { movie },
            autoFocus: '#closeButton'
        });
    }

    /**
     * Toggles the favourite status of a movie for the current user.
     * @param movieId ID of the movie to toggle favourite status.
     */
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

    /**
     * This function subscribes to the movies and favourites observables to get the data needed for the component.
     */
    ngOnInit(): void {
        const movieSubscriber = this.fetchApiData.movies.subscribe({
            next: (movies: Movie[]) => {
                this.movies = movies;
                movieSubscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error('Can not fetch movies', error);
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

    /**
     * This function adds a ripple effect to the component's buttons.
     * @experimental
     */
    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
