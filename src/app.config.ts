import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, inject, provideEnvironmentInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import localeEn from '@angular/common/locales/en';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { MfaPreset } from '@/app/core/config/theme.config';
import { authInterceptor } from '@/app/core/auth/auth.interceptor';
import { errorInterceptor } from '@/app/core/http/error.interceptor';
// GELİŞTİRME-AMAÇLI: vize modülü için bellek-içi mock (yalnızca SSO yokken aktif).
// Gerçek staging'e geçişte bu satırı ve vize-dev-data.interceptor.ts dosyasını kaldırın.
import { vizeDevDataInterceptor } from '@/app/features/vize/vize-dev-data.interceptor';
import { SettingsService } from '@/app/core/settings/settings.service';
import { appRoutes } from './app.routes';

registerLocaleData(localeTr, 'tr');
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([vizeDevDataInterceptor, authInterceptor, errorInterceptor])),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: MfaPreset, options: { darkModeSelector: '.app-dark' } } }),
        // MessageService: error interceptor ve tüm uygulama için global provider
        MessageService,
        // SettingsService'i root injector kurulurken erken oluştur → DOM effect'leri ilk render'dan önce çalışsın
        provideEnvironmentInitializer(() => inject(SettingsService)),
        // LOCALE_ID runtime factory — Angular date/currency/number pipe'ları kullanıcının dil seçimine uyar
        // (Bilinen sınırlama: factory bir kez çalışır, runtime dil değişimi için sayfa reload gerekir — bkz. spec §6.6)
        {
            provide: LOCALE_ID,
            useFactory: () => inject(SettingsService).language()
        }
    ]
};
