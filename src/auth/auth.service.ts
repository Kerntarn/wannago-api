import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { PlansService } from 'src/plans/plans.service';
import { GuestService } from 'src/guest/guest.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private plansService: PlansService,
    private guestService: GuestService,
  ) {}

  async createGuestToken(): Promise<{ message: string; token: string }> {
    const guest = await this.guestService.createGuest();
    const payload = { guestId: guest.guestId };
    const token = this.jwtService.sign(payload);
    return { message: 'Guest token generated successfully', token };
  }

  async register(registerDto: RegisterDto) {
    const { planId, guestToken, ...rest } = registerDto;
    if (rest.profileImage === '') {
      rest.profileImage =
        'https://www.slashfilm.com/img/gallery/demon-slayer-season-2-tanjiro-declines-a-friend-request-as-things-come-to-a-head/intro-1644195796.jpg';
    }
    const user = await this.usersService.create(rest);

    if (planId) {
      await this.plansService.assignPlanToUser(planId, user._id.toString());
    }

    if (guestToken) {
      const decodedToken = this.jwtService.decode(guestToken);
      const guestId = decodedToken['guestId'];
      if (guestId) {
        const guest = await this.guestService.findGuest(guestId);
        if (guest && guest.planIds.length > 0) {
          for (const planObjectId of guest.planIds) {
            await this.plansService.assignPlanToUser(
              planObjectId.toString(),
              user._id.toString(),
            );
          }
        }
      }
      await this.guestService.deleteGuest(guestId);
    }

    return {
      message: 'User registered successfully',
      user: {
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; token: string }> {
    const { planId, guestToken, ...rest } = loginDto;
    const user = await this.usersService.findByEmail(rest.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    console.log(user);
    const isPasswordValid = await bcrypt.compare(rest.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (planId) {
      // Fallback for old planId system
      await this.plansService.assignPlanToUser(planId, user._id.toString());
    }

    if (guestToken) {
      const decodedToken = this.jwtService.decode(guestToken);
      const guestId = decodedToken['guestId'];
      if (guestId) {
        const guest = await this.guestService.findGuest(guestId);
        if (guest && guest.planIds.length > 0) {
          for (const planObjectId of guest.planIds) {
            await this.plansService.assignPlanToUser(
              planObjectId.toString(),
              user._id.toString(),
            );
          }
        }
        // Optionally delete guest record after plans are transferred
        await this.guestService.deleteGuest(guestId);
      }
    }

    const payload = {
      sub: user._id,
      email: user.email,
      username: user.userName,
    };
    const token = this.jwtService.sign(payload);
    return { message: 'Login successful', token };
  }
}
