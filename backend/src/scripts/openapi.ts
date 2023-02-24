import { join } from 'path';
import { writeFileSync } from 'fs';
import { logger } from '@/structs/Logger';
import swaggerJsdoc from 'swagger-jsdoc';

import type { Options } from 'swagger-jsdoc';

import * as paths from '@/util/paths';

const options: Options = {
  failOnErrors: true,

  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Watch Together',
      version: '0.1.0',
      license: {
        name: 'MIT',
        url: 'https://raw.githubusercontent.com/Norviah/watch-together/master/LICENSE',
      },
    },
    'x-tagGroups': [
      {
        name: 'User Management',
        tags: ['user'],
      },
    ],
    tags: [{ name: 'user', description: 'Operations related to a user.' }],
  },

  apis: [join(paths.CONTROLLERS, '**/*.ts')],
};

writeFileSync(paths.OPENAPI, JSON.stringify(swaggerJsdoc(options), null, 2));

logger.success('generated openapi specifications', { title: 'OPENAPI' });
