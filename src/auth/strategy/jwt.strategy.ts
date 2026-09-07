import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../modules/organization/user/user.service';
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }
   async validate(payload: JwtPayload) {
    let user;
    try {
      user = await this.usersService.findOne(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('User no longer exists');
    }
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User no longer exists or is inactive');
    }
    const { password, ...safeUser } = user as any;
    return safeUser;
  }
}
