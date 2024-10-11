import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FetchApiDataService {

    constructor(private http: HttpClient) { }

    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(environment.apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
    }

    public userLogin(username: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/login?username=${username}&password=${password}`, {}).pipe(catchError(this.handleError));
    }

    public deleteUser(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(`${environment.apiUrl}users/${username}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public getUser(username: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/${username}`).pipe(catchError(this.handleError));
    }

    public addFavourite(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.post(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {}, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public deleteFavourite(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public getFavourites(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.get(`${environment.apiUrl}users/${username}/movies`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public getMovies(limit?: number): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(`${environment.apiUrl}movies/${limit ? `?limit=${limit}` : ''}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(map(this.extractResponseData), catchError(this.handleError));
    }

    public getMovie(title: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}movies/${encodeURIComponent(title)}`).pipe(catchError(this.handleError));
    }

    public postMovie(movie: { title: string, description: string, genre: object, director: object, image: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}movies`, movie, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public getDirectors(limit?: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}directors/${limit ? `?limit=${limit}` : ''}`).pipe(map(this.extractResponseData), catchError(this.handleError));
    }

    public getDirector(name: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}directors/${encodeURIComponent(name)}`).pipe(catchError(this.handleError));
    }

    public postDirector(director: { name: string, biography: string, birthday: string, deathday?: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}directors`, director, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(catchError(this.handleError));
    }

    public getGenres(limit?: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}genres/${limit ? `?limit=${limit}` : ''}`).pipe(map(this.extractResponseData), catchError(this.handleError));
    }

    public getGenre(name: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}genres/${encodeURIComponent(name)}`).pipe(catchError(this.handleError));
    }

    private extractResponseData(res: object): any {
        const body = res;
        return body || {};
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Some error occurred:', error.error.message);
        } else {
            console.error(`Error Status code ${error.status}, ` + `Error body is: ${error.error}`);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
