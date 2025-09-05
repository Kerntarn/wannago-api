// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ดึง token จาก header
      ignoreExpiration: false, // ให้ตรวจสอบ expire ด้วย
      secretOrKey: process.env.JWT_SECRET || 'mysecret', // key ที่ใช้เซ็น token
    });
  }

  async validate(payload: any) {
    // payload = ข้อมูลใน token เช่น { sub: userId, email: '...' }
    return { userId: payload.sub, email: payload.email };
    // ค่านี้จะถูกผูกกับ request.user ใน controller
  }
}
