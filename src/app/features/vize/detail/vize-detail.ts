import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { MfaDatePipe } from '@/app/core/i18n/mfa-date.pipe';
import { PermissionService } from '@/app/core/auth/permission.service';
import { VizeService } from '../vize.service';
import { vizeDurumSeverity } from '../vize.models';

@Component({
    selector: 'app-vize-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, PanelModule, FieldsetModule, ButtonModule, TagModule, MessageModule, ProgressSpinnerModule, TranslatePipe, MfaDatePipe],
    template: `
        <div class="card">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <p-button icon="pi pi-arrow-left" [text]="true" rounded severity="secondary" routerLink="/vize" />
                    <span class="text-xl font-semibold">{{ 'vize.detail.title' | t }}</span>
                </div>
                @if (canYaz() && basvuru()) {
                    <p-button [label]="'vize.detail.edit' | t" icon="pi pi-pencil" [routerLink]="['/vize', basvuru()!.id, 'duzenle']" />
                }
            </div>

            @if (res.isLoading()) {
                <div class="flex justify-center py-8"><p-progressspinner styleClass="w-12 h-12" strokeWidth="4" /></div>
            } @else if (res.error()) {
                <p-message severity="error" [text]="'vize.detail.notFound' | t" />
            } @else if (basvuru(); as b) {
                <p-panel [header]="b.basvuruNo">
                    <div class="grid grid-cols-12 gap-y-4">
                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.col.adSoyad' | t }}</div>
                        <div class="col-span-12 md:col-span-8 font-medium">{{ b.adSoyad }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.col.uyruk' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ b.uyruk }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.col.vizeTipi' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ 'vize.tipi.' + b.vizeTipi | t }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.col.basvuruTarihi' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ b.basvuruTarihi | mfaDate: 'longDate' }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.col.durum' | t }}</div>
                        <div class="col-span-12 md:col-span-8"><p-tag [value]="'vize.durum.' + b.durum | t" [severity]="severity(b.durum)" /></div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.form.konsolosluk' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ b.konsolosluk }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.form.email' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ b.email || ('vize.detail.empty' | t) }}</div>

                        <div class="col-span-12 md:col-span-4 text-muted-color">{{ 'vize.form.not' | t }}</div>
                        <div class="col-span-12 md:col-span-8">{{ b.not || ('vize.detail.empty' | t) }}</div>
                    </div>
                </p-panel>

                <p-fieldset [legend]="'vize.detail.history' | t" [toggleable]="true" styleClass="mt-4">
                    @if (b.durumGecmisi?.length) {
                        <ul class="m-0 flex list-none flex-col gap-3 p-0">
                            @for (kayit of b.durumGecmisi; track $index) {
                                <li class="flex flex-wrap items-center gap-3">
                                    <p-tag [value]="'vize.durum.' + kayit.durum | t" [severity]="severity(kayit.durum)" />
                                    <span class="text-muted-color">{{ kayit.tarih | mfaDate: 'mediumDate' }}</span>
                                    @if (kayit.aciklama) {
                                        <span>— {{ kayit.aciklama }}</span>
                                    }
                                </li>
                            }
                        </ul>
                    } @else {
                        <span class="text-muted-color">{{ 'vize.detail.empty' | t }}</span>
                    }
                </p-fieldset>
            }
        </div>
    `
})
export class VizeDetail {
    private vize = inject(VizeService);
    private route = inject(ActivatedRoute);
    private perm = inject(PermissionService);

    private readonly idSignal = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');
    readonly res = this.vize.get(this.idSignal);
    readonly basvuru = computed(() => this.res.value());

    readonly canYaz = this.perm.hasRole('VIZE_YAZMA');
    readonly severity = vizeDurumSeverity;
}
