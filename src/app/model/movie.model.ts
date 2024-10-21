import { Director } from "./director.model";
import { Genre } from "./genre.model";

/**
 * This interface represents a movie object.
 */
export interface Movie {
    /** @ignore */
    __v: number;
    /** Movie ID */
    _id: string;
    /** Movie description */
    description: string;
    /** Movie director object */
    director: Director;
    /** Movie genre object */
    genre: Genre;
    /** AWS S3 bucket path to movie poster */
    imagePath: string;
    /** AWS S3 bucket path to movie thumbnail */
    thumbnailPath: string;
    /** Movie title */
    title: string;
}