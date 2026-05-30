import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { FluidModule } from 'primeng/fluid';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

interface Basvuru {
    id: string;
    ad: string;
    tur: string;
    ulke: string;
    durum: string;
}

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

/**
 * Kurumsal Desenler — modüllerin kopyala-yapıştır kullanacağı kompozit kalıplar.
 * Her kalıp <app-showcase> içinde; tümü MFA paletinden (severity / var(--mfa-*)) beslenir,
 * Reactive Forms ve PrimeNG built-in bileşenleri kullanır. Sıfır dış paket (CLAUDE.md §3).
 */
@Component({
    selector: 'app-patterns-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        MultiSelectModule,
        DatePickerModule,
        PanelModule,
        FieldsetModule,
        TagModule,
        FluidModule,
        ConfirmDialogModule,
        ToastModule,
        StepperModule,
        AvatarModule,
        BadgeModule,
        ProgressBarModule,
        ComponentShowcase
    ],
    template: `
        <div class="flex flex-col gap-6">
            <app-showcase title="Sayfa Başlığı (Page Header)" snippetId="pattern-page-header" [code]="snippet('pattern-page-header')" description="Başlık + breadcrumb + sağda birincil aksiyonlar. Her modül sayfasının üst şeridi.">
                <!-- snippet:pattern-page-header -->
                <div class="flex flex-col gap-3">
                    <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome" />
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 class="text-2xl font-semibold m-0">Vize Başvuruları</h2>
                            <span class="text-muted-color">Tüm başvuruları görüntüleyin ve yönetin</span>
                        </div>
                        <div class="flex gap-2">
                            <p-button label="Dışa Aktar" icon="pi pi-download" severity="secondary" [outlined]="true" />
                            <p-button label="Yeni Başvuru" icon="pi pi-plus" />
                        </div>
                    </div>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Tablo + Araç Çubuğu" snippetId="pattern-table-toolbar" [code]="snippet('pattern-table-toolbar')" description="Araç çubuğu (toplu aksiyon + arama) ile listeleme tablosu; sayfalama ve çoklu seçim.">
                <!-- snippet:pattern-table-toolbar -->
                <p-toolbar styleClass="mb-4">
                    <ng-template #start>
                        <p-button label="Yeni" icon="pi pi-plus" class="mr-2" />
                        <p-button label="Sil" icon="pi pi-trash" severity="danger" [outlined]="true" [disabled]="!selectedBasvurular.length" />
                    </ng-template>
                    <ng-template #end>
                        <p-iconfield iconPosition="left">
                            <p-inputicon class="pi pi-search" />
                            <input pInputText type="text" placeholder="Ara" />
                        </p-iconfield>
                    </ng-template>
                </p-toolbar>
                <p-table [value]="basvurular" [(selection)]="selectedBasvurular" dataKey="id" [rows]="5" [paginator]="true" [rowHover]="true">
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                            <th>Başvuru No</th>
                            <th>Ad Soyad</th>
                            <th>Tür</th>
                            <th>Ülke</th>
                            <th>Durum</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-b>
                        <tr>
                            <td><p-tableCheckbox [value]="b" /></td>
                            <td>{{ b.id }}</td>
                            <td>{{ b.ad }}</td>
                            <td>{{ b.tur }}</td>
                            <td>{{ b.ulke }}</td>
                            <td><p-tag [value]="b.durum" [severity]="durumSeverity(b.durum)" /></td>
                        </tr>
                    </ng-template>
                </p-table>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Form Kartı (Reactive Forms)" snippetId="pattern-form-card" [code]="snippet('pattern-form-card')" description="p-fluid düzeninde doğrulamalı Reactive Form; kaydet/iptal aksiyonları (CLAUDE.md §7).">
                <!-- snippet:pattern-form-card -->
                <form [formGroup]="basvuruForm" (ngSubmit)="kaydet()">
                    <p-fluid>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex flex-col gap-2 md:w-1/2">
                                <label for="p-ad">Ad Soyad</label>
                                <input pInputText id="p-ad" formControlName="ad" />
                                @if (basvuruForm.get('ad')?.invalid && basvuruForm.get('ad')?.touched) {
                                    <small [style.color]="'var(--mfa-danger)'">Ad Soyad zorunludur.</small>
                                }
                            </div>
                            <div class="flex flex-col gap-2 md:w-1/2">
                                <label for="p-email">E-posta</label>
                                <input pInputText id="p-email" formControlName="email" />
                                @if (basvuruForm.get('email')?.invalid && basvuruForm.get('email')?.touched) {
                                    <small [style.color]="'var(--mfa-danger)'">Geçerli bir e-posta girin.</small>
                                }
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 mt-4">
                            <label for="p-tur">Başvuru Türü</label>
                            <p-select id="p-tur" formControlName="tur" [options]="turler" optionLabel="label" optionValue="value" placeholder="Seçin" />
                        </div>
                        <div class="flex flex-col gap-2 mt-4">
                            <label for="p-aciklama">Açıklama</label>
                            <textarea pTextarea id="p-aciklama" formControlName="aciklama" rows="3"></textarea>
                        </div>
                    </p-fluid>
                    <div class="flex justify-end gap-2 mt-4">
                        <p-button label="İptal" severity="secondary" [text]="true" type="button" (click)="sifirla()" />
                        <p-button label="Kaydet" icon="pi pi-check" type="submit" [disabled]="basvuruForm.invalid" />
                    </div>
                </form>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Boş Durum (Empty State)" snippetId="pattern-empty-state" [code]="snippet('pattern-empty-state')" description="Veri yokken gösterilecek ikon + mesaj + birincil aksiyon.">
                <!-- snippet:pattern-empty-state -->
                <div class="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <i class="pi pi-inbox" [style.fontSize]="'3rem'" [style.color]="'var(--mfa-text-muted)'"></i>
                    <div>
                        <h3 class="text-xl font-semibold m-0 mb-1">Henüz başvuru yok</h3>
                        <p class="text-muted-color m-0">İlk başvurunuzu oluşturarak başlayın.</p>
                    </div>
                    <p-button label="Yeni Başvuru Oluştur" icon="pi pi-plus" />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="İstatistik Kartları (Stat Cards)" snippetId="pattern-stat-cards" [code]="snippet('pattern-stat-cards')" description="Dashboard özet kartları; MFA palet varyasyonları (kırmızı/lacivert/altın/gri) + trend.">
                <!-- snippet:pattern-stat-cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    @for (s of statCards; track s.label) {
                        <div class="p-4 border border-surface rounded-border bg-surface-0 dark:bg-surface-900">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="block text-muted-color font-medium mb-1">{{ s.label }}</span>
                                    <div class="text-2xl font-semibold">{{ s.value }}</div>
                                </div>
                                <div class="flex items-center justify-center rounded-border" [style.width]="'2.5rem'" [style.height]="'2.5rem'" [style.background]="s.bg">
                                    <i [class]="s.icon" [style.color]="s.color"></i>
                                </div>
                            </div>
                            <span class="text-sm inline-flex items-center gap-1 mt-2" [style.color]="s.trendColor"><i [class]="s.trendIcon"></i> {{ s.trend }}</span>
                        </div>
                    }
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Filtre Çubuğu" snippetId="pattern-filter-bar" [code]="snippet('pattern-filter-bar')" description="Liste üstü filtre satırı: durum + ülke + tarih + temizle.">
                <!-- snippet:pattern-filter-bar -->
                <div class="flex flex-col md:flex-row gap-3 md:items-end">
                    <div class="flex flex-col gap-1 md:w-1/4">
                        <label class="text-sm">Durum</label>
                        <p-select [options]="durumlar" [(ngModel)]="filtreDurum" optionLabel="label" placeholder="Tümü" [showClear]="true" />
                    </div>
                    <div class="flex flex-col gap-1 md:w-1/4">
                        <label class="text-sm">Ülke</label>
                        <p-multiselect [options]="ulkeler" [(ngModel)]="filtreUlkeler" optionLabel="label" placeholder="Seçin" />
                    </div>
                    <div class="flex flex-col gap-1 md:w-1/4">
                        <label class="text-sm">Tarih</label>
                        <p-datepicker [(ngModel)]="filtreTarih" [showIcon]="true" />
                    </div>
                    <p-button label="Temizle" icon="pi pi-filter-slash" severity="secondary" [outlined]="true" (click)="filtreTemizle()" />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Onay Akışı (Silme)" snippetId="pattern-confirm-flow" [code]="snippet('pattern-confirm-flow')" description="Kritik işlem öncesi ConfirmDialog + sonuç bildirimi (Toast).">
                <!-- snippet:pattern-confirm-flow -->
                <p-confirmdialog />
                <p-toast />
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span>Seçili kaydı kalıcı olarak silmek için:</span>
                    <p-button label="Kaydı Sil" icon="pi pi-trash" severity="danger" [style]="{ width: 'auto' }" (click)="silOnayi()" />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Detay / Özet Paneli" snippetId="pattern-detail-panel" [code]="snippet('pattern-detail-panel')" description="Alan-değer listesi (p-panel) + durum geçmişi (p-fieldset); katlanabilir.">
                <!-- snippet:pattern-detail-panel -->
                <div class="flex flex-col gap-4">
                    <p-panel header="Başvuru Bilgileri" [toggleable]="true">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            @for (alan of detayAlanlari; track alan.etiket) {
                                <div class="flex flex-col">
                                    <span class="text-sm text-muted-color">{{ alan.etiket }}</span>
                                    <span class="font-medium">{{ alan.deger }}</span>
                                </div>
                            }
                        </div>
                    </p-panel>
                    <p-fieldset legend="Durum Geçmişi" [toggleable]="true">
                        <ul class="m-0 pl-4 flex flex-col gap-2">
                            @for (olay of durumGecmisi; track olay.tarih) {
                                <li>
                                    <span class="font-medium">{{ olay.durum }}</span>
                                    <span class="text-muted-color"> — {{ olay.tarih }}</span>
                                </li>
                            }
                        </ul>
                    </p-fieldset>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase
                title="Durum Rozeti Kataloğu"
                snippetId="pattern-status-catalog"
                [code]="snippet('pattern-status-catalog')"
                description="İş durumlarının tek-tip severity + ikon eşlemesi. Modüller, durum renklerini tutarlı tutmak için bu kataloğu kopyalar."
            >
                <!-- snippet:pattern-status-catalog -->
                <div class="flex flex-wrap gap-3">
                    @for (d of durumKatalogu; track d.etiket) {
                        <p-tag [value]="d.etiket" [severity]="d.severity" [icon]="d.icon" />
                    }
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase
                title="Marka Aksanlı Bilgi Kartları"
                snippetId="pattern-notice-cards"
                [code]="snippet('pattern-notice-cards')"
                description="Sol kenar marka-renkli (lacivert/kırmızı/altın/gri) şeritli içerik kartları. Renk varyasyonu; zemin color-mix ile dark mode'a uyar."
            >
                <!-- snippet:pattern-notice-cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @for (n of bildirimKartlari; track n.baslik) {
                        <div class="flex gap-3 p-4 rounded-border" [style.background]="n.bg" [style.borderLeft]="'4px solid ' + n.renk">
                            <i [class]="n.icon" [style.color]="n.renk" [style.fontSize]="'1.5rem'"></i>
                            <div>
                                <h4 class="m-0 mb-1 font-semibold">{{ n.baslik }}</h4>
                                <p class="m-0 text-sm text-muted-color">{{ n.mesaj }}</p>
                            </div>
                        </div>
                    }
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Süreç Adımları (Stepper)" snippetId="pattern-process-steps" [code]="snippet('pattern-process-steps')" description="Çok aşamalı başvuru sürecinin yatay göstergesi; aktif adım marka rengiyle vurgulanır.">
                <!-- snippet:pattern-process-steps -->
                <p-stepper [value]="2">
                    <p-step-list>
                        <p-step [value]="1">Başvuru Alındı</p-step>
                        <p-step [value]="2">Belge İncelemesi</p-step>
                        <p-step [value]="3">Karar</p-step>
                        <p-step [value]="4">Sonuç</p-step>
                    </p-step-list>
                </p-stepper>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Atama / Kişi Şeridi" snippetId="pattern-user-row" [code]="snippet('pattern-user-row')" description="Avatar + ad + iletişim + rol rozeti. 'Atanan memur' veya 'başvuran' gösterimi; avatar zemini MFA paletinden.">
                <!-- snippet:pattern-user-row -->
                <div class="flex flex-col gap-3">
                    @for (k of kisiler; track k.ad) {
                        <div class="flex items-center gap-3 p-3 border border-surface rounded-border">
                            <p-avatar [label]="k.basHarf" shape="circle" [style]="{ background: k.bg, color: k.renk }" />
                            <div class="flex-1">
                                <div class="font-medium">{{ k.ad }}</div>
                                <div class="text-sm text-muted-color">{{ k.email }}</div>
                            </div>
                            <p-tag [value]="k.rol" [severity]="k.rolSeverity" />
                        </div>
                    }
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase
                title="Bölümlenmiş Form (Fieldset)"
                snippetId="pattern-sectioned-form"
                [code]="snippet('pattern-sectioned-form')"
                description="Çok bölümlü kurumsal form: Kişisel / İletişim / Başvuru grupları p-fieldset ile ayrılır (Reactive Forms)."
            >
                <!-- snippet:pattern-sectioned-form -->
                <form [formGroup]="kayitForm" (ngSubmit)="kayitGonder()">
                    <p-fluid class="flex flex-col gap-4">
                        <p-fieldset legend="Kişisel Bilgiler">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex flex-col gap-2 md:w-1/2">
                                    <label for="k-ad">Ad</label>
                                    <input pInputText id="k-ad" formControlName="ad" />
                                </div>
                                <div class="flex flex-col gap-2 md:w-1/2">
                                    <label for="k-soyad">Soyad</label>
                                    <input pInputText id="k-soyad" formControlName="soyad" />
                                </div>
                            </div>
                        </p-fieldset>
                        <p-fieldset legend="İletişim">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex flex-col gap-2 md:w-1/2">
                                    <label for="k-eposta">E-posta</label>
                                    <input pInputText id="k-eposta" formControlName="eposta" />
                                </div>
                                <div class="flex flex-col gap-2 md:w-1/2">
                                    <label for="k-telefon">Telefon</label>
                                    <input pInputText id="k-telefon" formControlName="telefon" />
                                </div>
                            </div>
                        </p-fieldset>
                        <p-fieldset legend="Başvuru Detayı">
                            <div class="flex flex-col gap-2">
                                <label for="k-tur">Başvuru Türü</label>
                                <p-select id="k-tur" formControlName="tur" [options]="turler" optionLabel="label" optionValue="value" placeholder="Seçin" />
                            </div>
                        </p-fieldset>
                    </p-fluid>
                    <div class="flex justify-end gap-2 mt-4">
                        <p-button label="Vazgeç" severity="secondary" [text]="true" type="button" (click)="kayitForm.reset()" />
                        <p-button label="Gönder" icon="pi pi-send" type="submit" [disabled]="kayitForm.invalid" />
                    </div>
                </form>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="İlerleme / Kota Paneli" snippetId="pattern-progress-panel" [code]="snippet('pattern-progress-panel')" description="Tamamlanma yüzdesi / kontenjan göstergesi; marka renkli p-progressbar + durum rozeti.">
                <!-- snippet:pattern-progress-panel -->
                <div class="flex flex-col gap-4">
                    @for (p of ilerlemeler; track p.etiket) {
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-center">
                                <span class="font-medium">{{ p.etiket }}</span>
                                <p-tag [value]="p.deger + '%'" [severity]="p.severity" />
                            </div>
                            <p-progressbar [value]="p.deger" [showValue]="false" />
                            <span class="text-sm text-muted-color">{{ p.aciklama }}</span>
                        </div>
                    }
                </div>
                <!-- /snippet -->
            </app-showcase>
        </div>
    `,
    providers: [ConfirmationService, MessageService]
})
export class PatternsDemo {
    private readonly snippets = inject(SnippetService).forPage('patternsdemo');
    private readonly fb = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

    breadcrumbItems: MenuItem[] = [{ label: 'Vize' }, { label: 'Başvurular' }];

    basvurular: Basvuru[] = [
        { id: 'V-1001', ad: 'Ayşe Kaya', tur: 'Turistik', ulke: 'Almanya', durum: 'Onaylandı' },
        { id: 'V-1002', ad: 'Mehmet Yılmaz', tur: 'Öğrenci', ulke: 'Fransa', durum: 'Beklemede' },
        { id: 'V-1003', ad: 'Fatma Çelik', tur: 'Çalışma', ulke: 'ABD', durum: 'Reddedildi' },
        { id: 'V-1004', ad: 'Ali Şahin', tur: 'Turistik', ulke: 'İngiltere', durum: 'Onaylandı' },
        { id: 'V-1005', ad: 'Zeynep Arslan', tur: 'Aile', ulke: 'Hollanda', durum: 'Beklemede' },
        { id: 'V-1006', ad: 'Mustafa Öztürk', tur: 'Öğrenci', ulke: 'Japonya', durum: 'Onaylandı' }
    ];

    selectedBasvurular: Basvuru[] = [];

    basvuruForm = this.fb.group({
        ad: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        tur: [null as string | null, Validators.required],
        aciklama: ['']
    });

    turler = [
        { label: 'Turistik', value: 'turistik' },
        { label: 'Öğrenci', value: 'ogrenci' },
        { label: 'Çalışma', value: 'calisma' },
        { label: 'Aile Birleşimi', value: 'aile' }
    ];

    statCards = [
        { label: 'Toplam Başvuru', value: '1.248', icon: 'pi pi-file', color: 'var(--mfa-red)', bg: 'color-mix(in srgb, var(--mfa-red) 12%, transparent)', trend: '+12% bu ay', trendIcon: 'pi pi-arrow-up', trendColor: 'var(--mfa-navy)' },
        { label: 'Onaylanan', value: '932', icon: 'pi pi-check-circle', color: 'var(--mfa-navy)', bg: 'color-mix(in srgb, var(--mfa-navy) 12%, transparent)', trend: '+8% bu ay', trendIcon: 'pi pi-arrow-up', trendColor: 'var(--mfa-navy)' },
        { label: 'Bekleyen', value: '214', icon: 'pi pi-clock', color: 'var(--mfa-gold)', bg: 'color-mix(in srgb, var(--mfa-gold) 16%, transparent)', trend: '-3% bu ay', trendIcon: 'pi pi-arrow-down', trendColor: 'var(--mfa-gray)' },
        { label: 'Reddedilen', value: '102', icon: 'pi pi-times-circle', color: 'var(--mfa-danger)', bg: 'color-mix(in srgb, var(--mfa-danger) 12%, transparent)', trend: '+1% bu ay', trendIcon: 'pi pi-arrow-up', trendColor: 'var(--mfa-gray)' }
    ];

    durumlar = [
        { label: 'Onaylandı', value: 'onaylandi' },
        { label: 'Beklemede', value: 'beklemede' },
        { label: 'Reddedildi', value: 'reddedildi' }
    ];

    ulkeler = [
        { label: 'Almanya', value: 'de' },
        { label: 'Fransa', value: 'fr' },
        { label: 'ABD', value: 'us' },
        { label: 'İngiltere', value: 'gb' },
        { label: 'Hollanda', value: 'nl' }
    ];

    filtreDurum: any = null;

    filtreUlkeler: any[] = [];

    filtreTarih: Date | null = null;

    detayAlanlari = [
        { etiket: 'Başvuru No', deger: 'V-1001' },
        { etiket: 'Ad Soyad', deger: 'Ayşe Kaya' },
        { etiket: 'Başvuru Türü', deger: 'Turistik Vize' },
        { etiket: 'Ülke', deger: 'Almanya' },
        { etiket: 'Başvuru Tarihi', deger: '12/01/2026' },
        { etiket: 'Durum', deger: 'Onaylandı' }
    ];

    durumGecmisi = [
        { durum: 'Başvuru alındı', tarih: '12/01/2026' },
        { durum: 'Belge kontrolü tamamlandı', tarih: '15/01/2026' },
        { durum: 'Onaylandı', tarih: '20/01/2026' }
    ];

    durumKatalogu: { etiket: string; severity: TagSeverity; icon: string }[] = [
        { etiket: 'Onaylandı', severity: 'success', icon: 'pi pi-check-circle' },
        { etiket: 'Beklemede', severity: 'warn', icon: 'pi pi-clock' },
        { etiket: 'İşlemde', severity: 'info', icon: 'pi pi-sync' },
        { etiket: 'Reddedildi', severity: 'danger', icon: 'pi pi-times-circle' },
        { etiket: 'Taslak', severity: 'secondary', icon: 'pi pi-pencil' },
        { etiket: 'İptal', severity: 'contrast', icon: 'pi pi-ban' }
    ];

    bildirimKartlari = [
        { baslik: 'Bilgilendirme', mesaj: 'Başvurunuz sıraya alındı; ortalama işlem süresi 5 iş günüdür.', icon: 'pi pi-info-circle', renk: 'var(--mfa-navy)', bg: 'color-mix(in srgb, var(--mfa-navy) 10%, transparent)' },
        { baslik: 'Önemli', mesaj: 'Eksik belgeniz var; lütfen pasaport fotokopisini yükleyin.', icon: 'pi pi-exclamation-circle', renk: 'var(--mfa-red)', bg: 'color-mix(in srgb, var(--mfa-red) 10%, transparent)' },
        { baslik: 'Uyarı', mesaj: 'Randevu tarihinize 3 gün kaldı; değişiklik için son gün bugün.', icon: 'pi pi-exclamation-triangle', renk: 'var(--mfa-gold)', bg: 'color-mix(in srgb, var(--mfa-gold) 16%, transparent)' },
        { baslik: 'İpucu', mesaj: 'Başvuru durumunuzu e-Devlet üzerinden de takip edebilirsiniz.', icon: 'pi pi-lightbulb', renk: 'var(--mfa-gray)', bg: 'color-mix(in srgb, var(--mfa-gray) 12%, transparent)' }
    ];

    kisiler: { ad: string; basHarf: string; email: string; rol: string; rolSeverity: TagSeverity; renk: string; bg: string }[] = [
        { ad: 'Selin Demir', basHarf: 'SD', email: 'selin.demir@mfa.gov.tr', rol: 'Konsolos', rolSeverity: 'danger', renk: 'var(--mfa-brand-fg)', bg: 'var(--mfa-red)' },
        { ad: 'Ahmet Yıldız', basHarf: 'AY', email: 'ahmet.yildiz@mfa.gov.tr', rol: 'Uzman', rolSeverity: 'info', renk: 'var(--mfa-brand-fg)', bg: 'var(--mfa-navy)' },
        { ad: 'Elif Korkmaz', basHarf: 'EK', email: 'elif.korkmaz@mfa.gov.tr', rol: 'Memur', rolSeverity: 'secondary', renk: 'var(--mfa-text)', bg: 'color-mix(in srgb, var(--mfa-gray) 25%, transparent)' }
    ];

    kayitForm = this.fb.group({
        ad: ['', Validators.required],
        soyad: ['', Validators.required],
        eposta: ['', [Validators.required, Validators.email]],
        telefon: [''],
        tur: [null as string | null, Validators.required]
    });

    ilerlemeler: { etiket: string; deger: number; severity: TagSeverity; aciklama: string }[] = [
        { etiket: 'Belge Tamamlanma', deger: 80, severity: 'success', aciklama: '5 belgeden 4 tanesi yüklendi.' },
        { etiket: 'Randevu Kontenjanı', deger: 45, severity: 'warn', aciklama: 'Bu hafta 45 / 100 randevu doldu.' },
        { etiket: 'İnceleme İlerlemesi', deger: 30, severity: 'info', aciklama: 'Başvuru değerlendirme aşamasında.' }
    ];

    kayitGonder(): void {
        if (this.kayitForm.invalid) {
            this.kayitForm.markAllAsTouched();
            return;
        }
        this.messageService.add({ severity: 'success', summary: 'Gönderildi', detail: 'Kayıt başarıyla gönderildi.' });
    }

    durumSeverity(durum: string): 'success' | 'warn' | 'danger' | 'info' {
        switch (durum) {
            case 'Onaylandı':
                return 'success';
            case 'Beklemede':
                return 'warn';
            case 'Reddedildi':
                return 'danger';
            default:
                return 'info';
        }
    }

    kaydet(): void {
        if (this.basvuruForm.invalid) {
            this.basvuruForm.markAllAsTouched();
            return;
        }
        this.messageService.add({ severity: 'success', summary: 'Kaydedildi', detail: 'Başvuru kaydedildi.' });
    }

    sifirla(): void {
        this.basvuruForm.reset();
    }

    filtreTemizle(): void {
        this.filtreDurum = null;
        this.filtreUlkeler = [];
        this.filtreTarih = null;
    }

    silOnayi(): void {
        this.confirmationService.confirm({
            message: 'Bu kaydı kalıcı olarak silmek istediğinize emin misiniz?',
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'İptal', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Sil', severity: 'danger' },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Silindi', detail: 'Kayıt silindi.' });
            },
            reject: () => {
                this.messageService.add({ severity: 'warn', summary: 'İptal', detail: 'İşlem iptal edildi.' });
            }
        });
    }
}
