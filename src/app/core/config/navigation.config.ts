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

export const NAV_GROUPS: NavGroup[] = [
    {
        labelKey: 'menu.home',
        items: [{ labelKey: 'menu.dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
    },
    {
        labelKey: 'menu.library',
        items: [
            { labelKey: 'menu.uikit.button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            { labelKey: 'menu.uikit.input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            { labelKey: 'menu.uikit.formlayout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            { labelKey: 'menu.uikit.hierarchy', icon: 'pi pi-fw pi-sitemap', routerLink: ['/uikit/hierarchy'] },
            { labelKey: 'menu.uikit.editor', icon: 'pi pi-fw pi-align-left', routerLink: ['/uikit/editor'] },
            { labelKey: 'menu.uikit.table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            { labelKey: 'menu.uikit.list', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            { labelKey: 'menu.uikit.tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            { labelKey: 'menu.uikit.panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            { labelKey: 'menu.uikit.overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            { labelKey: 'menu.uikit.media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            { labelKey: 'menu.uikit.menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            { labelKey: 'menu.uikit.message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            { labelKey: 'menu.uikit.file', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            { labelKey: 'menu.uikit.charts', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            { labelKey: 'menu.uikit.timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            { labelKey: 'menu.uikit.misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
        ]
    },
    {
        labelKey: 'menu.pages',
        items: [
            { labelKey: 'menu.pages.corporate-identity', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
            { labelKey: 'menu.pages.audit', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/kurumsal-kimlik/denetim'] },
            { labelKey: 'menu.pages.settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/ayarlar'] },
            { labelKey: 'menu.pages.crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
            { labelKey: 'menu.pages.empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] },
            {
                labelKey: 'menu.pages.auth',
                icon: 'pi pi-fw pi-user',
                path: 'auth',
                items: [
                    { labelKey: 'menu.pages.auth.login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                    { labelKey: 'menu.pages.auth.access', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] },
                    { labelKey: 'menu.pages.auth.error', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/auth/error'] }
                ]
            },
            { labelKey: 'menu.pages.notfound', icon: 'pi pi-fw pi-times-circle', routerLink: ['/notfound'] }
        ]
    }
];

// Breadcrumb için: route → labelKey eşlemesi (eskiden Türkçe string, şimdi key)
export const ROUTE_LABEL_KEY_MAP: Record<string, string> = {
    '/': 'menu.dashboard',
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
    '/pages/kurumsal-kimlik': 'menu.pages.corporate-identity',
    '/pages/kurumsal-kimlik/denetim': 'menu.pages.audit',
    '/pages/crud': 'menu.pages.crud',
    '/pages/empty': 'menu.pages.empty',
    '/pages/ayarlar': 'menu.pages.settings',
    '/auth/login': 'menu.pages.auth.login'
};

// Eski sabit hâlâ tüketicide çağrılıyorsa adapter
// (Phase 7C'de breadcrumb component'i t() ile yeniden yazılacak)
export const ROUTE_LABEL_MAP: Record<string, string> = ROUTE_LABEL_KEY_MAP;
