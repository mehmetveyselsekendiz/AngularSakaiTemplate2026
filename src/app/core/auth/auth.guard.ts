import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// Functional guard — standalone + zoneless uyumlu
export const authGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);

    if (authService.isLoggedIn()) {
        return true;
    }

    // state.url: kullanıcının gitmek istediği URL, giriş sonrası buraya dönülür
    authService.loginRedirect(state.url);
    return false;
};
