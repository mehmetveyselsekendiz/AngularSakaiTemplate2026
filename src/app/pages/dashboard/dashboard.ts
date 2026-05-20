import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '@/app/core/auth/auth.service';

interface QuickLink {
    label: string;
    description: string;
    icon: string;
    route: string[];
}

// Ana gezinme gruplarından hızlı erişim kartları
const QUICK_LINKS: QuickLink[] = [
    {
        label: 'Bileşen Kütüphanesi',
        description: 'PrimeNG bileşenlerini MFA kurumsal paletinde inceleyin',
        icon: 'pi pi-th-large',
        route: ['/uikit/button']
    },
    {
        label: 'Kurumsal Kimlik',
        description: 'MFA renk paleti, tipografi ve logo kullanım rehberi',
        icon: 'pi pi-palette',
        route: ['/pages/kurumsal-kimlik']
    },
    {
        label: 'CRUD Örneği',
        description: 'Veri listeleme, ekleme ve düzenleme sayfası şablonu',
        icon: 'pi pi-database',
        route: ['/pages/crud']
    },
    {
        label: 'Boş Sayfa',
        description: 'Yeni modül geliştirmek için başlangıç şablonu',
        icon: 'pi pi-file',
        route: ['/pages/empty']
    }
];

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterModule, ButtonModule, CardModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <p-card>
                    <div class="flex items-center gap-4">
                        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full shrink-0" style="background: var(--mfa-red)">
                            <i class="pi pi-shield text-3xl" style="color: white"></i>
                        </span>
                        <div>
                            <h2 class="text-2xl font-semibold m-0">
                                @if (displayName()) {
                                    Hoş geldiniz, {{ displayName() }}
                                } @else {
                                    Hoş geldiniz
                                }
                            </h2>
                            <p class="text-muted-color mt-1 mb-0">T.C. Dışişleri Bakanlığı — Kurumsal Uygulama Platformu</p>
                        </div>
                    </div>
                </p-card>
            </div>

            @for (link of quickLinks; track link.label) {
                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <p-card styleClass="h-full">
                        <div class="flex flex-col gap-4 h-full">
                            <div class="flex items-center gap-3">
                                <i [class]="link.icon + ' text-2xl text-primary'"></i>
                                <span class="font-semibold text-base">{{ link.label }}</span>
                            </div>
                            <p class="text-muted-color text-sm m-0 flex-1">{{ link.description }}</p>
                            <p-button label="İncele" severity="secondary" size="small" styleClass="w-full" [routerLink]="link.route" />
                        </div>
                    </p-card>
                </div>
            }
        </div>
    `
})
export class Dashboard {
    private authService = inject(AuthService);
    readonly displayName = this.authService.displayName;
    readonly quickLinks = QUICK_LINKS;
}
