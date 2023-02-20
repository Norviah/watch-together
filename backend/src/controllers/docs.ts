import { Router } from 'express';
import { OPENAPI } from '@/util/paths';
import redoc from 'redoc-express';

import type { Request, Response } from 'express';

export const router: Router = Router();

/**
 * @openapi
 * /docs/swagger.json:
 *   get:
 *     summary: The OpenAPI specification.
 *     description: Get the OpenAPI specification.
 *     responses:
 *       200:
 *         description: The OpenAPI specification.
 *       500:
 *         description: An internal error has occurred.
 */
router.get('/swagger.json', (request: Request, response: Response) => {
  response.json(require(OPENAPI));
});

router.get('/', redoc({ title: 'API Docs', specUrl: '/docs/swagger.json' }));
