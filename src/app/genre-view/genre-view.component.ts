import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Genre } from '../model/genre.model';

/**
 * This component is responsible for displaying a genre dialog.
 */
@Component({
  selector: 'app-genre-view',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,

  ],
  templateUrl: './genre-view.component.html',
  styleUrl: './genre-view.component.scss'
})
export class GenreViewComponent {
  /**
   * @protected
   * This object contains the genre data to be displayed.
   */
  protected genre: Genre = inject(MAT_DIALOG_DATA).genre as Genre;
}
