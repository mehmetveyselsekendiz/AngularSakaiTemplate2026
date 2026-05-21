import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PopoverModule } from 'primeng/popover';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { SettingsService } from '@/app/core/settings/settings.service';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { AppLanguage, FontScale } from '@/app/core/settings/settings.types';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        StyleClassModule,
        TooltipModule,
        SelectModule,
        SelectButtonModule,
        PopoverModule,
        TranslatePipe
    ],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button
                class="layout-menu-button layout-topbar-action"
                (click)="layoutService.onMenuToggle()"
                [attr.aria-label]="'topbar.toggle_menu' | t">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>MFA</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu flex items-center gap-2">
                <!-- Dil select (profil'in en solunda) -->
                <p-select
                    [options]="languageOptions()"
                    [ngModel]="settings.language()"
                    (ngModelChange)="settings.setLanguage($event)"
                    optionLabel="label"
                    optionValue="value"
                    styleClass="!min-w-[5.5rem] text-sm"
                    appendTo="body"
                    [pTooltip]="'topbar.language.tooltip' | t"
                    tooltipPosition="bottom" />

                <!-- Font scale popover trigger -->
                <button
                    type="button"
                    class="layout-topbar-action"
                    (click)="fontPopover.toggle($event)"
                    [pTooltip]="'topbar.font.tooltip' | t"
                    tooltipPosition="bottom"
                    [attr.aria-label]="'topbar.font.tooltip' | t">
                    <i class="pi pi-text-height"></i>
                </button>
                <p-popover #fontPopover>
                    <div class="flex flex-col gap-2 p-2 min-w-[16rem]">
                        <label class="block font-medium text-sm">{{ 'topbar.font.tooltip' | t }}</label>
                        <p-selectButton
                            [options]="scaleOptions"
                            [ngModel]="settings.fontScale()"
                            (ngModelChange)="settings.setFontScale($event)"
                            optionLabel="label"
                            optionValue="value"
                            [allowEmpty]="false" />
                    </div>
                </p-popover>

                <!-- Tema toggle -->
                <button
                    type="button"
                    class="layout-topbar-action"
                    (click)="toggleTheme()"
                    [pTooltip]="'topbar.theme.tooltip' | t"
                    tooltipPosition="bottom"
                    [attr.aria-label]="'topbar.theme.tooltip' | t">
                    <i [class]="settings.isDark() ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                pStyleClass="@next"
                enterFromClass="hidden"
                enterActiveClass="animate-scalein"
                leaveToClass="hidden"
                leaveActiveClass="animate-fadeout"
                [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    @if (authService.isLoggedIn()) {
                        <button
                            type="button"
                            class="layout-topbar-action"
                            [pTooltip]="'topbar.logout' | t"
                            tooltipPosition="bottom"
                            (click)="onLogout()">
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
    </div>`
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    settings = inject(SettingsService);
    private readonly t = inject(TranslateService);

    readonly languageOptions = computed(() => {
        this.t.dict();
        return [
            { label: this.t.t('settings.language.tr'), value: 'tr' as AppLanguage },
            { label: this.t.t('settings.language.en'), value: 'en' as AppLanguage }
        ];
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

    onLogout(): void {
        this.authService.logout();
    }
}
