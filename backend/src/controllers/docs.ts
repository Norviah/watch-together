import { Router } from 'express';
import { OPENAPI } from '@/util/paths';
import redoc from 'redoc-express';

import type { Request, Response } from 'express';

export const router: Router = Router();

router.get('/swagger.json', (request: Request, response: Response) => {
  response.json(require(OPENAPI));
});

router.get('/', redoc({ title: 'API Docs', specUrl: '/docs/swagger.json' }));
