import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IgnoreJwtAuthInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ignoreAuth = this.reflector.get<boolean>(
      'ignoreAuth',
      context.getHandler(),
    );

    if (ignoreAuth) {
      // Remove the Authorization header for specified routes
      delete request.headers['authorization'];
    }

    return next.handle();
  }
}
