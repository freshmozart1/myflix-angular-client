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
        ((favouriteObserver: Observable<any>) => {
            favouriteObserver.subscribe({
                next: (response: any) => {
                    console.log(response);
                    this.getFavourites();
                },
                error: (error: any) => {
                    console.error(error);
                    this.getFavourites();
                }
            });
        })(this.favouriteIds.includes(movieId) ? this.fetchApiData.deleteFavourite(movieId) : this.fetchApiData.addFavourite(movieId));
    }

    private getFavourites(): void {
        const favouriteSubscriber = this.fetchApiData.favourites.subscribe({
            next: ({ favourites }) => {
                console.log(favourites);
                this.favouriteIds = favourites ? favourites : [];
                favouriteSubscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error(error);
                favouriteSubscriber.unsubscribe();
            }
        });
    }

    ngOnInit(): void {
        const movieSubscriber = this.fetchApiData.movies.subscribe({
            next: (movies: Movie[]) => {
                console.log(movies);
                this.movies = movies;
                movieSubscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error(error);
                movieSubscriber.unsubscribe
            }
        });
        this.getFavourites();
    }

    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
