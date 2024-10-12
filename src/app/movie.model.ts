export interface Movie {
    __v: number;
    _id: string;
    description: string;
    director: {
        __v: number;
        _id: string;
        biography: string;
        birthday: string;
        deathday: string | null;
        name: string;
    };
    genre: {
        __v: number;
        _id: string;
        description: string;
        name: string;
    };
    imagePath: string;
    thumbnailPath: string;
    title: string;
}