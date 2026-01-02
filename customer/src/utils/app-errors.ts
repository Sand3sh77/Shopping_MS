import type { AppErrorOptions, StatusCode } from "./types";

export const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
} as const;

export class AppError extends Error {
    public readonly statusCode: StatusCode;
    public readonly isOperational: boolean;
    public readonly errorStack?: unknown;
    public readonly logError?: boolean;

    constructor(
        name: string,
        message: string,
        {
            statusCode,
            isOperational = true,
            errorStack,
            logError,
        }: AppErrorOptions
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = logError;

        Error.captureStackTrace(this);
    }
}

// API SPECIFIC ERRORS

// 500
export class APIError extends AppError {
    constructor(
        message = "Internal Server Error"
    ) {
        super("API_ERROR", message, {
            statusCode: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}

// 400
export class BadRequestError extends AppError {
    constructor(
        message = "Bad Request",
        logError = false
    ) {
        super("BAD_REQUEST", message, {
            statusCode: STATUS_CODES.BAD_REQUEST,
            logError,
        });
    }
}

// 400
export class ValidationError extends AppError {
    constructor(
        message = "Validation Error",
        errorStack?: unknown
    ) {
        super("VALIDATION_ERROR", message, {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errorStack,
        });
    }
}

// 404
export class NotFoundError extends AppError {
    constructor(
        message = "Not Found"
    ) {
        super("NOT_FOUND", message, {
            statusCode: STATUS_CODES.NOT_FOUND,
        });
    }
}
