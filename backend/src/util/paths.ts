import { path } from 'app-root-path';
import { join } from 'path';

/**
 * The absolute path to the project's root directory.
 */
export const ROOT: string = path;

/**
 * The absolute path to the directory containing the source code.
 */
export const SRC: string = join(ROOT, 'src');

/**
 * The absolute path to the directory containing the database.
 */
export const DATABASE: string = join(ROOT, 'database');

/**
 * The absolute path to the directory containing system logs.
 */
export const LOGS: string = join(ROOT, 'logs');

/**
 * The absolute path to the directory containing the endpoints for the API.
 */
export const CONTROLLERS: string = join(SRC, 'controllers');

/**
 * The absolute path to the file referencing the OpenAPI specification for the
 * API endpoints.
 */
export const OPENAPI: string = join(ROOT, 'openapi.json');
