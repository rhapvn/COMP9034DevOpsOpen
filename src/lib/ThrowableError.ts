export class ThrowableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Error";
    }
}