export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors: Record<string, string[]>) {
    super(message, 422, errors, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, 400, undefined, 'BAD_REQUEST')
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, undefined, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, undefined, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, undefined, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(message, 409, undefined, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export class GoneError extends ApiError {
  constructor(message = 'Resource no longer available') {
    super(message, 410, undefined, 'GONE')
    this.name = 'GoneError'
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429, undefined, 'TOO_MANY_REQUESTS')
    this.name = 'TooManyRequestsError'
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500, undefined, 'SERVER_ERROR')
    this.name = 'ServerError'
  }
}

export class NotImplementedError extends ApiError {
  constructor(message = 'Not implemented') {
    super(message, 501, undefined, 'NOT_IMPLEMENTED')
    this.name = 'NotImplementedError'
  }
}

export class BadGatewayError extends ApiError {
  constructor(message = 'Bad gateway') {
    super(message, 502, undefined, 'BAD_GATEWAY')
    this.name = 'BadGatewayError'
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message = 'Service unavailable') {
    super(message, 503, undefined, 'SERVICE_UNAVAILABLE')
    this.name = 'ServiceUnavailableError'
  }
}

export class GatewayTimeoutError extends ApiError {
  constructor(message = 'Gateway timeout') {
    super(message, 504, undefined, 'GATEWAY_TIMEOUT')
    this.name = 'GatewayTimeoutError'
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token expired') {
    super(message, 401, undefined, 'TOKEN_EXPIRED')
    this.name = 'TokenExpiredError'
  }
}

export class InvalidTokenError extends ApiError {
  constructor(message = 'Invalid token') {
    super(message, 401, undefined, 'INVALID_TOKEN')
    this.name = 'InvalidTokenError'
  }
}

export class PermissionDeniedError extends ApiError {
  constructor(message = 'Permission denied') {
    super(message, 403, undefined, 'PERMISSION_DENIED')
    this.name = 'PermissionDeniedError'
  }
}

export class RateLimitExceededError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, undefined, 'RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitExceededError'
  }
}