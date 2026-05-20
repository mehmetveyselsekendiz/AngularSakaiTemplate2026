import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { MfaPreset } from '@/app/core/config/theme.config';
import { authInterceptor } from '@/app/core/auth/auth.interceptor';
import { errorInterceptor } from '@/app/core/http/error.interceptor';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: MfaPreset, options: { darkModeSelector: '.app-dark' } } }),
        // MessageService: error interceptor ve tüm uygulama için global provider
        MessageService,
    ]
};
