/**
 * API Error Types and Utilities
 * Centralized error handling with user-friendly messages
 */

export enum APIErrorType {
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",
    SERVER_ERROR = "SERVER_ERROR",
    NOT_FOUND = "NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNKNOWN = "UNKNOWN",
}

export interface APIError {
    type: APIErrorType;
    title: string;
    message: string;
    action: string;
    technical?: string;
}

export const ERROR_MESSAGES: Record<APIErrorType, Omit<APIError, "type" | "technical">> = {
    [APIErrorType.NETWORK_ERROR]: {
        title: "Connection Lost",
        message: "Please check your internet connection and try again.",
        action: "Retry",
    },
    [APIErrorType.TIMEOUT]: {
        title: "Request Timed Out",
        message: "The server is taking too long to respond. Please try again.",
        action: "Try Again",
    },
    [APIErrorType.SERVER_ERROR]: {
        title: "Server Error",
        message: "Something went wrong on our end. Our team has been notified.",
        action: "Retry",
    },
    [APIErrorType.NOT_FOUND]: {
        title: "Not Found",
        message: "This item may no longer be available.",
        action: "Browse Products",
    },
    [APIErrorType.UNAUTHORIZED]: {
        title: "Session Expired",
        message: "Please refresh the page to continue.",
        action: "Reload",
    },
    [APIErrorType.VALIDATION_ERROR]: {
        title: "Invalid Request",
        message: "The information provided is invalid. Please check and try again.",
        action: "Close",
    },
    [APIErrorType.UNKNOWN]: {
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please try again.",
        action: "Retry",
    },
};

export function createAPIError(type: APIErrorType, technicalMessage?: string): APIError {
    return {
        type,
        ...ERROR_MESSAGES[type],
        technical: technicalMessage,
    };
}

export function classifyError(error: any): APIError {
    // Network errors
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
        return createAPIError(APIErrorType.NETWORK_ERROR, error.message);
    }

    // Timeout errors
    if (error.message?.includes("timeout")) {
        return createAPIError(APIErrorType.TIMEOUT, error.message);
    }

    // HTTP status codes
    if (error.status === 404 || error.statusCode === 404) {
        return createAPIError(APIErrorType.NOT_FOUND, error.message);
    }

    if (error.status === 401 || error.statusCode === 401) {
        return createAPIError(APIErrorType.UNAUTHORIZED, error.message);
    }

    if (error.status === 400 || error.statusCode === 400) {
        return createAPIError(APIErrorType.VALIDATION_ERROR, error.message);
    }

    if (error.status >= 500 || error.statusCode >= 500) {
        return createAPIError(APIErrorType.SERVER_ERROR, error.message);
    }

    // Default
    return createAPIError(APIErrorType.UNKNOWN, error.message);
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error("Retry failed");
}
