import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.tenantId) {
            throw new ForbiddenException('Tenant context missing');
        }

        // This guard can be expanded to check against specific resource tenantId if needed.
        // For now, it ensures the user has a tenantId in their token.
        return true;
    }
}
