import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PlansModule } from 'src/plans/plans.module';
import { GuestModule } from 'src/guest/guest.module';
import { GuestAuthStrategy } from './strategies/guest-auth.strategy';

@Module({
  imports: [
    UsersModule,
    PlansModule,
    GuestModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, GuestAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
