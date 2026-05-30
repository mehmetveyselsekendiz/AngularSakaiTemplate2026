import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { MfaDatePipe } from '@/app/core/i18n/mfa-date.pipe';
import { PermissionService } from '@/app/core/auth/permission.service';
import { VizeService } from '../vize.service';
import { VIZE_DURUM_SECENEKLERI, VizeBasvurusu, VizeDurum, VizeQuery, vizeDurumSeverity } from '../vize.models';

@Component({
    selector: 'app-vize-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ToolbarModule, ButtonModule, TagModule, SelectModule, IconFieldModule, InputIconModule, InputTextModule, MessageModule, TooltipModule, ConfirmDialogModule, TranslatePipe, MfaDatePipe],
    providers: [ConfirmationService],
    template: `
        <div class="card">
            <div class="mb-4 text-xl font-semibold">{{ 'vize.list.title' | t }}</div>

            <p-toolbar styleClass="mb-4">
                <ng-template #start>
                    @if (canYaz()) {
                        <p-button [label]="'vize.list.new' | t" icon="pi pi-plus" [routerLink]="['yeni']" />
                    }
                </ng-template>
                <ng-template #end>
                    <div class="flex flex-wrap items-center gap-2">
                        <p-select
                            [options]="durumSecenekleri()"
                            [ngModel]="durumInput()"
                            (ngModelChange)="durumInput.set($event); uygula()"
                            optionLabel="label"
                            optionValue="value"
                            [showClear]="true"
                            [placeholder]="'vize.list.filter.durum' | t"
                            styleClass="w-48"
                        />
                        <p-iconfield iconPosition="left">
                            <p-inputicon class="pi pi-search" />
                            <input pInputText type="text" [ngModel]="aramaInput()" (ngModelChange)="aramaInput.set($event)" (keyup.enter)="uygula()" [placeholder]="'vize.list.search' | t" />
                        </p-iconfield>
                        <p-button [label]="'vize.list.clear' | t" icon="pi pi-filter-slash" severity="secondary" outlined (onClick)="temizle()" />
                    </div>
                </ng-template>
            </p-toolbar>

            @if (res.error()) {
                <div class="flex flex-col items-start gap-3">
                    <p-message severity="error" [text]="'vize.error' | t" />
                    <p-button [label]="'vize.retry' | t" icon="pi pi-refresh" severity="secondary" (onClick)="res.reload()" />
                </div>
            } @else {
                <div style="overflow-x: auto">
                    <p-table
                        [value]="items()"
                        [lazy]="true"
                        [paginator]="true"
                        [rows]="query().pageSize"
                        [first]="query().page * query().pageSize"
                        [totalRecords]="total()"
                        [loading]="res.isLoading()"
                        [rowsPerPageOptions]="[10, 20, 50]"
                        (onLazyLoad)="onLazyLoad($event)"
                        dataKey="id"
                        [tableStyle]="{ 'min-width': '60rem' }"
                    >
                        <ng-template #header>
                            <tr>
                                <th>{{ 'vize.col.basvuruNo' | t }}</th>
                                <th>{{ 'vize.col.adSoyad' | t }}</th>
                                <th>{{ 'vize.col.uyruk' | t }}</th>
                                <th>{{ 'vize.col.vizeTipi' | t }}</th>
                                <th>{{ 'vize.col.basvuruTarihi' | t }}</th>
                                <th>{{ 'vize.col.durum' | t }}</th>
                                <th class="text-right">{{ 'vize.col.islemler' | t }}</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-row>
                            <tr>
                                <td>{{ row.basvuruNo }}</td>
                                <td>{{ row.adSoyad }}</td>
                                <td>{{ row.uyruk }}</td>
                                <td>{{ 'vize.tipi.' + row.vizeTipi | t }}</td>
                                <td>{{ row.basvuruTarihi | mfaDate: 'mediumDate' }}</td>
                                <td><p-tag [value]="'vize.durum.' + row.durum | t" [severity]="severity(row.durum)" /></td>
                                <td class="text-right">
                                    <p-button icon="pi pi-eye" [text]="true" rounded severity="secondary" [routerLink]="[row.id]" [pTooltip]="'vize.action.detail' | t" />
                                    @if (canYaz()) {
                                        <p-button icon="pi pi-pencil" [text]="true" rounded severity="secondary" [routerLink]="[row.id, 'duzenle']" [pTooltip]="'vize.action.edit' | t" />
                                    }
                                    @if (canSil()) {
                                        <p-button icon="pi pi-trash" [text]="true" rounded severity="danger" (onClick)="sil(row)" [pTooltip]="'vize.action.delete' | t" />
                                    }
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="7" class="text-center py-6">{{ 'vize.empty' | t }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            }
        </div>

        <p-confirmdialog />
    `
})
export class VizeList {
    private vize = inject(VizeService);
    private confirm = inject(ConfirmationService);
    private msg = inject(MessageService);
    private perm = inject(PermissionService);
    private ts = inject(TranslateService);

    // Sorgu durumu — tek signal; httpResource buna tepki verir
    readonly query = signal<VizeQuery>({ page: 0, pageSize: 10, durum: '', arama: '' });
    readonly res = this.vize.list(this.query);

    readonly items = computed(() => this.res.value()?.items ?? []);
    readonly total = computed(() => this.res.value()?.total ?? 0);

    // Filtre giriş alanları (uygula() ile query'ye yansır)
    readonly durumInput = signal<VizeDurum | ''>('');
    readonly aramaInput = signal<string>('');

    // Dil değişince select etiketleri güncellensin diye dict() okunur
    readonly durumSecenekleri = computed(() => {
        this.ts.dict();
        return VIZE_DURUM_SECENEKLERI.map((o) => ({ label: this.ts.t('vize.durum.' + o.value), value: o.value }));
    });

    // Rol-bazlı yetki (Signal) — menü ve aksiyonlar buna göre görünür
    readonly canYaz = this.perm.hasRole('VIZE_YAZMA');
    readonly canSil = this.perm.hasRole('VIZE_SIL');

    readonly severity = vizeDurumSeverity;

    onLazyLoad(e: TableLazyLoadEvent): void {
        const rows = e.rows ?? 10;
        const page = Math.floor((e.first ?? 0) / rows);
        if (page === this.query().page && rows === this.query().pageSize) return;
        this.query.set({ ...this.query(), page, pageSize: rows });
    }

    uygula(): void {
        this.query.set({ ...this.query(), page: 0, durum: this.durumInput(), arama: this.aramaInput() });
    }

    temizle(): void {
        this.durumInput.set('');
        this.aramaInput.set('');
        this.query.set({ page: 0, pageSize: this.query().pageSize, durum: '', arama: '' });
    }

    sil(row: VizeBasvurusu): void {
        this.confirm.confirm({
            header: this.ts.t('vize.delete.confirm.header'),
            message: this.ts.t('vize.delete.confirm.message', { no: row.basvuruNo }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.ts.t('vize.delete.confirm.accept'),
            rejectLabel: this.ts.t('vize.delete.confirm.reject'),
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.vize.remove(row.id).subscribe(() => {
                    this.msg.add({ severity: 'success', summary: this.ts.t('vize.delete.success.summary'), detail: this.ts.t('vize.delete.success.detail', { no: row.basvuruNo }) });
                    this.res.reload();
                });
            }
        });
    }
}
