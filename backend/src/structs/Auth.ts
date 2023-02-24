import { client } from '@/structs/Database';
import { StatusCodes } from 'http-status-codes';
import { sign, verify } from 'jsonwebtoken';

import type { UserPayload } from '@/types/UserPayload';
import type { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

export class Auth {
  /**
   * The desired duration of tokens.
   */
  public static DURATION = { ACCESS: '30m', REFRESH: '7d' };

  /**
   * Generates an authentication token for the specified user.
   *
   * Access tokens are used as an alternative way of authenticating a user. The
   * frontend will store the token and send it with each request, allowing the
   * backend to verify the user's identity without the frontend having to ask
   * for a password each time.
   *
   * The `jsonwebtoken` library is used to generate the token, which takes three
   * values:
   * - a secret string, which is used to sign the token
   * - a payload, which is the data that is stored within the token
   * - an options object, which specifies various options for the token
   *
   * When we generate a token, we'll set the payload to the `UserPayload` type,
   * allowing us access to important information about the user when decoding
   * the token.
   * @param user The user to generate a token for.
   * @param duration The duration of the token.
   * @returns The generated token.
   */
  public static Generate(user: User, duration: string): string {
    return sign({ id: user.id } as UserPayload, process.env.JWT_SECRET_KEY!, { expiresIn: duration });
  }

  /**
   * Verifies the specified token.
   *
   * When a user sends a request to the backend, we'll need to verify that the
   * provided token is valid. `Verify` will ensure that the token is valid,
   * returning the user associated with the token if it is.
   * @param token The token to verify.
   * @returns The user associated with the token.
   */
  public static async Verify(token: string): Promise<User | null> {
    // The `jsonwebtoken` library provides a `verify` function, which takes a
    // token and the secret string used to sign the token, returning the payload
    // of the token if it is valid.

    // In `Auth.Generate`, the payload of the token was set to the `UserPayload`
    // type, thus, we'll assign the type of the decoded result to the type.
    let result: UserPayload;

    // As the `verify` function can throw an error, we'll wrap it in a `try`
    // block, returning `null` if the token is invalid.
    try {
      result = verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;
    } catch {
      return null;
    }

    // Once the payload has been decoded, `result` will be an object referencing
    // important information about the user, as specified in `UserPayload`. With
    // this information, we can attempt to find the user within the database.
    const user: User | null = await client.user.findUnique({
      where: {
        id: result.id,
      },
    });

    return user ? user : null;
  }

  /**
   * Authenticates the specified request.
   *
   * The authenticate middleware, `Authenticate` is used as a middleware for
   * routes that require authentication. This method will verify that the
   * specified access token is valid, returning a `401` error if it is not.
   * @param request The request to authenticate.
   * @param response The response to send.
   * @param next The next middleware to call.
   */
  public static async Authenticate(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    // First, we need to extract the access token from the request. The access
    // token is stored within the `Authorization` header, which is formatted as
    // a `Bearer` token. As such, we'll need to split the header by spaces, and
    // take the second value, which will be the token.
    const token: string | undefined = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return response.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Once we have the token, we can attempt to verify it, this logic is
    // implemented via the `Auth.Verify` method. If the token is valid, the
    // method will return the user's model within the database.
    const user: User | null = await Auth.Verify(token);

    // If `null` is returned, that represents that the token is invalid, thus,
    // we'll return a `401` error.
    if (!user) {
      return response.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // If the token is valid, we'll set the `user` property of the request to
    // the user's model, allowing the endpoint of easy access to the user's
    // model without having to repeatedly query the database.
    request.user = user;

    // Now that the request has been authenticated, we can call the next
    // middleware.
    return next();
  }
}
