import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { Popover, PopoverModule } from 'primeng/popover';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

interface Product {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    inventoryStatus?: string;
}

/** DynamicDialog içeriği — DialogService.open() ile çalışma zamanında oluşturulur. */
@Component({
    selector: 'app-overlay-dynamic-content',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="flex flex-col gap-4">
            <p class="m-0 leading-normal">Bu içerik DialogService ile çalışma zamanında oluşturuldu. Modüller kayıt detayı, hızlı form veya onay akışı için bu deseni kullanabilir.</p>
            <div class="flex justify-end gap-2">
                <p-button label="Kapat" severity="secondary" [text]="true" (click)="kapat()" />
                <p-button label="Onayla" (click)="onayla()" />
            </div>
        </div>
    `
})
export class OverlayDynamicContent {
    private readonly ref = inject(DynamicDialogRef);

    kapat(): void {
        this.ref.close();
    }

    onayla(): void {
        this.ref.close('onaylandi');
    }
}

@Component({
    selector: 'app-overlay-demo',
    standalone: true,
    imports: [CommonModule, ToastModule, DialogModule, ButtonModule, DrawerModule, PopoverModule, ConfirmPopupModule, ConfirmDialogModule, InputTextModule, FormsModule, TooltipModule, TableModule, ComponentShowcase],
    template: `<div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2 flex flex-col gap-6">
            <app-showcase title="Dialog" snippetId="overlay-dialog" [code]="snippet('overlay-dialog')">
                <!-- snippet:overlay-dialog -->
                <p-dialog header="Dialog" [(visible)]="display" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '30vw' }" [modal]="true">
                    <p class="leading-normal m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <ng-template #footer>
                        <p-button label="Save" (click)="close()" />
                    </ng-template>
                </p-dialog>
                <p-button label="Show" [style]="{ width: 'auto' }" (click)="open()" />
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Popover" snippetId="overlay-popover" [code]="snippet('overlay-popover')">
                <!-- snippet:overlay-popover -->
                <div class="flex flex-wrap gap-2">
                    <p-button type="button" label="Show" (click)="toggleDataTable(op2, $event)" />
                    <p-popover #op2 id="overlay_panel" [style]="{ width: '380px' }">
                        <p-table [value]="products" selectionMode="single" [(selection)]="selectedProduct" dataKey="id" [rows]="5" [paginator]="true" (onRowSelect)="onProductSelect(op2, $event)">
                            <ng-template #header>
                                <tr>
                                    <th pSortableColumn="name" style="width: 60%;">
                                        Ürün Adı
                                        <p-sortIcon field="name" />
                                    </th>
                                    <th pSortableColumn="price" style="width: 40%;">
                                        Fiyat
                                        <p-sortIcon field="price" />
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-product>
                                <tr [pSelectableRow]="product">
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.price | currency: 'TRY' : 'symbol' : '1.2-2' }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-popover>
                    <p-toast />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Tooltip" snippetId="overlay-tooltip" [code]="snippet('overlay-tooltip')">
                <!-- snippet:overlay-tooltip -->
                <div class="inline-flex gap-4">
                    <input pInputText type="text" placeholder="Username" pTooltip="Your username" />
                    <p-button type="button" label="Save" pTooltip="Click to proceed" />
                </div>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="md:w-1/2 flex flex-col gap-6">
            <app-showcase title="Drawer" snippetId="overlay-drawer" [code]="snippet('overlay-drawer')">
                <!-- snippet:overlay-drawer -->
                <p-drawer [(visible)]="visibleLeft" header="Drawer">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </p-drawer>

                <p-drawer [(visible)]="visibleRight" header="Drawer" position="right">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </p-drawer>

                <p-drawer [(visible)]="visibleTop" header="Drawer" position="top">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </p-drawer>

                <p-drawer [(visible)]="visibleBottom" header="Drawer" position="bottom">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </p-drawer>

                <p-drawer [(visible)]="visibleFull" header="Drawer" position="full">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </p-drawer>

                <p-button icon="pi pi-arrow-right" (click)="visibleLeft = true" [style]="{ marginRight: '0.25em' }" />
                <p-button icon="pi pi-arrow-left" (click)="visibleRight = true" [style]="{ marginRight: '0.25em' }" />
                <p-button icon="pi pi-arrow-down" (click)="visibleTop = true" [style]="{ marginRight: '0.25em' }" />
                <p-button icon="pi pi-arrow-up" (click)="visibleBottom = true" [style]="{ marginRight: '0.25em' }" />
                <p-button icon="pi pi-external-link" (click)="visibleFull = true" />
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="ConfirmPopup" snippetId="overlay-confirmpopup" [code]="snippet('overlay-confirmpopup')">
                <!-- snippet:overlay-confirmpopup -->
                <p-confirmpopup key="confirm2"></p-confirmpopup>
                <p-button #popup (click)="confirm($event)" icon="pi pi-check" label="Confirm" class="mr-2"></p-button>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="ConfirmDialog" snippetId="overlay-confirmdialog" [code]="snippet('overlay-confirmdialog')" description="Servis tabanlı modal onay (ConfirmationService) — silme/kritik işlemler için.">
                <!-- snippet:overlay-confirmdialog -->
                <p-confirmdialog />
                <p-button label="Sil" icon="pi pi-trash" severity="danger" [style]="{ width: 'auto' }" (click)="confirmDelete()" />
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="DynamicDialog" snippetId="overlay-dynamicdialog" [code]="snippet('overlay-dynamicdialog')" description="DialogService ile çalışma zamanında bileşen yükleyen dialog; sonucu onClose ile döner.">
                <!-- snippet:overlay-dynamicdialog -->
                <p-button label="Detayı Aç" icon="pi pi-window-maximize" [style]="{ width: 'auto' }" (click)="openDynamic()" />
                <!-- /snippet -->
            </app-showcase>
        </div>
    </div>`,
    providers: [ConfirmationService, MessageService, DialogService]
})
export class OverlayDemo implements OnInit {
    private readonly snippets = inject(SnippetService).forPage('overlaydemo');

    private readonly dialogService = inject(DialogService);

    private dynamicRef: DynamicDialogRef | null = null;

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    display: boolean = false;

    products: Product[] = [];

    visibleLeft: boolean = false;

    visibleRight: boolean = false;

    visibleTop: boolean = false;

    visibleBottom: boolean = false;

    visibleFull: boolean = false;

    selectedProduct!: Product;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.products = [
            { id: '1000', name: 'Bamboo Watch', price: 65, image: 'bamboo-watch.jpg', inventoryStatus: 'INSTOCK' },
            { id: '1001', name: 'Black Watch', price: 72, image: 'black-watch.jpg', inventoryStatus: 'INSTOCK' },
            { id: '1002', name: 'Blue Band', price: 79, image: 'blue-band.jpg', inventoryStatus: 'LOWSTOCK' },
            { id: '1003', name: 'Blue T-Shirt', price: 29, image: 'blue-t-shirt.jpg', inventoryStatus: 'INSTOCK' },
            { id: '1004', name: 'Bracelet', price: 15, image: 'bracelet.jpg', inventoryStatus: 'INSTOCK' }
        ];
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Save'
            },
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted'
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected'
                });
            }
        });
    }

    open() {
        this.display = true;
    }

    close() {
        this.display = false;
    }

    toggleDataTable(op: Popover, event: any) {
        op.toggle(event);
    }

    onProductSelect(op: Popover, event: any) {
        op.hide();
        this.messageService.add({
            severity: 'info',
            summary: 'Product Selected',
            detail: event?.data.name,
            life: 3000
        });
    }

    confirmDelete() {
        this.confirmationService.confirm({
            message: 'Bu kaydı kalıcı olarak silmek istediğinize emin misiniz?',
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'İptal',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Sil',
                severity: 'danger'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Onaylandı', detail: 'Kayıt silindi.' });
            },
            reject: () => {
                this.messageService.add({ severity: 'warn', summary: 'İptal', detail: 'İşlem iptal edildi.' });
            }
        });
    }

    openDynamic() {
        this.dynamicRef = this.dialogService.open(OverlayDynamicContent, {
            header: 'Kayıt Detayı',
            width: '30rem',
            modal: true,
            breakpoints: { '960px': '75vw' }
        });
        this.dynamicRef?.onClose.subscribe((sonuc) => {
            if (sonuc) {
                this.messageService.add({ severity: 'success', summary: 'Tamam', detail: 'Dinamik dialog onaylandı.' });
            }
        });
    }
}
