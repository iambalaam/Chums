export const isError = (err: any): err is Error => {
    return err && err.name && err.message && err.stack;
};

export class UserFacingError extends Error {
    constructor(message: string, public description: string, public stack: string, public help?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}