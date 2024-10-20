/**
 * @class FetchApiDataService
 * 
 * @requires module:@angular/core
 * @requires module:@angular/common/http
 * @requires module:rxjs
 * @requires module:../environments/environment
 * @requires module:./model/movie.model
 * @requires module:./model/director.model
 * @requires module:./model/genre.model
 * 
 * @export FetchApiDataService
 * 
 * @description This service is responsible for making HTTP requests to the API for user registration, login, and various CRUD operations related to movies, directors, and genres.
 * 
 * @constructor
 * @param {HttpClient} http - Angular HttpClient to make HTTP requests.
 * 
 * @method userRegistration
 * @description Registers a new user.
 * @param {any} userDetails - The details of the user to register.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method userLogin
 * @description Logs in a user.
 * @param {{ username: string, password: string }} userData - The username and password of the user.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method deleteUser
 * @description Deletes the current user.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method patchUser
 * @description Updates the current user's details.
 * @param {{ username?: string, password?: string, email?: string, birthday?: string, favourites?: string[] }} userData - The new details of the user.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method getUser
 * @description Retrieves the details of a user.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Observable<any>} An observable containing the user's details.
 * 
 * @method addFavourite
 * @description Adds a movie to the user's list of favourites.
 * @param {string} movieId - The ID of the movie to add.
 * @returns {Observable<Movie[]>} An observable containing the updated list of favourite movies.
 * 
 * @method deleteFavourite
 * @description Removes a movie from the user's list of favourites.
 * @param {string} movieId - The ID of the movie to remove.
 * @returns {Observable<Movie[] | null>} An observable containing the updated list of favourite movies or null if the list is empty.
 * 
 * @method get favourites
 * @description Retrieves the user's list of favourite movies.
 * @returns {Observable<Movie[] | null>} An observable containing the list of favourite movies or null if the list is empty.
 * 
 * @method get movies
 * @description Retrieves the list of all movies.
 * @returns {Observable<Movie[]>} An observable containing the list of movies.
 * 
 * @method getMovie
 * @description Retrieves the details of a specific movie.
 * @param {string} title - The title of the movie to retrieve.
 * @returns {Observable<Movie>} An observable containing the movie's details.
 * 
 * @method postMovie
 * @description Adds a new movie.
 * @param {{ title: string, description: string, genre: object, director: object, image: string }} movie - The details of the movie to add.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method getDirectors
 * @description Retrieves the list of directors.
 * @param {number} [limit] - Optional limit on the number of directors to retrieve.
 * @returns {Observable<Director[]>} An observable containing the list of directors.
 * 
 * @method getDirector
 * @description Retrieves the details of a specific director.
 * @param {string} name - The name of the director to retrieve.
 * @returns {Observable<Director>} An observable containing the director's details.
 * 
 * @method postDirector
 * @description Adds a new director.
 * @param {{ name: string, biography: string, birthday: string, deathday?: string }} director - The details of the director to add.
 * @returns {Observable<any>} An observable containing the response from the API.
 * 
 * @method getGenres
 * @description Retrieves the list of genres.
 * @param {number} [limit] - Optional limit on the number of genres to retrieve.
 * @returns {Observable<Genre[]>} An observable containing the list of genres.
 * 
 * @method getGenre
 * @description Retrieves the details of a specific genre.
 * @param {string} name - The name of the genre to retrieve.
 * @returns {Observable<Genre>} An observable containing the genre's details.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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

    public patchUser(userData: { username?: string, password?: string, email?: string, birthday?: string, favourites?: string[] }): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.patch(`${environment.apiUrl}users/${username}`, userData, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public getUser(username: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/${username}`);
    }

    public addFavourite(movieId: string): Observable<Movie[]> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.post<Movie[]>(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {}, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public deleteFavourite(movieId: string): Observable<Movie[] | null> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete<Movie[] | null>(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    public get favourites(): Observable<Movie[] | null> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.get<{ _id: string, favourites: Movie[] }>(`${environment.apiUrl}users/${username}/favourites`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(map((favourites: { _id: string, favourites: Movie[] | null }) => favourites.favourites));
    }

    public get movies(): Observable<Movie[]> {
        const token = localStorage.getItem('token');
        return this.http.get<Movie[]>(`${environment.apiUrl}movies`, {
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
