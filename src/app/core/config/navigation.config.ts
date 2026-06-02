import { MODULE_NAV, type NavGroup, type NavItem } from './module-nav.config';
import { TEMPLATE_NAV } from './template-nav.config';

// Geriye uyumluluk: tipler eski yoldan da import edilebilsin
export type { NavItem, NavGroup };

/**
 * Sidebar gruplarını kur. Dev modda (SSO boş) geliştirici referansı eklenir;
 * üretimde sadece modülün kendi menüsü görünür.
 */
export function buildNavGroups(isDevMode: boolean): NavGroup[] {
    return isDevMode ? [...MODULE_NAV, ...TEMPLATE_NAV] : [...MODULE_NAV];
}

// Geriye uyumlu tam liste (breadcrumb / olası tüketiciler)
export const NAV_GROUPS: NavGroup[] = buildNavGroups(true);

// Breadcrumb için: route → labelKey eşlemesi
export const ROUTE_LABEL_KEY_MAP: Record<string, string> = {
    '/': 'menu.module.vize',
    '/vize': 'menu.modules.vize',
    '/uikit/button': 'menu.uikit.button',
    '/uikit/input': 'menu.uikit.input',
    '/uikit/formlayout': 'menu.uikit.formlayout',
    '/uikit/hierarchy': 'menu.uikit.hierarchy',
    '/uikit/editor': 'menu.uikit.editor',
    '/uikit/table': 'menu.uikit.table',
    '/uikit/list': 'menu.uikit.list',
    '/uikit/tree': 'menu.uikit.tree',
    '/uikit/panel': 'menu.uikit.panel',
    '/uikit/overlay': 'menu.uikit.overlay',
    '/uikit/media': 'menu.uikit.media',
    '/uikit/menu': 'menu.uikit.menu',
    '/uikit/message': 'menu.uikit.message',
    '/uikit/file': 'menu.uikit.file',
    '/uikit/charts': 'menu.uikit.charts',
    '/uikit/timeline': 'menu.uikit.timeline',
    '/uikit/misc': 'menu.uikit.misc',
    '/uikit/patterns': 'menu.uikit.patterns',
    '/pages/kurumsal-kimlik': 'menu.pages.corporate-identity',
    '/pages/kurumsal-kimlik/denetim': 'menu.pages.audit',
    '/pages/crud': 'menu.pages.crud',
    '/pages/empty': 'menu.pages.empty',
    '/pages/ayarlar': 'menu.pages.settings',
    '/auth/login': 'menu.pages.auth.login'
};

// Eski sabit hâlâ tüketicide çağrılıyorsa adapter
export const ROUTE_LABEL_MAP: Record<string, string> = ROUTE_LABEL_KEY_MAP;
