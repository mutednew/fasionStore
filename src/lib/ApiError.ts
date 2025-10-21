export class ApiError extends Error {
    public status: number;
    public details?: any;

    constructor(message: string, status: number, details?: any) {
        super(message);

        this.status = status;
        this.details = details;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}