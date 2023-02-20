import { join } from 'path';
import { writeFileSync } from 'fs';
import { logger } from '@/structs/Logger';
import swaggerJsdoc from 'swagger-jsdoc';

import * as paths from '@/util/paths';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Watch Together',
      version: '0.1.0',
    },
  },
  apis: [join(paths.CONTROLLERS, '**/*.ts')],
};

writeFileSync(paths.OPENAPI, JSON.stringify(swaggerJsdoc(options), null, 2));

logger.success('generated openapi specifications', { title: 'OPENAPI' });
