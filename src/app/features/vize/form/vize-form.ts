import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { VizeService } from '../vize.service';
import { VIZE_DURUM_SECENEKLERI, VIZE_TIPI_SECENEKLERI, VizeBasvurusuDto } from '../vize.models';

@Component({
    selector: 'app-vize-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule, SelectModule, DatePickerModule, ButtonModule, FluidModule, TranslatePipe],
    template: `
        <div class="card">
            <div class="mb-4 flex items-center gap-2">
                <p-button icon="pi pi-arrow-left" [text]="true" rounded severity="secondary" (onClick)="iptal()" />
                <span class="text-xl font-semibold">{{ (duzenleMi ? 'vize.form.edit.title' : 'vize.form.new.title') | t }}</span>
            </div>

            <p-fluid>
                <form [formGroup]="form" (ngSubmit)="kaydet()" class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <label for="adSoyad" class="mb-2 block font-medium">{{ 'vize.form.adSoyad' | t }}</label>
                        <input pInputText id="adSoyad" formControlName="adSoyad" />
                        @if (hata('adSoyad')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="uyruk" class="mb-2 block font-medium">{{ 'vize.form.uyruk' | t }}</label>
                        <input pInputText id="uyruk" formControlName="uyruk" />
                        @if (hata('uyruk')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="vizeTipi" class="mb-2 block font-medium">{{ 'vize.form.vizeTipi' | t }}</label>
                        <p-select id="vizeTipi" formControlName="vizeTipi" [options]="tipiSecenekleri()" optionLabel="label" optionValue="value" [placeholder]="'vize.form.placeholder.select' | t" />
                        @if (hata('vizeTipi')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="durum" class="mb-2 block font-medium">{{ 'vize.form.durum' | t }}</label>
                        <p-select id="durum" formControlName="durum" [options]="durumSecenekleri()" optionLabel="label" optionValue="value" [placeholder]="'vize.form.placeholder.select' | t" />
                        @if (hata('durum')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="basvuruTarihi" class="mb-2 block font-medium">{{ 'vize.form.basvuruTarihi' | t }}</label>
                        <p-datepicker id="basvuruTarihi" formControlName="basvuruTarihi" dateFormat="dd.mm.yy" [showIcon]="true" />
                        @if (hata('basvuruTarihi')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="konsolosluk" class="mb-2 block font-medium">{{ 'vize.form.konsolosluk' | t }}</label>
                        <input pInputText id="konsolosluk" formControlName="konsolosluk" />
                        @if (hata('konsolosluk')) {
                            <small class="mfa-hata">{{ 'vize.form.required' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label for="email" class="mb-2 block font-medium">{{ 'vize.form.email' | t }}</label>
                        <input pInputText id="email" type="email" formControlName="email" />
                        @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
                            <small class="mfa-hata">{{ 'vize.form.email.invalid' | t }}</small>
                        }
                    </div>

                    <div class="col-span-12">
                        <label for="not" class="mb-2 block font-medium">{{ 'vize.form.not' | t }}</label>
                        <textarea pTextarea id="not" formControlName="not" rows="3"></textarea>
                    </div>

                    <div class="col-span-12 flex justify-end gap-2">
                        <p-button type="button" [label]="'vize.form.cancel' | t" severity="secondary" (onClick)="iptal()" />
                        <p-button type="submit" [label]="'vize.form.save' | t" icon="pi pi-check" />
                    </div>
                </form>
            </p-fluid>
        </div>
    `,
    styles: [
        `
            .mfa-hata {
                color: var(--mfa-danger);
                margin-top: 0.25rem;
                display: block;
            }
        `
    ]
})
export class VizeForm {
    private fb = inject(FormBuilder);
    private vize = inject(VizeService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private msg = inject(MessageService);
    private ts = inject(TranslateService);

    readonly form = this.fb.group({
        adSoyad: ['', [Validators.required, Validators.maxLength(120)]],
        uyruk: ['', Validators.required],
        vizeTipi: [null as string | null, Validators.required],
        durum: ['beklemede' as string | null, Validators.required],
        basvuruTarihi: [new Date() as Date | null, Validators.required],
        konsolosluk: ['', Validators.required],
        email: ['', Validators.email],
        not: ['', Validators.maxLength(500)]
    });

    readonly duzenleMi: boolean;
    private readonly idSignal = signal<string>('');

    readonly tipiSecenekleri = this.cevirOptions(VIZE_TIPI_SECENEKLERI, 'vize.tipi.');
    readonly durumSecenekleri = this.cevirOptions(VIZE_DURUM_SECENEKLERI, 'vize.durum.');

    constructor() {
        const id = this.route.snapshot.paramMap.get('id');
        this.duzenleMi = !!id;

        if (id) {
            this.idSignal.set(id);
            const res = this.vize.get(this.idSignal);
            // Kayıt gelince formu doldur (ISO tarih → Date)
            effect(() => {
                const v = res.value();
                if (v) {
                    this.form.patchValue({
                        adSoyad: v.adSoyad,
                        uyruk: v.uyruk,
                        vizeTipi: v.vizeTipi,
                        durum: v.durum,
                        basvuruTarihi: new Date(v.basvuruTarihi),
                        konsolosluk: v.konsolosluk,
                        email: v.email ?? '',
                        not: v.not ?? ''
                    });
                }
            });
        }
    }

    /** Dil değişince select etiketleri güncellensin diye dict() okuyan computed üretir */
    private cevirOptions(secenekler: { value: string }[], onek: string) {
        return () => {
            this.ts.dict();
            return secenekler.map((o) => ({ label: this.ts.t(onek + o.value), value: o.value }));
        };
    }

    hata(alan: string): boolean {
        const c = this.form.get(alan);
        return !!c && c.invalid && c.touched;
    }

    kaydet(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        const dto: VizeBasvurusuDto = {
            adSoyad: v.adSoyad!,
            uyruk: v.uyruk!,
            vizeTipi: v.vizeTipi as VizeBasvurusuDto['vizeTipi'],
            durum: v.durum as VizeBasvurusuDto['durum'],
            basvuruTarihi: this.toIso(v.basvuruTarihi!),
            konsolosluk: v.konsolosluk!,
            email: v.email || undefined,
            not: v.not || undefined
        };

        const istek = this.duzenleMi ? this.vize.update(this.idSignal(), dto) : this.vize.create(dto);
        istek.subscribe(() => {
            this.msg.add({
                severity: 'success',
                summary: this.ts.t('vize.form.save.success.summary'),
                detail: this.ts.t(this.duzenleMi ? 'vize.form.update.success.detail' : 'vize.form.create.success.detail')
            });
            void this.router.navigate(['/vize']);
        });
    }

    iptal(): void {
        void this.router.navigate(['/vize']);
    }

    private toIso(d: Date): string {
        // Yerel saat dilimini koruyarak YYYY-MM-DD üret (UTC kaymasını önler)
        const yil = d.getFullYear();
        const ay = String(d.getMonth() + 1).padStart(2, '0');
        const gun = String(d.getDate()).padStart(2, '0');
        return `${yil}-${ay}-${gun}`;
    }
}
