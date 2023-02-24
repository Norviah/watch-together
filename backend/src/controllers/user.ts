import { Auth } from '@/structs/Auth';
import { logger } from '@/structs/Logger';
import { client } from '@/util/client';
import { compare, hashSync } from 'bcryptjs';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { User } from '@prisma/client';
import type { Request, Response } from 'express';

export const router: Router = Router();

/**
 * The `/user/signup` endpoint.
 *
 * This endpoint is responsible for creating a new user within the database. The
 * endpoint attempts to do so, ensuring that the user does not already exist.
 * @openapi
 * /user/signup:
 *   post:
 *     summary: New user
 *     description: Create a new user within the database.
 *     tags:
 *       - user
 *     requestBody:
 *       description: The user to create.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
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
  const user: User = await client.user.create({
    data: { ...request.body, password: hashSync(request.body.password) },
  });

  logger.success(`created user: ${user.email} ${user.id}`, { title: 'user/signup', subDir: 'user/signup' });

  // Once the user has been created, we'll return a `200` status code to
  // indicate that the user was created successfully. We don't need to catch any
  // exceptions here, as we have a global error handler that will catch any
  // errors that occur within the application.
  return response.status(StatusCodes.OK).json({ message: 'The specified user was created.' });
});

/**
 * The `/user/signup` endpoint.
 *
 * This endpoint is responsible for authenticating a user for the web
 * application. The web application will use this endpoint to retrieve an
 * authentication and refresh token for the user.
 * @openapi
 * /user/signin:
 *   get:
 *     summary: Authenticate user
 *     description: Retrieve an authentication and refresh token for the user.
 *     tags:
 *       - user
 *     requestBody:
 *       description: Information of the desired user to authenticate.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: The specified user was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: string
 *                   description: The access token for the user.
 *                 refresh:
 *                   type: string
 *                   description: The refresh token for the user.
 *       401:
 *         description: The provided credentials are invalid.
 *       500:
 *         description: An internal error has occurred.
 */
router.get('/signin', async (request: Request<unknown, unknown, { email: string; password: string }>, response: Response) => {
  // First, we'll need to ensure that the user exists within the database. As
  // the `User` model has a unique constraint on the `email` field, we can use
  // this property to find the desired user.
  const user: User | null = await client.user.findUnique({
    where: {
      email: request.body.email,
    },
  });

  // If the user does not exist within the database, we'll return a generic
  // `Forbidden` status code to indicate that the desired user does not exist
  // within the database.
  if (!user) {
    return response.status(StatusCodes.UNAUTHORIZED);
  }

  // Now that we have a reference to the user, we can compare the provided
  // password with the password stored within the database. `bcrypt` was
  // implemented to hash the password during creation, so we'll use it to
  // compare the provided password against the stored password.
  const authorized: boolean = await compare(request.body.password, user.password);

  if (!authorized) {
    return response.status(StatusCodes.UNAUTHORIZED);
  }

  // If the user was authorized, we can then generate an access and refresh
  // token for the user. The `Auth` class is responsible for generating these
  // tokens.
  return response.status(StatusCodes.OK).json({ access: Auth.Generate(user, Auth.DURATION.ACCESS), refresh: Auth.Generate(user, Auth.DURATION.REFRESH) });
});

/**
 * The `/user/refresh` endpoint.
 *
 * This endpoint is responsible for refreshing an access token for the user,
 * referenced by the provided refresh token.
 * @openapi
 * /user/validate:
 *   get:
 *     summary: Refresh an access token
 *     description: Returns a new access token for the user.
 *     tags:
 *       - user
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh:
 *                 type: string
 *                 description: The refresh token for the user.
 *     responses:
 *       200:
 *         description: A new access token was generated for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: string
 *                   description: The access token for the user.
 *       401:
 *         description: The provided refresh token is invalid.
 *       500:
 *         description: An internal error has occurred.
 */
router.get('/refresh', async (request: Request<unknown, unknown, { refresh: string }>, response: Response) => {
  // In order to refresh an access token, we'll need to ensure that the refresh
  // token is valid. The `Auth` class is responsible for validating tokens via
  // the `Auth.Verify` method.
  const user: User | null = await Auth.Verify(request.body.refresh);

  // If the token is invalid, that means that the user will need to
  // re-authenticate with the web application. We'll return a `401` status code
  // to indicate that the user is not authorized.
  if (!user) {
    return response.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  // If the refresh token is valid, we can then generate a new access token for
  // the user. The `Auth` class is responsible for generating these tokens.
  return response.status(StatusCodes.OK).json({ access: Auth.Generate(user, Auth.DURATION.ACCESS) });
});
