import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-10">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">T.C. Dışişleri Bakanlığı</div>
                            <span class="text-muted-color font-medium">Kurumsal Kimlik Sistemi</span>
                        </div>

                        <div class="flex flex-col items-center gap-4">
                            <p class="text-surface-500 text-sm text-center max-w-xs">
                                Sisteme erişmek için MFA Merkezi Kimlik Doğrulama (SSO) servisi kullanılmaktadır.
                            </p>
                            <p-button
                                label="MFA SSO ile Giriş Yap"
                                icon="pi pi-sign-in"
                                styleClass="w-full"
                                (onClick)="onSsoLogin()"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    private authService = inject(AuthService);

    onSsoLogin(): void {
        this.authService.loginRedirect();
    }
}
