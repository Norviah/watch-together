import type { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      /**
       * The user that is currently authenticated.
       *
       * If accesssed within an endpoint that requires authentication, this
       * property will represent the `User` entry of the authenticated user.
       */
      user?: User | null;
    }
  }
}
