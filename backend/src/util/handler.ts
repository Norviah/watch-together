import { logger } from '@/structs/Logger';
import { StatusCodes } from 'http-status-codes';

import type { Request, Response, NextFunction } from 'express';

/**
 * The global error handler.
 *
 * `handler` is a middleware which is called when an error is thrown during the
 * execution of a route handler or middleware. It is responsible for logging the
 * error and sending a response to the client.
 * @param error The error that was thrown.
 * @param request The request object.
 * @param response The response object.
 * @param next The next middleware function.
 */
export function handler(error: Error | string | any, request: Request, response: Response, next: NextFunction): any {
  logger.error(error instanceof Error ? error.message : error, { subDir: `endpoint${request.originalUrl.split('?').shift()}` });

  if (!response.headersSent) {
    return response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
