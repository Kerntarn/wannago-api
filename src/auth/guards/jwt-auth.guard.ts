import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'guest-jwt']) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try user-jwt first
      const canActivateUser = await super.canActivate(context);
      if (canActivateUser) {
        return true;
      }
    } catch (err) {
      // Ignore and try the next strategy
    }

    try {
      // If user-jwt failed, try guest-jwt next
      const request = context.switchToHttp().getRequest();
      const guestAuthGuard = new (AuthGuard('guest-jwt'))();
      const canActivateGuest = await guestAuthGuard.canActivate(context);
      if (canActivateGuest) {
        return true;
      }
    } catch (err) {
      // Both failed, throw an error
    }

    throw new UnauthorizedException('Invalid or missing token');
  }

  // Optional: merge request.user across strategies
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}