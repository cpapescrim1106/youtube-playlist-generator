export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR')
  }
}

export class ExternalAPIError extends AppError {
  constructor(
    message: string,
    public service: string,
    public originalError?: any
  ) {
    super(message, 503, 'EXTERNAL_API_ERROR')
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError('An unexpected error occurred')
}

export function createErrorResponse(error: AppError) {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    },
  }
}

// YouTube API specific errors
export function handleYouTubeError(error: any): AppError {
  const message = error.response?.data?.error?.message || error.message || 'YouTube API error'
  const code = error.response?.status || 503

  if (code === 403 && message.includes('quota')) {
    return new RateLimitError('YouTube API quota exceeded. Please try again later.')
  }

  if (code === 401) {
    return new AuthenticationError('YouTube authentication failed. Please sign in again.')
  }

  return new ExternalAPIError(message, 'YouTube', error)
}

// OpenAI API specific errors
export function handleOpenAIError(error: any): AppError {
  const message = error.response?.data?.error?.message || error.message || 'OpenAI API error'
  const code = error.response?.status || 503

  if (code === 429) {
    return new RateLimitError('OpenAI API rate limit exceeded. Using fallback title.')
  }

  if (code === 401) {
    return new AuthenticationError('OpenAI API key is invalid.')
  }

  return new ExternalAPIError(message, 'OpenAI', error)
}