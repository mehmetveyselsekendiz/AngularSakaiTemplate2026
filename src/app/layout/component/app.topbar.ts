import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { AppSettingsForm } from '@/app/layout/component/app.settings-form';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        TooltipModule,
        DrawerModule,
        AppSettingsForm,
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
            <div class="layout-config-menu">
                <button
                    type="button"
                    class="layout-topbar-action"
                    (click)="settingsOpen.set(true)"
                    [pTooltip]="'topbar.settings' | t"
                    tooltipPosition="bottom"
                    [attr.aria-label]="'topbar.settings' | t">
                    <i class="pi pi-cog"></i>
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

        <p-drawer
            [visible]="settingsOpen()"
            (visibleChange)="settingsOpen.set($event)"
            position="right"
            styleClass="!w-full md:!w-96"
            [header]="'settings.title' | t">
            <app-settings-form />
        </p-drawer>
    </div>`
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    settingsOpen = signal<boolean>(false);

    onLogout(): void {
        this.authService.logout();
    }
}
