import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Ana Sayfa',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Kütüphane',
                items: [
                    { label: 'Form Düzeni', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Giriş Alanları', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Butonlar', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Tablo', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'Liste', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Ağaç', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Katman', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Medya', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menü', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Mesaj', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'Dosya', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Grafik', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Zaman Çizelgesi', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    { label: 'Diğer', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Sayfalar',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { label: 'Kurumsal Kimlik', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
                    { label: 'CRUD Örneği', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
                    { label: 'Boş Sayfa', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] }
                ]
            }
        ];
    }
}
