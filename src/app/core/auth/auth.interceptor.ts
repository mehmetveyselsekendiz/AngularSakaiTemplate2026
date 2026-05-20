import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

// Token endpoint çağrısına Bearer ekleme — sonsuz döngü önlenir
const TOKEN_ENDPOINT_PATH = '/protocol/openid-connect/token';

// HttpInterceptorFn: Angular'ın functional interceptor pattern'i — inject() kullanılabilir
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token && !req.url.includes(TOKEN_ENDPOINT_PATH)) {
        return next(req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        }));
    }

    return next(req);
};
