import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/app/core/auth/auth.service';

// React referansı: lib/api-client.ts interceptor.response.use hata dalı
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const status = error.status;

            if (status === 401) {
                // Oturum süresi doldu — SSO'ya yönlendir, observable zinciri kesilir
                authService.loginRedirect(window.location.pathname);
                return EMPTY;
            }

            if (status === 403) {
                messageService.add({
                    severity: 'error',
                    summary: 'Yetkisiz İşlem',
                    detail: 'Bu işlem için yetkiniz bulunmamaktadır.'
                });
            } else if (status === 422) {
                const detail = (error.error as { message?: string })?.message ?? 'Doğrulama hatası oluştu.';
                messageService.add({ severity: 'error', summary: 'Doğrulama Hatası', detail });
            } else if (status >= 500) {
                messageService.add({
                    severity: 'error',
                    summary: 'Sunucu Hatası',
                    detail: 'Sunucudan beklenmeyen bir hata alındı. Lütfen daha sonra tekrar deneyiniz.'
                });
            } else if (status === 0) {
                messageService.add({
                    severity: 'error',
                    summary: 'Bağlantı Hatası',
                    detail: 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol ediniz.'
                });
            }
            // 404, 400, 409 vb. — sessiz, çağıran handle etsin

            return throwError(() => error);
        })
    );
};
