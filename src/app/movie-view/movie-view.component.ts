import { Component, inject } from '@angular/core';
import { Movie } from '../model/movie.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { AwsImagesPipe } from '../aws-images.pipe';
import { MatButtonModule } from '@angular/material/button';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';
/**
 * This component is responsible for displaying a movie dialog.
 */
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
    /**
     * This object contains the movie data to be displayed.
     * @protected
     */
    protected movie: Movie = inject(MAT_DIALOG_DATA).movie as Movie;

    /**
     * @param dialog Service for opening the director and genre dialogs.
     */
    constructor(private dialog: MatDialog) { }

    /**
     * Opens a dialog displaying the director details.
     * @protected
     * @returns {void}
     */
    protected openDirectorDetailsDialog(): void {
        this.dialog.open(DirectorViewComponent, {
            data: { director: this.movie.director },
            autoFocus: '#closeButton'
        });
    }

    /**
     * Opens a dialog displaying the genre details.
     * @protected
     * @returns {void}
     */
    protected openGenreDetailsDialog(): void {
        this.dialog.open(GenreViewComponent, {
            data: { genre: this.movie.genre },
            autoFocus: '#closeButton'
        });
    }
}
