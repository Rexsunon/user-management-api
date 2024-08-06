import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from '../config';

@Injectable()
export class HttpLogInterceptor implements NestInterceptor {
  constructor(private logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const clientIp = request.ip || request.connection.remoteAddress;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const contentLength = response.get('content-length');

          this.logger.log(
            `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${clientIp} ${Date.now() - now}ms`,
            'HttpLogInterceptor',
          );

          // Optionally log request body for debugging (be cautious with sensitive data)
          if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(
              `Request body: ${JSON.stringify(body)}`,
              'HttpLogInterceptor',
            );
          }
        },
        error: (error: any) => {
          this.logger.error(
            `${method} ${url} ${error.status} - ${userAgent} ${clientIp} ${Date.now() - now}ms`,
            error.stack,
            'HttpLogInterceptor',
          );
        },
      }),
    );
  }
}
