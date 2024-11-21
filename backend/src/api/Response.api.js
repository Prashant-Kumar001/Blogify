// responseHandler.js

export default class ResponseHandler {
  /**
   * Success response (default: 200 OK)
   */
  static success(res, data = {}, message = 'Request was successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
    });
  }

  /**
   * Resource created response (default: 201 Created)
   */
  static created(res, data = {}, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
    });
  }

  /**
   * Bad request response (default: 400 Bad Request)
   */
  static badRequest(res, message = 'Bad request', errors = [], error = null) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      errors,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
      error: error && typeof error === 'string' ? error : null, // Ensures error is either a string or null
    });
  }

  /**
   * Unauthorized response (default: 401 Unauthorized)
   */
  static unauthorized(res, message = 'Unauthorized access', error = null) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
      error: error && typeof error === 'string' ? error : null, // Ensures error is either a string or null
    });
  }

  /**
   * Not found response (default: 404 Not Found)
   */
  static notFound(res, message = 'Resource not found', error = null) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
      error: error && typeof error === 'string' ? error : null, // Ensures error is either a string or null
    });
  }

  /**
   * Forbidden response (default: 403 Forbidden)
   */
  static forbidden(res, message = 'Forbidden access', error = null) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
      error: error && typeof error === 'string' ? error : null, // Ensures error is either a string or null
    });
  }

  /**
   * Server error response (default: 500 Internal Server Error)
   */
  static serverError(res, message = 'Internal server error', error = null) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message,
      error: error && typeof error === 'string' ? error : null, // Ensures error is either a string or null
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: typeof res.locals.requestId === 'string' ? res.locals.requestId : null,
      },
    });
  }
}
