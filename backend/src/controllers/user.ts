import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { client } from '@/util/client';
import { hashSync } from 'bcryptjs';

import type { Request, Response } from 'express';
import type { User } from '@prisma/client';

export const router: Router = Router();

/**
 * The `/user/signup` endpoint.
 *
 * This endpoint is responsible for creating a new user within the database. The
 * endpoint attempts to do so, ensuring that the user does not already exist.
 * @openapi
 * /user/signup:
 *   post:
 *     description: Create a new user.
 *     tags:
 *       - user
 *     requestBody:
 *       description: The user to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 required: true
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 required: true
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 required: true
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 required: true
 *     responses:
 *       200:
 *         description: The specified user was created.
 *       409:
 *         description: The specified user already exists.
 *       500:
 *         description: An internal error has occurred, the specified user was
 *                      not created.
 */
router.post('/signup', async (request: Request<unknown, unknown, { email: string; password: string; firstName: string; lastName: string }>, response: Response) => {
  // The `user/signup` endpoint, this endpoint implements the logic for creating
  // a new user within the database, referencing information from the request
  // body.

  // First, we'll need to ensure that the user does not already exist within the
  // database. The `User` model has a unique contstraint on the `email` field,
  // meaning that we can use this property to find a user within the database.
  const exists: User | null = await client.user.findUnique({
    where: {
      email: request.body.email,
    },
  });

  // Prisma will return `null` if an entry does not exist within the database,
  // meaning if `null` was not returned, the user already exists within the
  // database. We'll return a `409` status code to indicate that the user
  // already exists.
  if (exists) {
    return response.status(StatusCodes.CONFLICT).json({ message: 'The specified user already exists.' });
  }

  // If the user does not exist within the database, we can create a new user
  // within the database with the provided information.
  await client.user.create({ data: { ...request.body, password: hashSync(request.body.password) } });

  // Once the user has been created, we'll return a `200` status code to
  // indicate that the user was created successfully. We don't need to catch any
  // exceptions here, as we have a global error handler that will catch any
  // errors that occur within the application.
  return response.status(StatusCodes.OK).json({ message: 'The specified user was created.' });
});
