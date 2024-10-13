import { Component, inject } from '@angular/core';
import { Movie } from '../model/movie.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { AwsImagesPipe } from '../aws-images.pipe';
import { MatButtonModule } from '@angular/material/button';

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
}
