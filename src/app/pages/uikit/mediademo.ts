import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

interface Product {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    inventoryStatus?: string;
    category?: string;
}

@Component({
    selector: 'app-media-demo',
    standalone: true,
    imports: [CommonModule, CarouselModule, ButtonModule, GalleriaModule, ImageModule, TagModule],
    template: `<div class="card">
            <div class="font-semibold text-xl mb-4">Carousel</div>
            <p-carousel [value]="products()" [numVisible]="3" [numScroll]="3" [circular]="false" [responsiveOptions]="carouselResponsiveOptions">
                <ng-template let-product #item>
                    <div class="border border-surface rounded-border m-2 p-4">
                        <div class="mb-4">
                            <div class="relative mx-auto">
                                <img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.name" class="w-full rounded-border" />
                                <div class="absolute bg-black/70 rounded-border" [ngStyle]="{ 'left.px': 5, 'top.px': 5 }">
                                    <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 font-medium">{{ product.name }}</div>
                        <div class="flex justify-between items-center">
                            <div class="mt-0 font-semibold text-xl">{{ '$' + product.price }}</div>
                            <span>
                                <p-button icon="pi pi-heart" severity="secondary" [outlined]="true" />
                                <p-button icon="pi pi-shopping-cart" styleClass="ml-2" />
                            </span>
                        </div>
                    </div>
                </ng-template>
            </p-carousel>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Image</div>
            <p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg" alt="Image" width="250" />
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Galleria</div>
            <p-galleria [value]="images()" [responsiveOptions]="galleriaResponsiveOptions" [containerStyle]="{ 'max-width': '640px' }" [numVisible]="5">
                <ng-template #item let-item>
                    <img [src]="item.itemImageSrc" style="width:100%" />
                </ng-template>
                <ng-template #thumbnail let-item>
                    <img [src]="item.thumbnailImageSrc" />
                </ng-template>
            </p-galleria>
        </div>`
})
export class MediaDemo implements OnInit {
    products = signal<Product[]>([
        { id: '1000', name: 'Bamboo Watch', price: 65, image: 'bamboo-watch.jpg', inventoryStatus: 'INSTOCK', category: 'Accessories' },
        { id: '1001', name: 'Black Watch', price: 72, image: 'black-watch.jpg', inventoryStatus: 'INSTOCK', category: 'Accessories' },
        { id: '1002', name: 'Blue Band', price: 79, image: 'blue-band.jpg', inventoryStatus: 'LOWSTOCK', category: 'Fitness' },
        { id: '1003', name: 'Blue T-Shirt', price: 29, image: 'blue-t-shirt.jpg', inventoryStatus: 'INSTOCK', category: 'Clothing' },
        { id: '1004', name: 'Bracelet', price: 15, image: 'bracelet.jpg', inventoryStatus: 'INSTOCK', category: 'Accessories' }
    ]);

    images = signal<any[]>([
        { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg', alt: 'Görsel 1' },
        { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg', alt: 'Görsel 2' },
        { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg', alt: 'Görsel 3' },
        { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg', alt: 'Görsel 4' },
        { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg', alt: 'Görsel 5' }
    ]);

    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    ngOnInit() {}

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }
}
