import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

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

// MFA palette renkleriyle SVG data URI üretir — dış CDN gerektirmez
function svgPlaceholder(w: number, h: number, bg: string, label: string): string {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
        `<rect width="${w}" height="${h}" fill="${bg}"/>` +
        (label ? `<text x="${w / 2}" y="${h / 2}" font-size="${Math.floor(h / 6)}" ` + `text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Helvetica,Arial,sans-serif">${label}</text>` : '') +
        `</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const MFA_RENKLER = ['#DA291C', '#003773', '#00235A', '#D7AD4D', '#53565A'];
const MFA_ETIKETLER = ['MFA Kırmızı', 'Lacivert', 'Koyu Lacivert', 'Altın Varak', 'Kurumsal Gri'];

@Component({
    selector: 'app-media-demo',
    standalone: true,
    imports: [CommonModule, CarouselModule, ButtonModule, GalleriaModule, ImageModule, TagModule],
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
            <p-image [src]="onizlemeSrc" alt="MFA Kurumsal Görsel" width="250" [preview]="true" />
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
    kartlar = signal<Kart[]>([
        { id: '1', baslik: 'Vize Başvurusu', aciklama: 'Schengen vize başvuru süreci', icon: 'pi pi-id-card', renk: '#DA291C', durum: 'AKTIF' },
        { id: '2', baslik: 'Pasaport İşlemleri', aciklama: 'Pasaport yenileme ve başvuru', icon: 'pi pi-book', renk: '#003773', durum: 'AKTIF' },
        { id: '3', baslik: 'Konsolosluk Randevu', aciklama: 'Online randevu sistemi', icon: 'pi pi-calendar', renk: '#00235A', durum: 'BEKLEMEDE' },
        { id: '4', baslik: 'Belge Onayı', aciklama: 'Apostil ve noter onay işlemleri', icon: 'pi pi-file-check', renk: '#53565A', durum: 'AKTIF' },
        { id: '5', baslik: 'Tercüme Hizmetleri', aciklama: 'Resmi belge tercümesi', icon: 'pi pi-language', renk: '#D7AD4D', durum: 'PASIF' }
    ]);

    gorseller = signal<Gorsel[]>(
        MFA_RENKLER.map((renk, i) => ({
            itemImageSrc: svgPlaceholder(800, 500, renk, MFA_ETIKETLER[i]),
            thumbnailImageSrc: svgPlaceholder(120, 80, renk, ''),
            alt: MFA_ETIKETLER[i]
        }))
    );

    onizlemeSrc = svgPlaceholder(400, 300, '#DA291C', 'T.C. Dışişleri Bakanlığı');

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
