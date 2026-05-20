import type { MenuItem } from 'primeng/api';

// NavItem: MenuItem'ı genişletir; opsiyonel rol kısıtı ekler
export interface NavItem extends MenuItem {
    requiredRoles?: string[];
}

// NavGroup: menü üst grubu (label + items)
export interface NavGroup {
    label: string;
    icon?: string;
    separator?: boolean;
    requiredRoles?: string[];
    items?: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Ana Sayfa',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
    },
    {
        label: 'Bileşen Kütüphanesi',
        items: [
            { label: 'Butonlar', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            { label: 'Giriş Alanları', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            { label: 'Form Düzeni', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            { label: 'Zengin Metin', icon: 'pi pi-fw pi-align-left', routerLink: ['/uikit/editor'] },
            { label: 'Tablo', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            { label: 'Liste', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            { label: 'Ağaç', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            { label: 'Medya', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            { label: 'Menü', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            { label: 'Mesajlar', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            { label: 'Dosya Yükleme', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            { label: 'Grafikler', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            { label: 'Zaman Çizelgesi', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            { label: 'Diğer', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
        ]
    },
    {
        label: 'Sayfalar',
        items: [
            { label: 'Kurumsal Kimlik', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
            { label: 'CRUD Örneği', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
            { label: 'Boş Sayfa', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] }
        ]
    }
];

// Breadcrumb için route → Türkçe etiket eşlemesi
export const ROUTE_LABEL_MAP: Record<string, string> = {
    '/': 'Ana Sayfa',
    '/uikit/button': 'Butonlar',
    '/uikit/input': 'Giriş Alanları',
    '/uikit/formlayout': 'Form Düzeni',
    '/uikit/editor': 'Zengin Metin',
    '/uikit/table': 'Tablo',
    '/uikit/list': 'Liste',
    '/uikit/tree': 'Ağaç',
    '/uikit/panel': 'Panel',
    '/uikit/overlay': 'Overlay',
    '/uikit/media': 'Medya',
    '/uikit/menu': 'Menü',
    '/uikit/message': 'Mesajlar',
    '/uikit/file': 'Dosya Yükleme',
    '/uikit/charts': 'Grafikler',
    '/uikit/timeline': 'Zaman Çizelgesi',
    '/uikit/misc': 'Diğer',
    '/pages/kurumsal-kimlik': 'Kurumsal Kimlik',
    '/pages/crud': 'CRUD Örneği',
    '/pages/empty': 'Boş Sayfa',
    '/auth/login': 'Giriş',
    '/auth/callback': 'SSO Geri Dönüş'
};
