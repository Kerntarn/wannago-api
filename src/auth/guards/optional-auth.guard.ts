import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Try to authenticate using either 'jwt' or 'guest-jwt' strategies.
 * Do not throw when no credentials are provided — just leave request.user null.
 */
@Injectable()
export class OptionalAuthGuard extends AuthGuard(['jwt', 'guest-jwt']) {
  // Override to prevent throwing when no user is present.
  handleRequest(err: any, user: any, info: any) {
    // If there's an error, let Passport/Nest handle it normally
    if (err) {
      throw err;
    }
    // Return user or null (do not throw Unauthorized)
    return user || null;
  }
}
