import type { NavGroup } from './module-nav.config';

/**
 * TEMPLATE_NAV — geliştirici referansı. SADECE dev modda (SSO boş) gösterilir.
 * Fork ekibi buraya dokunmaz. `path` alanı olan maddeler collapsible'dır
 * (PrimeNG sakai menüsünde nested item + activePath davranışı).
 */
export const TEMPLATE_NAV: NavGroup[] = [
    {
        labelKey: 'menu.dev',
        items: [
            {
                labelKey: 'menu.library',
                icon: 'pi pi-fw pi-th-large',
                path: 'uikit',
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
                    { labelKey: 'menu.uikit.misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] },
                    { labelKey: 'menu.uikit.patterns', icon: 'pi pi-fw pi-objects-column', routerLink: ['/uikit/patterns'] }
                ]
            },
            {
                labelKey: 'menu.dev.corporate',
                icon: 'pi pi-fw pi-palette',
                path: 'kk',
                items: [
                    { labelKey: 'menu.pages.corporate-identity', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
                    { labelKey: 'menu.pages.audit', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/kurumsal-kimlik/denetim'] },
                    { labelKey: 'menu.pages.settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/ayarlar'] }
                ]
            },
            {
                labelKey: 'menu.dev.examples',
                icon: 'pi pi-fw pi-copy',
                path: 'ornek',
                items: [
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
        ]
    }
];
