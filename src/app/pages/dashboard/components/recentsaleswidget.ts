import { Component, signal } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

interface Product {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    inventoryStatus?: string;
}

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <p-table [value]="products()" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Image</th>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <img src="https://primefaces.org/cdn/primevue/images/product/{{ product.image }}" class="shadow-lg" alt="{{ product.name }}" width="50" />
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ product.name }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ product.price | currency: 'USD' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`
})
export class RecentSalesWidget {
    products = signal<Product[]>([
        { id: '1000', name: 'Bamboo Watch', price: 65, image: 'bamboo-watch.jpg', inventoryStatus: 'INSTOCK' },
        { id: '1001', name: 'Black Watch', price: 72, image: 'black-watch.jpg', inventoryStatus: 'INSTOCK' },
        { id: '1002', name: 'Blue Band', price: 79, image: 'blue-band.jpg', inventoryStatus: 'LOWSTOCK' },
        { id: '1003', name: 'Blue T-Shirt', price: 29, image: 'blue-t-shirt.jpg', inventoryStatus: 'INSTOCK' },
        { id: '1004', name: 'Bracelet', price: 15, image: 'bracelet.jpg', inventoryStatus: 'INSTOCK' }
    ]);
}
