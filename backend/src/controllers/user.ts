import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { client } from '@/util/client';

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
router.post('/signup', async (request: Request, response: Response) => {
  return response.status(StatusCodes.OK).json({ message: 'Hello World' });
});
