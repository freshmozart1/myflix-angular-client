import { Component, inject } from '@angular/core';
import { Movie } from '../model/movie.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { AwsImagesPipe } from '../aws-images.pipe';
import { MatButtonModule } from '@angular/material/button';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';

@Component({
    selector: 'app-movie-view',
    standalone: true,
    imports: [
        MatDialogModule,
        AsyncPipe,
        AwsImagesPipe,
        MatButtonModule
    ],
    templateUrl: './movie-view.component.html',
    styleUrl: './movie-view.component.scss'
})
export class MovieViewComponent {
    protected movie: Movie = inject(MAT_DIALOG_DATA).movie as Movie;

    constructor(private dialog: MatDialog) { }

    protected openDirectorDetailsDialog(): void {
        this.dialog.open(DirectorViewComponent, {
            data: { director: this.movie.director },
            autoFocus: '#closeButton'
        });
    }

    protected openGenreDetailsDialog(): void {
        this.dialog.open(GenreViewComponent, {
            data: { genre: this.movie.genre },
            autoFocus: '#closeButton'
        });
    }
}
