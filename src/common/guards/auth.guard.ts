import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Token bormi?
    const { token } = request.headers;
    if (!token) {
      throw new UnauthorizedException('Token topilmadi');
    }

    try {
      request.user = await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException("Token yaroqsiz yoki muddati o'tgan");
    }

    
    return true;
  }
}
