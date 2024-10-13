import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NgForOf, AsyncPipe, NgIf } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MovieThumbnailPipe } from '../movie-thumbnail.pipe';
import { Movie } from '../model/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MDCRipple } from '@material/ripple';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [
        MatCardModule,
        MatDialogModule,
        NgForOf,
        MovieThumbnailPipe,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        NgIf
    ],
    templateUrl: './movie-card.component.html',
    styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit, AfterViewInit {
    movies: Movie[] = [];
    favouriteIds: string[] = [];
    constructor(
        public fetchApiData: FetchApiDataService,
        private el: ElementRef
    ) {
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
        const favouriteSubscriber = this.fetchApiData.favourites.subscribe({
            next: ({ favourites }) => {
                console.log(favourites);
                this.favouriteIds = favourites;
                favouriteSubscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error(error);
                favouriteSubscriber.unsubscribe();
            }
        });
    }
    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
