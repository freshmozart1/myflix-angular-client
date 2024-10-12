import { Director } from "./director.model";
import { Genre } from "./genre.model";

export interface Movie {
    __v: number;
    _id: string;
    description: string;
    director: Director;
    genre: Genre;
    imagePath: string;
    thumbnailPath: string;
    title: string;
}