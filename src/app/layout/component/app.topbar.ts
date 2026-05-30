import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PopoverModule } from 'primeng/popover';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { SettingsService } from '@/app/core/settings/settings.service';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { FontScale } from '@/app/core/settings/settings.types';
import { MfaLogo } from '@/app/core/util/mfa-logo';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule, StyleClassModule, TooltipModule, SelectButtonModule, PopoverModule, TranslatePipe, MfaLogo],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()" [attr.aria-label]="'topbar.toggle_menu' | t">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <app-mfa-logo [responsive]="true" />
            </a>
        </div>

        <div class="layout-topbar-actions">
            <!-- 3'lü ayar grubu: Dil / Font / Tema — tek border'lı container, aralarında divider -->
            <div class="mfa-settings-group inline-flex items-stretch overflow-hidden rounded-md border" style="border-color: var(--mfa-border)">
                <!-- Dil toggle (TR ↔ EN tek tıkla) -->
                <button type="button" class="mfa-settings-btn" (click)="toggleLanguage()" [pTooltip]="languageTooltip()" tooltipPosition="bottom" [attr.aria-label]="languageTooltip()">
                    <i class="pi pi-language"></i>
                    <span class="text-xs font-semibold uppercase">{{ settings.language() }}</span>
                </button>

                <!-- Font scale (popover trigger, Aa metafor) -->
                <button type="button" class="mfa-settings-btn" style="border-left: 1px solid var(--mfa-border)" (click)="fontPopover.toggle($event)" [pTooltip]="fontTooltip()" tooltipPosition="bottom" [attr.aria-label]="fontTooltip()">
                    <span class="text-xs leading-none">A</span>
                    <span class="text-base font-bold leading-none">A</span>
                </button>

                <!-- Tema toggle (light ↔ dark tek tıkla) -->
                <button type="button" class="mfa-settings-btn" style="border-left: 1px solid var(--mfa-border)" (click)="toggleTheme()" [pTooltip]="themeTooltip()" tooltipPosition="bottom" [attr.aria-label]="themeTooltip()">
                    <i [class]="settings.isDark() ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </button>
            </div>

            <p-popover #fontPopover>
                <div class="flex flex-col gap-2 p-2 min-w-[16rem]">
                    <label class="block font-medium text-sm">{{ fontTooltip() }}</label>
                    <p-selectButton [options]="scaleOptions" [ngModel]="settings.fontScale()" (ngModelChange)="settings.setFontScale($event)" optionLabel="label" optionValue="value" [allowEmpty]="false" />
                </div>
            </p-popover>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    @if (authService.isLoggedIn()) {
                        <button type="button" class="layout-topbar-action" [pTooltip]="logoutTooltip()" tooltipPosition="bottom" (click)="onLogout()">
                            <i class="pi pi-user"></i>
                            <span>{{ authService.displayName() }}</span>
                        </button>
                    } @else {
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-user"></i>
                            <span>{{ 'topbar.profile' | t }}</span>
                        </button>
                    }
                </div>
            </div>
        </div>
    </div>`,
    styles: [
        `
            .mfa-settings-group {
                background: var(--mfa-bg);
            }
            .mfa-settings-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.35rem;
                padding: 0 0.85rem;
                min-width: 2.75rem;
                /* Dokunma hedefi tabanı 44px (WCAG 2.1 SC 2.5.5) — px kasıtlı. */
                min-height: 44px;
                color: var(--mfa-text);
                background: transparent;
                border: none;
                cursor: pointer;
                transition: background-color 0.15s ease;
            }
            .mfa-settings-btn:hover {
                background: var(--mfa-bg-muted);
            }
            .mfa-settings-btn:focus-visible {
                outline: 2px solid var(--mfa-brand);
                outline-offset: -2px;
            }
        `
    ]
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    settings = inject(SettingsService);
    private readonly t = inject(TranslateService);

    // Tooltip text'lerini computed signal'a bağla → dil değişince PrimeNG tooltip directive yeni değer alır.
    // `| t` pipe template'te re-eval olur ama PrimeNG `pTooltip` Input bağlanması için signal value daha güvenilir.
    readonly themeTooltip = computed(() => {
        this.t.dict();
        return this.t.t('topbar.theme.tooltip');
    });
    readonly fontTooltip = computed(() => {
        this.t.dict();
        return this.t.t('topbar.font.tooltip');
    });
    readonly languageTooltip = computed(() => {
        this.t.dict();
        return this.t.t('topbar.language.tooltip');
    });
    readonly logoutTooltip = computed(() => {
        this.t.dict();
        return this.t.t('topbar.logout');
    });

    readonly scaleOptions: { label: string; value: FontScale }[] = [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 'sm' },
        { label: 'M', value: 'md' },
        { label: 'L', value: 'lg' },
        { label: 'XL', value: 'xl' }
    ];

    toggleTheme(): void {
        this.settings.setThemeMode(this.settings.isDark() ? 'light' : 'dark');
    }

    toggleLanguage(): void {
        this.settings.setLanguage(this.settings.language() === 'tr' ? 'en' : 'tr');
    }

    onLogout(): void {
        this.authService.logout();
    }
}
