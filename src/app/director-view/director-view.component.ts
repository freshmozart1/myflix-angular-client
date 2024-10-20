/**
 * @class DirectorViewComponent
 * 
 * @requires module:@angular/core
 * @requires module:@angular/material/dialog
 * @requires module:@angular/material/button
 * @requires module:@angular/common
 * 
 * @export DirectorViewComponent
 * 
 * @description This component is responsible for displaying the director's view, including details about the director.
 * 
 * @constructor
 * @param {MAT_DIALOG_DATA} data - Data injected into the dialog, containing the director information.
 * 
 * @property {Director} director - The director object containing details about the director.
 */

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Director } from '../model/director.model';
import { DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-director-view',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        NgClass,
        NgIf,
        DatePipe
    ],
    templateUrl: './director-view.component.html',
    styleUrl: './director-view.component.scss'
})
export class DirectorViewComponent {
    protected director: Director = inject(MAT_DIALOG_DATA).director as Director;
}
