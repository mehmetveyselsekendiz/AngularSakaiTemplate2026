import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/auth/auth.service';
import { NAV_GROUPS, NavItem } from '@/app/core/config/navigation.config';
import { TranslateService } from '@/app/core/i18n/translate.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of filteredModel(); track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    private readonly authService = inject(AuthService);
    private readonly translate = inject(TranslateService);

    // computed(): rol VE dil değişince menü otomatik yeniden hesaplanır (zoneless uyumlu)
    readonly filteredModel = computed<MenuItem[]>(() => {
        const roles = this.authService.roles();
        this.translate.dict(); // dil signal'ına abone ol → dil değişince re-eval

        return NAV_GROUPS
            .filter((g) => this.hasAccess(g.requiredRoles, roles))
            .map((g) => ({
                label: g.labelKey ? this.translate.t(g.labelKey) : g.label,
                icon: g.icon,
                separator: g.separator,
                items: (g.items ?? [])
                    .filter((i) => this.hasAccess(i.requiredRoles, roles))
                    .map((i) => this.mapItem(i, roles))
            }));
    });

    private mapItem(item: NavItem, roles: string[]): MenuItem {
        const mapped: MenuItem = {
            label: item.labelKey ? this.translate.t(item.labelKey) : item['label'],
            icon: item['icon'],
            class: item['class'],
            routerLink: item['routerLink']
        };
        // path (PrimeNG sub-group açma davranışı için) varsa koru
        if ((item as Record<string, unknown>)['path'] !== undefined) {
            (mapped as Record<string, unknown>)['path'] = (item as Record<string, unknown>)['path'];
        }
        if (item.items?.length) {
            mapped.items = item.items
                .filter((sub) => this.hasAccess(sub.requiredRoles, roles))
                .map((sub) => this.mapItem(sub, roles));
        }
        return mapped;
    }

    private hasAccess(required: string[] | undefined, userRoles: string[]): boolean {
        if (!required || required.length === 0) return true;
        return required.some((r) => userRoles.includes(r));
    }
}
