import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@/app/core/auth/auth.service';
import { appEnv } from '@/app/core/config/app-env';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, TranslatePipe],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-10">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ 'auth.login.title' | t }}</div>
                            <span class="text-muted-color font-medium">{{ 'auth.login.subtitle' | t }}</span>
                        </div>

                        <div class="flex flex-col items-center gap-4">
                            <p class="text-surface-500 text-sm text-center max-w-xs">{{ 'auth.login.sso.description' | t }}</p>
                            <p-button [label]="'auth.login.sso.button' | t" icon="pi pi-sign-in" styleClass="w-full" (onClick)="onSsoLogin()" />
                        </div>

                        @if (!isSsoConfigured) {
                            <div class="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                                <div class="flex items-center justify-center gap-2 mb-4">
                                    <span class="text-xs font-semibold px-2 py-1 rounded" style="background: var(--mfa-gold); color: #1a1a1a">{{ 'auth.login.dev.badge' | t }}</span>
                                    <span class="text-xs text-muted-color">{{ 'auth.login.dev.note' | t }}</span>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <input pInputText class="w-full" [placeholder]="'auth.login.dev.placeholder' | t" [value]="devName()" (input)="devName.set($any($event.target).value)" />
                                    <p-button [label]="'auth.login.dev.button' | t" icon="pi pi-code" severity="secondary" styleClass="w-full" (onClick)="onDevLogin()" />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    private authService = inject(AuthService);

    // SSO yapılandırılmışsa dev bölümü gizlenir
    protected readonly isSsoConfigured = !!appEnv.ssoUrl();
    protected readonly devName = signal('');

    onSsoLogin(): void {
        this.authService.loginRedirect();
    }

    onDevLogin(): void {
        this.authService.devLogin(this.devName() || 'Geliştirici Kullanıcı');
    }
}
