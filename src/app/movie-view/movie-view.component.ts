import { Component, inject, OnInit } from '@angular/core';
import { Movie } from '../model/movie.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import { AwsImagesPipe } from '../aws-images.pipe';

@Component({
    selector: 'app-movie-view',
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        AsyncPipe,
        AwsImagesPipe
    ],
    templateUrl: './movie-view.component.html',
    styleUrl: './movie-view.component.scss'
})
export class MovieViewComponent {
    protected movie: Movie = inject(MAT_DIALOG_DATA).movie as Movie;
}
