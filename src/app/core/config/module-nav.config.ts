import type { MenuItem } from 'primeng/api';

// NavItem: label'a alternatif olarak labelKey (i18n için) eklenir
export interface NavItem extends Omit<MenuItem, 'items'> {
    requiredRoles?: string[];
    /** i18n key — `| t` pipe ile çevrilir. Hem labelKey hem label varsa labelKey kazanır. */
    labelKey?: string;
    items?: NavItem[];
}

// NavGroup: menü üst grubu (label/labelKey + items)
export interface NavGroup {
    label?: string;
    labelKey?: string;
    icon?: string;
    separator?: boolean;
    requiredRoles?: string[];
    items?: NavItem[];
}

/**
 * MODULE_NAV — BU MODÜLÜN kendi menüsü.
 *
 * Bu template her fork'ta TEK bir modül olur (Vize, Pasaport, Personel...).
 * Aşağıdaki örnek "Vize" modülüdür. Fork ekibi:
 *   1. Grup başlığını (labelKey) kendi modülüne göre değiştirir.
 *   2. Kendi sayfalarını item olarak ekler (routerLink + requiredRoles).
 *   3. `app.routes.ts`'teki "/" redirect hedefini kendi ana route'una çevirir.
 *
 * `template-nav.config.ts`'e DOKUNMAYIN — o yalnızca geliştirici referansıdır
 * ve üretimde (SSO yapılandırılınca) otomatik gizlenir.
 */
export const MODULE_NAV: NavGroup[] = [
    {
        labelKey: 'menu.module.vize',
        items: [{ labelKey: 'menu.modules.vize', icon: 'pi pi-fw pi-id-card', routerLink: ['/vize'], requiredRoles: ['VIZE_OKUMA'] }]
    }
];
