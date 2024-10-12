import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Movie } from './model/movie.model';
import { Director } from './model/director.model';
import { Genre } from './model/genre.model';

@Injectable({
    providedIn: 'root'
})
export class FetchApiDataService {

    constructor(
        private http: HttpClient
    ) { }

    public userRegistration(userDetails: any): Observable<any> {
        return this.http.post(environment.apiUrl + 'users', userDetails);
    }

    public userLogin(userData: { username: string, password: string }): Observable<any> {
        return this.http.post(`${environment.apiUrl}login?username=${userData.username}&password=${userData.password}`, {});
    }

    public deleteUser(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(`${environment.apiUrl}users/${username}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getUser(username: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/${username}`);
    }

    public addFavourite(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.post(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {}, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public deleteFavourite(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getFavourites(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.get(`${environment.apiUrl}users/${username}/movies`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getMovies(limit?: number): Observable<Movie[]> {
        const token = localStorage.getItem('token');
        return this.http.get<Movie[]>(`${environment.apiUrl}movies/${limit ? `?limit=${limit}` : ''}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getMovie(title: string): Observable<Movie> {
        return this.http.get<Movie>(`${environment.apiUrl}movies/${encodeURIComponent(title)}`);
    }

    public postMovie(movie: { title: string, description: string, genre: object, director: object, image: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}movies`, movie, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getDirectors(limit?: number): Observable<Director[]> {
        return this.http.get<Director[]>(`${environment.apiUrl}directors/${limit ? `?limit=${limit}` : ''}`);
    }

    public getDirector(name: string): Observable<Director> {
        return this.http.get<Director>(`${environment.apiUrl}directors/${encodeURIComponent(name)}`);
    }

    public postDirector(director: { name: string, biography: string, birthday: string, deathday?: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}directors`, director, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getGenres(limit?: number): Observable<Genre[]> {
        return this.http.get<Genre[]>(`${environment.apiUrl}genres/${limit ? `?limit=${limit}` : ''}`);
    }

    public getGenre(name: string): Observable<Genre> {
        return this.http.get<Genre>(`${environment.apiUrl}genres/${encodeURIComponent(name)}`);
    }
}
