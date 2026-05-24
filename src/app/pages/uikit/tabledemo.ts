import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ObjectUtils } from 'primeng/utils';
import { svgPlaceholder } from '@/app/core/util/svg-placeholder';
import { brandColors } from '@/app/core/config/design-tokens';

interface Representative {
    name: string;
    image: string;
}
interface Customer {
    id?: string;
    name?: string;
    country?: { name: string; code: string };
    company?: string;
    date?: any;
    status?: string;
    activity?: number;
    representative?: Representative;
    balance?: number;
    verified?: boolean;
}
interface Product {
    id?: string;
    name?: string;
    price?: number;
    category?: string;
    rating?: number;
    inventoryStatus?: string;
    image?: string;
    orders?: { id: string; customer: string; date: string; amount: number; status: string }[];
}

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule
    ],
    template: ` <div class="card">
            <div class="font-semibold text-xl mb-4">Filtering</div>
            <p-table
                #dt1
                [value]="customers1"
                dataKey="id"
                [rows]="10"
                [loading]="loading"
                [rowHover]="true"
                [showGridlines]="true"
                [paginator]="true"
                [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                responsiveLayout="scroll"
            >
                <ng-template #caption>
                    <div class="flex justify-between items-center flex-column sm:flex-row">
                        <button pButton label="Clear" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                        <p-iconfield iconPosition="left" class="ml-auto">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Search keyword" />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">
                                Name
                                <p-columnFilter type="text" field="name" display="menu" placeholder="Search by name"></p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">
                                Country
                                <p-columnFilter type="text" field="country.name" display="menu" placeholder="Search by country"></p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 14rem">
                            <div class="flex justify-between items-center">
                                Agent
                                <p-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                    <ng-template #header>
                                        <div class="px-3 pt-3 pb-0">
                                            <span class="font-bold">Agent Picker</span>
                                        </div>
                                    </ng-template>
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-multiselect [ngModel]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" styleClass="w-full">
                                            <ng-template let-option #item>
                                                <div class="flex items-center gap-2 w-44">
                                                    <img [alt]="option.label" [src]="avatarImage(option.name)" width="32" />
                                                    <span>{{ option.name }}</span>
                                                </div>
                                            </ng-template>
                                        </p-multiselect>
                                    </ng-template>
                                </p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 10rem">
                            <div class="flex justify-between items-center">
                                Date
                                <p-columnFilter type="date" field="date" display="menu" placeholder="mm/dd/yyyy"></p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 10rem">
                            <div class="flex justify-between items-center">
                                Balance
                                <p-columnFilter type="numeric" field="balance" display="menu" currency="USD"></p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">
                                Status
                                <p-columnFilter field="status" matchMode="equals" display="menu">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-select [ngModel]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any" [style]="{ 'min-width': '12rem' }">
                                            <ng-template let-option #item>
                                                <span [class]="'customer-badge status-' + option.value">{{ option.label }}</span>
                                            </ng-template>
                                        </p-select>
                                    </ng-template>
                                </p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">
                                Activity
                                <p-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                    <ng-template #filter let-filter="filterCallback">
                                        <p-slider [ngModel]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" styleClass="m-3" [style]="{ 'min-width': '12rem' }"></p-slider>
                                        <div class="flex items-center justify-between px-2">
                                            <span>{{ activityValues[0] }}</span>
                                            <span>{{ activityValues[1] }}</span>
                                        </div>
                                    </ng-template>
                                </p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 8rem">
                            <div class="flex justify-between items-center">
                                Verified
                                <p-columnFilter type="boolean" field="verified" display="menu"></p-columnFilter>
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="/demo/images/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" width="30" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" [src]="avatarImage(customer.representative.name)" width="32" style="vertical-align: middle" />
                                <span class="image-text">{{ customer.representative.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.date | date: 'MM/dd/yyyy' }}
                        </td>
                        <td>
                            {{ customer.balance | currency: 'USD' : 'symbol' }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status.toLowerCase()" [severity]="getSeverity(customer.status.toLowerCase())" styleClass="dark:bg-surface-900!" />
                        </td>
                        <td>
                            <p-progressbar [value]="customer.activity" [showValue]="false" [style]="{ height: '0.5rem' }" />
                        </td>
                        <td class="text-center">
                            <p-tag [value]="customer.status.toLowerCase()" [severity]="getSeverity(customer.status.toLowerCase())" styleClass="dark:bg-surface-900!" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8">No customers found.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="8">Loading customers data. Please wait.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Frozen Columns</div>
            <p-togglebutton [(ngModel)]="balanceFrozen" [onIcon]="'pi pi-lock'" offIcon="pi pi-lock-open" [onLabel]="'Balance'" offLabel="Balance" />

            <p-table [value]="customers2" [scrollable]="true" scrollHeight="400px" styleClass="mt-4">
                <ng-template #header>
                    <tr>
                        <th style="min-width:200px" pFrozenColumn class="font-bold">Name</th>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:200px">Country</th>
                        <th style="min-width:200px">Date</th>
                        <th style="min-width:200px">Company</th>
                        <th style="min-width:200px">Status</th>
                        <th style="min-width:200px">Activity</th>
                        <th style="min-width:200px">Representative</th>
                        <th style="min-width:200px" alignFrozen="right" pFrozenColumn [frozen]="balanceFrozen" [ngClass]="{ 'font-bold': balanceFrozen }">Balance</th>
                    </tr>
                </ng-template>
                <ng-template #body let-customer>
                    <tr>
                        <td pFrozenColumn class="font-bold">{{ customer.name }}</td>
                        <td style="min-width:100px">{{ customer.id }}</td>
                        <td>{{ customer.country.name }}</td>
                        <td>{{ customer.date }}</td>
                        <td>{{ customer.company }}</td>
                        <td>{{ customer.status }}</td>
                        <td>{{ customer.activity }}</td>
                        <td>{{ customer.representative.name }}</td>
                        <td alignFrozen="right" pFrozenColumn [frozen]="balanceFrozen" [ngClass]="{ 'font-bold': balanceFrozen }">
                            {{ formatCurrency(customer.balance) }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Row Expansion</div>
            <p-table [value]="products" dataKey="id" [tableStyle]="{ 'min-width': '60rem' }" [expandedRowKeys]="expandedRows">
                <ng-template #caption>
                    <button pButton icon="pi pi-fw {{ isExpanded ? 'pi-minus' : 'pi-plus' }}" label="{{ isExpanded ? 'Collapse All' : 'Expand All' }}" (click)="expandAll()"></button>
                    <div class="flex table-header"></div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width: 5rem"></th>
                        <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
                        <th>Image</th>
                        <th pSortableColumn="price">Price <p-sortIcon field="price" /></th>
                        <th pSortableColumn="category">Category <p-sortIcon field="category" /></th>
                        <th pSortableColumn="rating">Reviews <p-sortIcon field="rating" /></th>
                        <th pSortableColumn="inventoryStatus">Status <p-sortIcon field="inventoryStatus" /></th>
                    </tr>
                </ng-template>
                <ng-template #body let-product let-expanded="expanded">
                    <tr>
                        <td>
                            <p-button type="button" pRipple [pRowToggler]="product" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
                        </td>
                        <td>{{ product.name }}</td>
                        <td>
                            <img [src]="productImage(product.name)" [alt]="product.name" width="50" class="shadow-lg" />
                        </td>
                        <td>{{ product.price | currency: 'USD' }}</td>
                        <td>{{ product.category }}</td>
                        <td>
                            <p-rating [ngModel]="product.rating" [readonly]="true" />
                        </td>
                        <td>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #expandedrow let-product>
                    <tr>
                        <td colspan="7">
                            <div class="p-4">
                                <h5>Orders for {{ product.name }}</h5>
                                <p-table [value]="product.orders" dataKey="id">
                                    <ng-template #header>
                                        <tr>
                                            <th pSortableColumn="id">Id <p-sortIcon field="price" /></th>
                                            <th pSortableColumn="customer">
                                                Customer
                                                <p-sortIcon field="customer" />
                                            </th>
                                            <th pSortableColumn="date">Date <p-sortIcon field="date" /></th>
                                            <th pSortableColumn="amount">
                                                Amount
                                                <p-sortIcon field="amount" />
                                            </th>
                                            <th pSortableColumn="status">
                                                Status
                                                <p-sortIcon field="status" />
                                            </th>
                                            <th style="width: 4rem"></th>
                                        </tr>
                                    </ng-template>
                                    <ng-template #body let-order>
                                        <tr>
                                            <td>{{ order.id }}</td>
                                            <td>{{ order.customer }}</td>
                                            <td>{{ order.date }}</td>
                                            <td>
                                                {{ order.amount | currency: 'USD' }}
                                            </td>
                                            <td>
                                                <p-tag [value]="order.status" [severity]="getSeverity(order.status)" />
                                            </td>
                                            <td>
                                                <p-button type="button" icon="pi pi-search" />
                                            </td>
                                        </tr>
                                    </ng-template>
                                    <ng-template #emptymessage>
                                        <tr>
                                            <td colspan="6">There are no order for this product yet.</td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Grouping</div>
            <p-table [value]="customers3" sortField="representative.name" sortMode="single" [scrollable]="true" scrollHeight="400px" rowGroupMode="subheader" groupRowsBy="representative.name" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </ng-template>
                <ng-template #groupheader let-customer>
                    <tr pRowGroupHeader>
                        <td colspan="5">
                            <div class="flex items-center gap-2">
                                <img [alt]="customer.representative.name" [src]="avatarImage(customer.representative.name)" width="32" style="vertical-align: middle" />
                                <span class="font-bold">{{ customer.representative.name }}</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #groupfooter let-customer>
                    <tr>
                        <td colspan="5" class="text-right font-bold pr-12">Total Customers: {{ calculateCustomerTotal(customer.representative.name) }}</td>
                    </tr>
                </ng-template>
                <ng-template #body let-customer let-rowIndex="rowIndex">
                    <tr>
                        <td>
                            {{ customer.name }}
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <img src="/demo/images/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span>{{ customer.country.name }}</span>
                            </div>
                        </td>
                        <td>
                            {{ customer.company }}
                        </td>
                        <td>
                            <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                        </td>
                        <td>
                            {{ customer.date }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>`,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [ConfirmationService, MessageService]
})
export class TableDemo implements OnInit {
    avatarImage(name?: string): string {
        const initials = (name ?? '')
            .split(' ')
            .map((s) => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        return svgPlaceholder(32, 32, brandColors.navy.hex, initials);
    }

    productImage(name?: string): string {
        return svgPlaceholder(80, 80, undefined, name ?? '');
    }

    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    private static readonly DEMO_CUSTOMERS: Customer[] = [
        {
            id: '1000',
            name: 'Ayşe Kaya',
            country: { name: 'Türkiye', code: 'tr' },
            company: 'Dışişleri Bakanlığı',
            date: new Date('2024-01-15'),
            status: 'qualified',
            activity: 74,
            representative: { name: 'Ali Demir', image: 'ionibowcher.png' },
            balance: 45200,
            verified: true
        },
        {
            id: '1001',
            name: 'Mehmet Yılmaz',
            country: { name: 'Almanya', code: 'de' },
            company: 'Berlin Büyükelçiliği',
            date: new Date('2024-02-20'),
            status: 'new',
            activity: 52,
            representative: { name: 'Fatma Şahin', image: 'annafali.png' },
            balance: 32100,
            verified: false
        },
        {
            id: '1002',
            name: 'Fatma Çelik',
            country: { name: 'Fransa', code: 'fr' },
            company: 'Paris Başkonsolosluğu',
            date: new Date('2024-03-10'),
            status: 'negotiation',
            activity: 88,
            representative: { name: 'Ali Demir', image: 'ionibowcher.png' },
            balance: 67800,
            verified: true
        },
        {
            id: '1003',
            name: 'Ali Şahin',
            country: { name: 'ABD', code: 'us' },
            company: 'Washington Büyükelçiliği',
            date: new Date('2024-04-05'),
            status: 'unqualified',
            activity: 23,
            representative: { name: 'Fatma Şahin', image: 'annafali.png' },
            balance: 18900,
            verified: false
        },
        {
            id: '1004',
            name: 'Zeynep Arslan',
            country: { name: 'İngiltere', code: 'gb' },
            company: 'Londra Başkonsolosluğu',
            date: new Date('2024-05-18'),
            status: 'qualified',
            activity: 91,
            representative: { name: 'Ali Demir', image: 'ionibowcher.png' },
            balance: 89300,
            verified: true
        },
        {
            id: '1005',
            name: 'Mustafa Öztürk',
            country: { name: 'Japonya', code: 'jp' },
            company: 'Tokyo Büyükelçiliği',
            date: new Date('2024-06-22'),
            status: 'renewal',
            activity: 61,
            representative: { name: 'Fatma Şahin', image: 'annafali.png' },
            balance: 54700,
            verified: true
        }
    ];

    ngOnInit() {
        this.customers1 = TableDemo.DEMO_CUSTOMERS;
        this.customers2 = TableDemo.DEMO_CUSTOMERS;
        this.customers3 = TableDemo.DEMO_CUSTOMERS;
        this.products = [
            {
                id: 'P001',
                name: 'Pasaport',
                price: 150,
                category: 'Kimlik Belgesi',
                rating: 5,
                inventoryStatus: 'INSTOCK',
                image: 'product-placeholder.svg',
                orders: [{ id: 'O001', customer: 'Ayşe Kaya', date: '2024-01-15', amount: 150, status: 'DELIVERED' }]
            },
            {
                id: 'P002',
                name: 'Vize Başvurusu',
                price: 80,
                category: 'Vize',
                rating: 4,
                inventoryStatus: 'LOWSTOCK',
                image: 'product-placeholder.svg',
                orders: [{ id: 'O002', customer: 'Mehmet Yılmaz', date: '2024-02-20', amount: 80, status: 'PENDING' }]
            },
            {
                id: 'P003',
                name: 'Apostil',
                price: 45,
                category: 'Belge Onayı',
                rating: 4,
                inventoryStatus: 'INSTOCK',
                image: 'product-placeholder.svg',
                orders: [{ id: 'O003', customer: 'Fatma Çelik', date: '2024-03-10', amount: 45, status: 'DELIVERED' }]
            }
        ];

        this.representatives = [
            { name: 'Ali Demir', image: 'ionibowcher.png' },
            { name: 'Fatma Şahin', image: 'annafali.png' }
        ];

        this.statuses = [
            { label: 'Niteliksiz', value: 'unqualified' },
            { label: 'Nitelikli', value: 'qualified' },
            { label: 'Yeni', value: 'new' },
            { label: 'Müzakere', value: 'negotiation' },
            { label: 'Yenileme', value: 'renewal' },
            { label: 'Teklif', value: 'proposal' }
        ];
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    expandAll() {
        if (ObjectUtils.isEmpty(this.expandedRows)) {
            this.expandedRows = this.products.reduce(
                (acc, p) => {
                    if (p.id) {
                        acc[p.id] = true;
                    }
                    return acc;
                },
                {} as { [key: string]: boolean }
            );
            this.isExpanded = true;
        } else {
            this.collapseAll();
        }
    }

    collapseAll() {
        this.expandedRows = {};
        this.isExpanded = false;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers2) {
            for (let customer of this.customers2) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }
}
