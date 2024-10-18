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
                movieSubscriber.unsubscribe
            }
        });
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

    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
