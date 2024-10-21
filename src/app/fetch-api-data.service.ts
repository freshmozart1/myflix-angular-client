import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Movie } from './model/movie.model';
import { Director } from './model/director.model';
import { Genre } from './model/genre.model';

/**
 * This service contains methods to make HTTP requests to the API.
 */

@Injectable({
    providedIn: 'root'
})
export class FetchApiDataService {

    /**
     * @param http Angular HttpClient to make HTTP requests.
     */
    constructor(
        private http: HttpClient
    ) { }

    /**
     * Registers a new user.
     * @param userDetails The details of the user to register.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public userRegistration(userDetails: any): Observable<any> {
        return this.http.post(environment.apiUrl + 'users', userDetails);
    }

    /**
     * Logs in a user.
     * @param userData The username and password of the user.
     * @param userData.username The username of the user.
     * @param userData.password The password of the user.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public userLogin(userData: { username: string, password: string }): Observable<any> {
        return this.http.post(`${environment.apiUrl}login?username=${userData.username}&password=${userData.password}`, {});
    }

    /**
     * Deletes the current user.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public deleteUser(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(`${environment.apiUrl}users/${username}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Updates the current user's details.
     * @param userData A object containing the new user data
     * @param userData.username Optional The new username of the user.
     * @param userData.password OptionalThe new password of the user.
     * @param userData.email Optional The new email of the user.
     * @param userData.birthday Optional The new birthday of the user.
     * @param userData.favourites Optional The new list of favourite movies of the user.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public patchUser(userData: { username?: string, password?: string, email?: string, birthday?: string, favourites?: string[] }): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.patch(`${environment.apiUrl}users/${username}`, userData, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Retrieves the details of a user.
     * @param username The username of the user to retrieve.
     * @returns 
     */
    public getUser(username: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/${username}`);
    }

    /**
     * Adds a movie to the user's list of favourites.
     * @param movieId Id of the movie to add to favourites
     * @returns {Observable<Movie[]>} An observable containing the updated list of favourite movies.
     */
    public addFavourite(movieId: string): Observable<Movie[]> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.post<Movie[]>(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {}, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Removes a movie from the user's list of favourites.
     * @param movieId Id of the movie to remove from favourites
     * @returns {Observable<Movie[] | null>} An observable containing the updated list of favourite movies or null if the list is empty.
     */
    public deleteFavourite(movieId: string): Observable<Movie[] | null> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete<Movie[] | null>(`${environment.apiUrl}users/${username}/favourites/${movieId}`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Retrieves the user's list of favourite movies.
     * @returns {Observable<Movie[] | null>} An observable containing the list of favourite movies or null if the list is empty.
     */
    public get favourites(): Observable<Movie[] | null> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.get<{ _id: string, favourites: Movie[] }>(`${environment.apiUrl}users/${username}/favourites`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        }).pipe(map((favourites: { _id: string, favourites: Movie[] | null }) => favourites.favourites));
    }

    /**
     * Retrieves the list of all movies.
     * @returns {Observable<Movie[]>} An observable containing the list of movies.
     */
    public get movies(): Observable<Movie[]> {
        const token = localStorage.getItem('token');
        return this.http.get<Movie[]>(`${environment.apiUrl}movies`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Retrieves the details of a specific movie.
     * @param title The title of the movie to retrieve.
     * @returns {Observable<Movie>} An observable containing the movie's details.
     */
    public getMovie(title: string): Observable<Movie> {
        return this.http.get<Movie>(`${environment.apiUrl}movies/${encodeURIComponent(title)}`);
    }

    /**
     * Posts a new movie to the API
     * @param movie Movie object to post
     * @param movie.title The title of the movie.
     * @param movie.description The description of the movie.
     * @param movie.genre The genre of the movie.
     * @param movie.director The director of the movie.
     * @param movie.image The image of the movie.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public postMovie(movie: { title: string, description: string, genre: string, director: string, image: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}movies`, movie, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Gets a list of directors from the API
     * @param limit Optional The number of directors to retrieve
     * @returns {Observable<Director[]>} An observable containing the list of directors.
     */
    public getDirectors(limit?: number): Observable<Director[]> {
        return this.http.get<Director[]>(`${environment.apiUrl}directors/${limit ? `?limit=${limit}` : ''}`);
    }

    /**
     * Retrieves the details of a specific director.
     * @param name The name of the director to retrieve.
     * @returns {Observable<Director>} An observable containing the director's details.
     */
    public getDirector(name: string): Observable<Director> {
        return this.http.get<Director>(`${environment.apiUrl}directors/${encodeURIComponent(name)}`);
    }

    /**
     * Posts a new director to the API
     * @param director The director object to post
     * @param director.name The name of the director.
     * @param director.biography The biography of the director.
     * @param director.birthday The birthday of the director.
     * @param director.deathday Optional The deathday of the director.
     * @returns {Observable<any>} An observable containing the response from the API.
     */
    public postDirector(director: { name: string, biography: string, birthday: string, deathday?: string }): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${environment.apiUrl}directors`, director, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        });
    }

    /**
     * Retrieves the list of genres from the API
     * @param limit Optional The number of genres to retrieve
     * @returns {Observable<Genre[]>} An observable containing the list of genres.
     */
    public getGenres(limit?: number): Observable<Genre[]> {
        return this.http.get<Genre[]>(`${environment.apiUrl}genres/${limit ? `?limit=${limit}` : ''}`);
    }

    /**
     * Retrieves the details of a specific genre.
     * @param name The name of the genre to retrieve.
     * @returns {Observable<Genre>} An observable containing the genre's details.
     */
    public getGenre(name: string): Observable<Genre> {
        return this.http.get<Genre>(`${environment.apiUrl}genres/${encodeURIComponent(name)}`);
    }
}
