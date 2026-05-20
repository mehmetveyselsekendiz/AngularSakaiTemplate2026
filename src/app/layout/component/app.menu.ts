import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/auth/auth.service';
import { NAV_GROUPS } from '@/app/core/config/navigation.config';

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
    private authService = inject(AuthService);

    // computed(): kullanıcı rolleri değişince menü otomatik yeniden hesaplanır (zoneless uyumlu)
    readonly filteredModel = computed(() => {
        const roles = this.authService.roles();
        const hasAccess = (required?: string[]) => !required?.length || required.some((r) => roles.includes(r));
        return NAV_GROUPS.filter((g) => hasAccess(g.requiredRoles)).map((g) => ({
            ...g,
            items: g.items?.filter((item) => hasAccess(item.requiredRoles))
        }));
    });
}
