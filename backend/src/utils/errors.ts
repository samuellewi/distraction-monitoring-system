export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown) {
  return new ApiError(400, message, details);
}

export function unauthorized(message = "Authentication is required.") {
  return new ApiError(401, message);
}

export function forbidden(message = "You do not have access to this resource.") {
  return new ApiError(403, message);
}

export function notFound(message = "Resource not found.") {
  return new ApiError(404, message);
}

export function conflict(message: string) {
  return new ApiError(409, message);
}
