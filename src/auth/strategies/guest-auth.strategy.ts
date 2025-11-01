import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { GuestService } from 'src/guest/guest.service';

@Injectable()
export class GuestAuthStrategy extends PassportStrategy(Strategy, 'guest-jwt') {
  constructor(
    private configService: ConfigService,
    private guestService: GuestService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const guest = await this.guestService.findGuest(payload.guestId);
    if (!guest) {
      throw new UnauthorizedException();
    }
    return guest;
  }
}
