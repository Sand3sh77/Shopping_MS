import type { Request, Response, NextFunction } from "express";
import winston from "winston";
import { AppError } from "./app-errors";

// LOGGER SETUP

const { createLogger, transports, format } = winston;

const LogErrors = createLogger({
    level: "error",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "app_error.log" }),
    ],
});

// ERROR LOGGER CLASS

class ErrorLogger {
    async logError(error: Error): Promise<boolean> {
        console.log("=========== Start Error Logger ===========");

        LogErrors.error({
            private: true,
            message: error.message,
            stack: error.stack,
            name: error.name,
        });

        console.log("=========== End Error Logger =============");
        return false;
    }

    isTrustedError(error: unknown): boolean {
        if (error instanceof AppError) {
            return error.isOperational;
        }
        return false;
    }
}

// PROCESS LEVEL HANDLERS

const errorLogger = new ErrorLogger();

// uncaught exceptions
process.on("uncaughtException", async (error: Error) => {
    await errorLogger.logError(error);

    if (!errorLogger.isTrustedError(error)) {
        // graceful shutdown recommended
        process.exit(1);
    }
});

// unhandled promise rejections
process.on("unhandledRejection", async (reason: unknown) => {
    const error =
        reason instanceof Error
            ? reason
            : new Error(`Unhandled Rejection: ${String(reason)}`);

    await errorLogger.logError(error);
    process.exit(1);
});

// EXPRESS ERROR MIDDLEWARE

const ErrorHandler = async (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Promise<Response> => {
    await errorLogger.logError(err);

    // Known / operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.errorStack ?? err.message,
        });
    }

    // Unknown errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default ErrorHandler;
