import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NgForOf, AsyncPipe } from '@angular/common';
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
        MatIconModule
    ],
    templateUrl: './movie-card.component.html',
    styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit, AfterViewInit {
    movies: Movie[] = [];
    constructor(public fetchApiData: FetchApiDataService, private el: ElementRef) {
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
    ngAfterViewInit(): void {
        for (let button of this.el.nativeElement.querySelectorAll('button')) {
            new MDCRipple(button);
        }
    }
}
