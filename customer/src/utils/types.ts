import { STATUS_CODES } from "./app-errors";

export type StatusCode =
    (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

export interface AppErrorOptions {
    statusCode: StatusCode;
    isOperational?: boolean;
    errorStack?: unknown;
    logError?: boolean;
}