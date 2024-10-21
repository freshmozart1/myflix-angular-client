/** this interface represents a movie director object */
export interface Director {
    /** @ignore */
    __v: number;
    /** Director ID */
    _id: string;
    /** Director biography */
    biography: string;
    /** Director birthday */
    birthday: string;
    /** Director deathday. Must be null, if director is still alive */
    deathday: string | null;
    /** Director name */
    name: string;
}