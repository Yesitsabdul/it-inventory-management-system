import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepo: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, user } = request;

    console.log(`[AuditLog] Interceptor fired: ${method} ${url}`);

    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseBody) => {
        console.log(`[AuditLog] tap() fired for ${method} ${url}`);
        try {
          const urlParts = url.split('/').filter(Boolean);
          const entity_type = urlParts[0] ?? 'unknown';

          const urlId = parseInt(urlParts[1]);
          const entity_id = !isNaN(urlId)
            ? urlId
            : responseBody?.id ?? 0;

          const actionMap: Record<string, string> = {
            POST: 'CREATE',
            PATCH: 'UPDATE',
            PUT: 'UPDATE',
            DELETE: 'DELETE',
          };
          const action = actionMap[method] ?? 'UNKNOWN';

          const auditLogEntry = this.auditLogRepo.create({
            action,
            entity_type,
            entity_id,
            new_values: method === 'POST' ? responseBody : undefined,
            ip_address: ip,
            user: user ? ({ id: user.id } as any) : undefined,
          } as any);

          await this.auditLogRepo.save(auditLogEntry);
        } catch (err) {
          console.error('AuditLogInterceptor error:', err);
        }
      }),
    );
  }
}