import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { brandColors } from '@/app/core/config/design-tokens';
import { svgPlaceholder } from '@/app/core/util/svg-placeholder';
import { CodeBlock } from './code-block';
import { SnippetService } from './snippet.service';

interface Kart {
    id: string;
    baslik: string;
    aciklama: string;
    icon: string;
    renk: string;
    durum: 'AKTIF' | 'BEKLEMEDE' | 'PASIF';
}

interface Gorsel {
    itemImageSrc: string;
    thumbnailImageSrc: string;
    alt: string;
}

// svgPlaceholder data:URI içinde CSS var() çözülmez → hex değerleri tek
// yetkili kaynaktan (design-tokens.ts) okunur, burada hardcode edilmez.
const MFA_RENKLER = [brandColors.red.hex, brandColors.navy.hex, brandColors.navyDark.hex, brandColors.gold.hex, brandColors.gray.hex];
const MFA_ETIKETLER = ['MFA Kırmızı', 'Lacivert', 'Koyu Lacivert', 'Altın Varak', 'Kurumsal Gri'];

@Component({
    selector: 'app-media-demo',
    standalone: true,
    imports: [CommonModule, CarouselModule, ButtonModule, GalleriaModule, ImageModule, TagModule, CodeBlock],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Carousel</div>
            <p-carousel [value]="kartlar()" [numVisible]="3" [numScroll]="1" [circular]="true" [responsiveOptions]="carouselOptions">
                <ng-template let-kart #item>
                    <div class="border border-surface rounded-border m-2 p-4 flex flex-col gap-3">
                        <div class="flex items-center justify-center rounded-border h-32" [style.background]="kart.renk">
                            <i [class]="kart.icon + ' text-white'" style="font-size: 3rem"></i>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-semibold">{{ kart.baslik }}</span>
                            <p-tag [value]="kart.durum" [severity]="getDurumSeverity(kart.durum)" />
                        </div>
                        <p class="text-sm text-color-secondary m-0">{{ kart.aciklama }}</p>
                        <div class="flex gap-2 justify-end">
                            <p-button icon="pi pi-eye" severity="secondary" [outlined]="true" size="small" />
                            <p-button icon="pi pi-pencil" size="small" />
                        </div>
                    </div>
                </ng-template>
            </p-carousel>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Image (Önizleme)</div>
            <!-- snippet:media-image -->
            <p-image [src]="onizlemeSrc" alt="MFA Kurumsal Görsel" width="250" [preview]="true" />
            <!-- /snippet -->
            <app-code-block [code]="snippet('media-image')" />
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Galleria</div>
            <p-galleria [value]="gorseller()" [responsiveOptions]="galleriaOptions" [containerStyle]="{ 'max-width': '640px' }" [numVisible]="5">
                <ng-template #item let-item>
                    <img [src]="item.itemImageSrc" [alt]="item.alt" style="width:100%; border-radius: var(--border-radius)" />
                </ng-template>
                <ng-template #thumbnail let-item>
                    <img [src]="item.thumbnailImageSrc" [alt]="item.alt" style="width:100%" />
                </ng-template>
            </p-galleria>
        </div>
    `
})
export class MediaDemo {
    private readonly snippets = inject(SnippetService).forPage('mediademo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    kartlar = signal<Kart[]>([
        { id: '1', baslik: 'Vize Başvurusu', aciklama: 'Schengen vize başvuru süreci', icon: 'pi pi-id-card', renk: 'var(--mfa-red)', durum: 'AKTIF' },
        { id: '2', baslik: 'Pasaport İşlemleri', aciklama: 'Pasaport yenileme ve başvuru', icon: 'pi pi-book', renk: 'var(--mfa-navy)', durum: 'AKTIF' },
        { id: '3', baslik: 'Konsolosluk Randevu', aciklama: 'Online randevu sistemi', icon: 'pi pi-calendar', renk: 'var(--mfa-navy-dark)', durum: 'BEKLEMEDE' },
        { id: '4', baslik: 'Belge Onayı', aciklama: 'Apostil ve noter onay işlemleri', icon: 'pi pi-file-check', renk: 'var(--mfa-gray)', durum: 'AKTIF' },
        { id: '5', baslik: 'Tercüme Hizmetleri', aciklama: 'Resmi belge tercümesi', icon: 'pi pi-language', renk: 'var(--mfa-gold)', durum: 'PASIF' }
    ]);

    gorseller = signal<Gorsel[]>(
        MFA_RENKLER.map((renk, i) => ({
            itemImageSrc: svgPlaceholder(800, 500, renk, MFA_ETIKETLER[i]),
            thumbnailImageSrc: svgPlaceholder(120, 80, renk, ''),
            alt: MFA_ETIKETLER[i]
        }))
    );

    onizlemeSrc = svgPlaceholder(400, 300, brandColors.red.hex, 'T.C. Dışişleri Bakanlığı');

    galleriaOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];

    carouselOptions = [
        { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
        { breakpoint: '768px', numVisible: 2, numScroll: 1 },
        { breakpoint: '560px', numVisible: 1, numScroll: 1 }
    ];

    getDurumSeverity(durum: string): 'success' | 'warn' | 'danger' {
        if (durum === 'AKTIF') return 'success';
        if (durum === 'BEKLEMEDE') return 'warn';
        return 'danger';
    }
}
