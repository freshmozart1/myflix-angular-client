import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MovieThumbnailPipe } from '../movie-thumbnail.pipe';
import { Movie } from '../movie.model';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [
        MatCardModule,
        MatDialogModule,
        NgForOf,
        MovieThumbnailPipe,
        CommonModule
    ],
    templateUrl: './movie-card.component.html',
    styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
    movies: Movie[] = [];
    constructor(public fetchApiData: FetchApiDataService) {
    }
    ngOnInit(): void {
        const subscriber = this.fetchApiData.getMovies().subscribe({
            next: (movies: Movie[]) => {
                console.log(movies);
                this.movies = movies;
                subscriber.unsubscribe();
            },
            error: (error: any) => {
                console.error(error);
                subscriber.unsubscribe
            }
        });
    }
}
