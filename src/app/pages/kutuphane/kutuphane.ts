import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

interface PersonelRow {
    ad: string;
    birim: string;
    durum: string;
}

interface SelectOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-kutuphane',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ButtonGroupModule,
        InputTextModule,
        SelectModule,
        CheckboxModule,
        RadioButtonModule,
        ToggleSwitchModule,
        TextareaModule,
        DatePickerModule,
        MessageModule,
        ToastModule,
        TableModule,
        TagModule,
        BadgeModule,
        OverlayBadgeModule,
        DialogModule,
        PopoverModule,
        DrawerModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        SkeletonModule,
        TabsModule,
        TooltipModule,
        DividerModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-4">
            <!-- Başlık -->
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-book text-2xl" style="color: var(--mfa-red)"></i>
                    <span class="font-bold text-2xl">Bileşen Kütüphanesi</span>
                </div>
                <p class="text-surface-500 m-0 text-sm">
                    T.C. Dışişleri Bakanlığı onaylı PrimeNG bileşenleri. Modül takımları yalnızca bu bileşenleri kullanabilir. Yeni bileşen ihtiyacında önce bu sayfaya eklenir, ardından modülde kullanılır. Palet dışı renk (hardcoded hex, Tailwind
                    arbitrary) yasaktır.
                </p>
                <div class="mt-3">
                    <a routerLink="/pages/kurumsal-kimlik" class="text-sm font-medium underline" style="color: var(--mfa-red)"> <i class="pi pi-arrow-right mr-1"></i>Kurumsal Kimlik Kılavuzu </a>
                </div>
            </div>

            <!-- Sekmeli kütüphane -->
            <div class="card">
                <p-tabs value="0">
                    <p-tablist>
                        <p-tab value="0"><i class="pi pi-send mr-2"></i>Butonlar</p-tab>
                        <p-tab value="1"><i class="pi pi-pencil mr-2"></i>Form</p-tab>
                        <p-tab value="2"><i class="pi pi-bell mr-2"></i>Mesajlar</p-tab>
                        <p-tab value="3"><i class="pi pi-table mr-2"></i>Tablo & Etiketler</p-tab>
                        <p-tab value="4"><i class="pi pi-clone mr-2"></i>Overlay</p-tab>
                        <p-tab value="5"><i class="pi pi-spinner mr-2"></i>Durum</p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- ─── BUTONLAR ───────────────────────────────────────── -->
                        <p-tabpanel value="0">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">Severity Varyantları</div>
                                    <p class="text-surface-500 text-sm mb-3">
                                        MFA renk paletine eşlenmiş severity'ler:
                                        <code>primary</code> = kırmızı, <code>info</code> = lacivert, <code>warn</code> = altın, <code>danger</code> = tehlike kırmızısı.
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Primary" />
                                        <p-button label="Secondary" severity="secondary" />
                                        <p-button label="Info" severity="info" />
                                        <p-button label="Warn" severity="warn" />
                                        <p-button label="Danger" severity="danger" />
                                        <p-button label="Contrast" severity="contrast" />
                                        <p-button label="Help" severity="help" />
                                        <p-button label="Success" severity="success" />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'btnSeverity', code: codes.btnSeverity }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-3">Outlined & Text</div>
                                    <div class="flex flex-wrap gap-2 mb-2">
                                        <p-button label="Primary" outlined />
                                        <p-button label="Info" severity="info" outlined />
                                        <p-button label="Danger" severity="danger" outlined />
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Primary" text />
                                        <p-button label="Info" severity="info" text />
                                        <p-button label="Danger" severity="danger" text />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'btnOutlined', code: codes.btnOutlined }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-3">İkonlu Butonlar</div>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Kaydet" icon="pi pi-save" />
                                        <p-button label="Düzenle" icon="pi pi-pencil" severity="secondary" />
                                        <p-button label="İndir" icon="pi pi-download" outlined />
                                        <p-button icon="pi pi-trash" severity="danger" outlined rounded />
                                        <p-button icon="pi pi-check" rounded />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'btnIcon', code: codes.btnIcon }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Loading Durumu</div>
                                    <p class="text-surface-500 text-sm mb-3">API çağrısı süresince <code>[loading]="true"</code> ile spinner göster.</p>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Kaydediliyor" [loading]="true" />
                                        <p-button label="Yükleniyor" [loading]="true" severity="secondary" />
                                        <p-button label="Siliniyor" [loading]="true" severity="danger" outlined />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'btnLoading', code: codes.btnLoading }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-3">Button Group</div>
                                    <p-buttongroup>
                                        <p-button label="Kaydet" icon="pi pi-check" />
                                        <p-button label="Düzenle" icon="pi pi-pencil" severity="secondary" />
                                        <p-button label="Sil" icon="pi pi-trash" severity="danger" />
                                    </p-buttongroup>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'btnGroup', code: codes.btnGroup }" />
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- ─── FORM ───────────────────────────────────────────── -->
                        <p-tabpanel value="1">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">InputText</div>
                                    <p class="text-surface-500 text-sm mb-3">Tek satır metin girişi. <code>pInputText</code> direktifi PrimeNG stilini uygular.</p>
                                    <div class="flex flex-wrap gap-3">
                                        <input pInputText placeholder="Varsayılan" [(ngModel)]="demoInput" />
                                        <input pInputText placeholder="Devre dışı" disabled />
                                        <input pInputText placeholder="Salt okunur" readonly />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formInput', code: codes.formInput }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Select (Dropdown)</div>
                                    <p class="text-surface-500 text-sm mb-3"><code>optionLabel</code> gösterim alanını, <code>optionValue</code> bağlanacak değer alanını belirtir.</p>
                                    <p-select [options]="birimler" [(ngModel)]="secilenBirim" optionLabel="label" optionValue="value" placeholder="Birim seçiniz" class="w-64" />
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formSelect', code: codes.formSelect }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-3">Checkbox & RadioButton</div>
                                    <div class="flex flex-wrap gap-8">
                                        <div class="flex flex-col gap-2">
                                            <div class="font-medium text-sm mb-1">Checkbox</div>
                                            <div class="flex items-center gap-2">
                                                <p-checkbox [(ngModel)]="check1" [binary]="true" inputId="chk1" />
                                                <label for="chk1">Birinci seçenek</label>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <p-checkbox [(ngModel)]="check2" [binary]="true" inputId="chk2" />
                                                <label for="chk2">İkinci seçenek</label>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <div class="font-medium text-sm mb-1">RadioButton</div>
                                            <div class="flex items-center gap-2">
                                                <p-radiobutton [(ngModel)]="radioVal" value="A" inputId="rb1" />
                                                <label for="rb1">Seçenek A</label>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <p-radiobutton [(ngModel)]="radioVal" value="B" inputId="rb2" />
                                                <label for="rb2">Seçenek B</label>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <p-radiobutton [(ngModel)]="radioVal" value="C" inputId="rb3" />
                                                <label for="rb3">Seçenek C</label>
                                            </div>
                                        </div>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formCheckRadio', code: codes.formCheckRadio }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">ToggleSwitch</div>
                                    <p class="text-surface-500 text-sm mb-3">Açık/kapalı durumu için. Checkbox yerine daha görsel bir alternatif.</p>
                                    <div class="flex items-center gap-3">
                                        <p-toggleswitch [(ngModel)]="toggleVal" inputId="ts1" />
                                        <label for="ts1">{{ toggleVal ? 'Aktif' : 'Pasif' }}</label>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formToggle', code: codes.formToggle }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Textarea</div>
                                    <p class="text-surface-500 text-sm mb-3">Çok satırlı metin. <code>pTextarea</code> direktifi ile PrimeNG teması uygulanır.</p>
                                    <textarea pTextarea rows="3" placeholder="Açıklama giriniz..." [(ngModel)]="textareaVal" class="w-full max-w-md"> </textarea>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formTextarea', code: codes.formTextarea }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">DatePicker</div>
                                    <p class="text-surface-500 text-sm mb-3">Tarih seçici. Türkçe format: <code>dd.mm.yy</code>. Biçimlendirme için <code>Intl.DateTimeFormat('tr-TR')</code> kullan — moment/date-fns yasak.</p>
                                    <p-datepicker [(ngModel)]="dateVal" dateFormat="dd.mm.yy" placeholder="gg.aa.yyyy" />
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'formDate', code: codes.formDate }" />
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- ─── MESAJLAR ───────────────────────────────────────── -->
                        <p-tabpanel value="2">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">Toast</div>
                                    <p class="text-surface-500 text-sm mb-3">Sayfa köşesinde çıkan bildirim. <code>MessageService</code> inject edilir, <code>add()</code> çağrılır. Şablon kökünde <code>&lt;p-toast /&gt;</code> bulunmalı.</p>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Başarılı" severity="success" (click)="toast('success')" />
                                        <p-button label="Bilgi" severity="info" (click)="toast('info')" />
                                        <p-button label="Uyarı" severity="warn" (click)="toast('warn')" />
                                        <p-button label="Hata" severity="danger" (click)="toast('error')" />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'msgToast', code: codes.msgToast }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Inline Mesaj</div>
                                    <p class="text-surface-500 text-sm mb-3">Form alanı yanı veya bölüm içi bildirim. Toast'un aksine sayfa içinde kalır.</p>
                                    <div class="flex flex-col gap-2 max-w-lg">
                                        <p-message severity="success">İşlem başarıyla tamamlandı.</p-message>
                                        <p-message severity="info">Bilgilendirme: Bu alan zorunludur.</p-message>
                                        <p-message severity="warn">Uyarı: Değişiklikler kaydedilmedi.</p-message>
                                        <p-message severity="error">Hata: Dosya boyutu 5 MB sınırını aşıyor.</p-message>
                                        <p-message severity="secondary">İkincil bilgi mesajı.</p-message>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'msgInline', code: codes.msgInline }" />
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- ─── TABLO & ETİKETLER ──────────────────────────────── -->
                        <p-tabpanel value="3">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">Table</div>
                                    <p class="text-surface-500 text-sm mb-3">Sayfalama, sıralama ve satır seçimi dahil. Büyük veri setleri için <code>[virtualScroll]="true"</code> kullanılır.</p>
                                    <p-table [value]="personelData" [paginator]="true" [rows]="3" [rowsPerPageOptions]="[3, 5, 10]" styleClass="p-datatable-sm">
                                        <ng-template #header>
                                            <tr>
                                                <th>Ad Soyad</th>
                                                <th>Birim</th>
                                                <th>Durum</th>
                                            </tr>
                                        </ng-template>
                                        <ng-template #body let-row>
                                            <tr>
                                                <td>{{ row.ad }}</td>
                                                <td>{{ row.birim }}</td>
                                                <td>
                                                    <p-tag [value]="row.durum" [severity]="durumSeverity(row.durum)" />
                                                </td>
                                            </tr>
                                        </ng-template>
                                    </p-table>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'tablo', code: codes.tablo }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Tag</div>
                                    <p class="text-surface-500 text-sm mb-3">Durum, kategori ve kısa etiket gösterimi. Tablo hücrelerinde sık kullanılır.</p>
                                    <div class="flex flex-wrap gap-2">
                                        <p-tag value="Aktif" severity="success" />
                                        <p-tag value="Bekliyor" severity="warn" />
                                        <p-tag value="Pasif" severity="danger" />
                                        <p-tag value="Taslak" severity="secondary" />
                                        <p-tag value="Bilgi" severity="info" />
                                        <p-tag value="MFA" />
                                        <p-tag value="Yeni" icon="pi pi-star" />
                                        <p-tag value="Onaylı" icon="pi pi-check" severity="success" [rounded]="true" />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'tag', code: codes.tag }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Badge & OverlayBadge</div>
                                    <p class="text-surface-500 text-sm mb-3">
                                        Sayısal gösterim ve bildirim rozetleri.
                                        <code>p-overlaybadge</code> ile ikon üzerine bindirilebilir.
                                    </p>
                                    <div class="flex flex-wrap items-center gap-4 mb-4">
                                        <p-badge value="5" />
                                        <p-badge value="12" severity="success" />
                                        <p-badge value="3" severity="warn" />
                                        <p-badge value="99+" severity="danger" />
                                        <p-badge value="0" severity="secondary" />
                                    </div>
                                    <div class="flex flex-wrap items-center gap-6">
                                        <p-overlaybadge value="4" severity="danger">
                                            <i class="pi pi-bell" style="font-size:2rem"></i>
                                        </p-overlaybadge>
                                        <p-overlaybadge value="2">
                                            <i class="pi pi-envelope" style="font-size:2rem"></i>
                                        </p-overlaybadge>
                                        <p-button label="Mesajlar" badge="8" />
                                        <p-button label="Bildirimler" icon="pi pi-bell" severity="warn" badge="3" badgeSeverity="danger" />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'badge', code: codes.badge }" />
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- ─── OVERLAY ─────────────────────────────────────────── -->
                        <p-tabpanel value="4">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">Dialog</div>
                                    <p class="text-surface-500 text-sm mb-3">
                                        Modal pencere. Form, onay ve detay görüntüleme için.
                                        <code>[modal]="true"</code> arka planı karartır.
                                    </p>
                                    <p-dialog header="Personel Detayı" [visible]="dialogVisible()" (visibleChange)="dialogVisible.set($event)" [modal]="true" [style]="{ width: '32rem' }">
                                        <p class="m-0">Bu bir dialog örneğidir. Form veya detay içeriği buraya gelir.</p>
                                        <ng-template #footer>
                                            <p-button label="İptal" severity="secondary" outlined (click)="dialogVisible.set(false)" />
                                            <p-button label="Kaydet" (click)="dialogVisible.set(false)" />
                                        </ng-template>
                                    </p-dialog>
                                    <p-button label="Dialog Aç" icon="pi pi-external-link" (click)="dialogVisible.set(true)" />
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'dialog', code: codes.dialog }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Popover</div>
                                    <p class="text-surface-500 text-sm mb-3">
                                        Tetikleyici öğenin yanında açılan bilgi paneli.
                                        <code>#pop</code> şablon referansıyla <code>pop.toggle($event)</code> çağrılır.
                                    </p>
                                    <p-popover #pop>
                                        <div class="flex flex-col gap-2 p-2">
                                            <div class="font-medium">Ek Bilgi</div>
                                            <p class="m-0 text-sm text-surface-500">
                                                Popover içeriği burada gösterilir.<br />
                                                Birden fazla satır olabilir.
                                            </p>
                                            <p-button label="Tamam" size="small" (click)="pop.hide()" />
                                        </div>
                                    </p-popover>
                                    <p-button label="Popover Aç" icon="pi pi-info-circle" (click)="pop.toggle($event)" />
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'popover', code: codes.popover }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Drawer (Yan Panel)</div>
                                    <p class="text-surface-500 text-sm mb-3">Sayfanın sağından kayan panel. Detay görüntüleme ve uzun formlar için idealdir.</p>
                                    <p-drawer header="Detay Paneli" [visible]="drawerVisible()" (visibleChange)="drawerVisible.set($event)" position="right">
                                        <div class="flex flex-col gap-3">
                                            <p class="m-0 text-sm">Drawer içeriği burada yer alır.</p>
                                            <p-button label="Kapat" severity="secondary" outlined (click)="drawerVisible.set(false)" />
                                        </div>
                                    </p-drawer>
                                    <p-button label="Paneli Aç" icon="pi pi-arrow-right" (click)="drawerVisible.set(true)" />
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'drawer', code: codes.drawer }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Tooltip</div>
                                    <p class="text-surface-500 text-sm mb-3">Ek bağlam için. <code>pTooltip</code> direktifi herhangi bir öğeye eklenir.</p>
                                    <div class="flex flex-wrap gap-3">
                                        <p-button label="Bilgi" pTooltip="Bu buton kayıt oluşturur" tooltipPosition="top" />
                                        <p-button icon="pi pi-trash" severity="danger" outlined pTooltip="Seçili kaydı sil" tooltipPosition="right" />
                                        <span pTooltip="Metin üzerinde de tooltip çalışır" class="underline cursor-help text-sm self-center"> Üzerime gel </span>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'tooltip', code: codes.tooltip }" />
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- ─── DURUM ───────────────────────────────────────────── -->
                        <p-tabpanel value="5">
                            <div class="flex flex-col gap-6 pt-4">
                                <div>
                                    <div class="font-semibold text-base mb-1">ProgressBar</div>
                                    <p class="text-surface-500 text-sm mb-3">Süreç ilerlemesi için. <code>mode="indeterminate"</code> belirsiz süreli işlemler için.</p>
                                    <div class="flex flex-col gap-3 max-w-lg">
                                        <div>
                                            <div class="text-sm text-surface-500 mb-1">Belirli (%65)</div>
                                            <p-progressbar [value]="65" />
                                        </div>
                                        <div>
                                            <div class="text-sm text-surface-500 mb-1">Değer gösterilmez (%30)</div>
                                            <p-progressbar [value]="30" [showValue]="false" />
                                        </div>
                                        <div>
                                            <div class="text-sm text-surface-500 mb-1">Belirsiz (indeterminate)</div>
                                            <p-progressbar mode="indeterminate" [style]="{ height: '6px' }" />
                                        </div>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'progress', code: codes.progress }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">ProgressSpinner</div>
                                    <p class="text-surface-500 text-sm mb-3">
                                        Sayfa veya bileşen düzeyinde yükleme göstergesi.
                                        <code>strokeWidth</code> ile kalınlık ayarlanır.
                                    </p>
                                    <div class="flex flex-wrap gap-6 items-center">
                                        <p-progressspinner strokeWidth="4" [style]="{ width: '3rem', height: '3rem' }" />
                                        <p-progressspinner strokeWidth="6" [style]="{ width: '2rem', height: '2rem' }" />
                                        <p-progressspinner strokeWidth="2" [style]="{ width: '4rem', height: '4rem' }" />
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'spinner', code: codes.spinner }" />
                                </div>

                                <p-divider />

                                <div>
                                    <div class="font-semibold text-base mb-1">Skeleton</div>
                                    <p class="text-surface-500 text-sm mb-3">Veri yüklenirken yer tutucu. <code>&#64;if (isLoading())</code> bloğunda gerçek içeriğin şeklini taklit eder.</p>
                                    <div class="flex flex-col gap-2 max-w-sm">
                                        <p-skeleton width="100%" height="2rem" />
                                        <p-skeleton width="80%" height="1.2rem" />
                                        <p-skeleton width="60%" height="1.2rem" />
                                        <div class="flex gap-3 items-center mt-2">
                                            <p-skeleton shape="circle" size="3rem" />
                                            <div class="flex flex-col gap-2 flex-1">
                                                <p-skeleton width="100%" height="1rem" />
                                                <p-skeleton width="75%" height="1rem" />
                                            </div>
                                        </div>
                                    </div>
                                    <ng-container *ngTemplateOutlet="codeBlock; context: { key: 'skeleton', code: codes.skeleton }" />
                                </div>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
        </div>

        <!-- ─── Kod snippet şablonu ──────────────────────────────────────────── -->
        <ng-template #codeBlock let-key="key" let-code="code">
            <div class="mt-3">
                <p-button [label]="showCodes[key] ? 'Kodu Gizle' : 'Kodu Göster'" [icon]="showCodes[key] ? 'pi pi-chevron-up' : 'pi pi-code'" size="small" severity="secondary" text (click)="toggleCode(key)" />
                @if (showCodes[key]) {
                    <div class="relative mt-1">
                        <pre class="bg-surface-100 rounded-lg p-4 text-sm overflow-auto border border-surface-200 m-0"><code class="text-surface-800">{{ code }}</code></pre>
                        <button class="absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-200 hover:bg-surface-300 text-surface-600 border border-surface-300" (click)="copy(code, key)">
                            <i class="pi pi-copy text-xs"></i>
                            {{ copiedKey() === key ? 'Kopyalandı!' : 'Kopyala' }}
                        </button>
                    </div>
                }
            </div>
        </ng-template>
    `
})
export class Kutuphane {
    private messageService = inject(MessageService);

    // ── Görünürlük sinyalleri ────────────────────────────────────────────
    dialogVisible = signal(false);
    drawerVisible = signal(false);

    // ── Kod blokları göster/gizle ────────────────────────────────────────
    showCodes: Record<string, boolean> = {};
    copiedKey = signal('');

    toggleCode(key: string): void {
        this.showCodes = { ...this.showCodes, [key]: !this.showCodes[key] };
    }

    async copy(text: string, key: string): Promise<void> {
        await navigator.clipboard.writeText(text);
        this.copiedKey.set(key);
        setTimeout(() => this.copiedKey.set(''), 1500);
    }

    // ── Form demo değerleri ──────────────────────────────────────────────
    demoInput = '';
    secilenBirim: string | null = null;
    check1 = false;
    check2 = true;
    radioVal = 'A';
    toggleVal = true;
    textareaVal = '';
    dateVal: Date | null = null;

    readonly birimler: SelectOption[] = [
        { label: 'Vize Dairesi', value: 'vize' },
        { label: 'Pasaport Dairesi', value: 'pasaport' },
        { label: 'Konsolosluk İşleri', value: 'konsolosluk' },
        { label: 'Personel Müdürlüğü', value: 'personel' }
    ];

    // ── Tablo demo verisi ────────────────────────────────────────────────
    readonly personelData: PersonelRow[] = [
        { ad: 'Ahmet Yılmaz', birim: 'Vize Dairesi', durum: 'Aktif' },
        { ad: 'Ayşe Kaya', birim: 'Pasaport Dairesi', durum: 'Aktif' },
        { ad: 'Mehmet Demir', birim: 'Konsolosluk', durum: 'İzinli' },
        { ad: 'Fatma Çelik', birim: 'Personel Müdürlüğü', durum: 'Pasif' },
        { ad: 'Ali Şahin', birim: 'Vize Dairesi', durum: 'Aktif' },
        { ad: 'Zeynep Arslan', birim: 'Konsolosluk', durum: 'Bekliyor' },
        { ad: 'Mustafa Koç', birim: 'Pasaport Dairesi', durum: 'Aktif' }
    ];

    durumSeverity(durum: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        const map: Record<string, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
            Aktif: 'success',
            İzinli: 'warn',
            Pasif: 'danger',
            Bekliyor: 'info'
        };
        return map[durum] ?? 'secondary';
    }

    // ── Toast tetikleyici ────────────────────────────────────────────────
    toast(severity: string): void {
        const messages: Record<string, { summary: string; detail: string }> = {
            success: { summary: 'Başarılı', detail: 'İşlem başarıyla tamamlandı.' },
            info: { summary: 'Bilgi', detail: 'İşlem kuyruğa alındı.' },
            warn: { summary: 'Uyarı', detail: 'Değişiklikler kaydedilmedi.' },
            error: { summary: 'Hata', detail: 'Bir sorun oluştu, tekrar deneyin.' }
        };
        const msg = messages[severity] ?? messages['info'];
        this.messageService.add({ severity, summary: msg.summary, detail: msg.detail, life: 3000 });
    }

    // ── Kod snippet'leri ─────────────────────────────────────────────────
    readonly codes = {
        btnSeverity: `<p-button label="Primary" />
<p-button label="Secondary" severity="secondary" />
<p-button label="Info" severity="info" />
<p-button label="Warn" severity="warn" />
<p-button label="Danger" severity="danger" />
<p-button label="Contrast" severity="contrast" />`,

        btnOutlined: `<!-- Outlined -->
<p-button label="Primary" outlined />
<p-button label="Danger" severity="danger" outlined />

<!-- Text (ghost) -->
<p-button label="Primary" text />
<p-button label="Danger" severity="danger" text />`,

        btnIcon: `<p-button label="Kaydet" icon="pi pi-save" />
<p-button label="Düzenle" icon="pi pi-pencil" severity="secondary" />
<p-button icon="pi pi-trash" severity="danger" outlined rounded />
<p-button icon="pi pi-check" rounded />`,

        btnLoading: `<!-- isLoading sinyalinden bağlanır -->
<p-button label="Kaydediliyor" [loading]="isLoading()" />`,

        btnGroup: `<p-buttongroup>
  <p-button label="Kaydet" icon="pi pi-check" />
  <p-button label="Düzenle" icon="pi pi-pencil" severity="secondary" />
  <p-button label="Sil" icon="pi pi-trash" severity="danger" />
</p-buttongroup>`,

        formInput: `<input pInputText placeholder="Metin giriniz" [(ngModel)]="deger" />
<input pInputText placeholder="Devre dışı" disabled />`,

        formSelect: `// Component'te:
readonly birimler = [
  { label: 'Vize Dairesi', value: 'vize' },
  { label: 'Pasaport', value: 'pasaport' },
];
secilenBirim: string | null = null;

// Şablonda:
<p-select
  [options]="birimler"
  [(ngModel)]="secilenBirim"
  optionLabel="label"
  optionValue="value"
  placeholder="Seçiniz" />`,

        formCheckRadio: `<!-- Checkbox (binary) -->
<p-checkbox [(ngModel)]="onay" [binary]="true" inputId="chk" />
<label for="chk">Onaylıyorum</label>

<!-- RadioButton -->
<p-radiobutton [(ngModel)]="secim" value="A" inputId="rb1" />
<label for="rb1">Seçenek A</label>`,

        formToggle: `<p-toggleswitch [(ngModel)]="aktif" inputId="ts" />
<label for="ts">{{ aktif ? 'Aktif' : 'Pasif' }}</label>`,

        formTextarea: `<textarea
  pTextarea
  rows="4"
  placeholder="Açıklama giriniz..."
  [(ngModel)]="aciklama"
  class="w-full">
</textarea>`,

        formDate: `<p-datepicker
  [(ngModel)]="tarih"
  dateFormat="dd.mm.yy"
  placeholder="gg.aa.yyyy" />

// Biçimlendirme:
new Intl.DateTimeFormat('tr-TR').format(tarih)`,

        msgToast: `// inject et:
private messageService = inject(MessageService);

// Kullan:
this.messageService.add({
  severity: 'success', // success | info | warn | error
  summary: 'Başarılı',
  detail: 'Kayıt oluşturuldu.',
  life: 3000
});

// Şablonda (kök seviyesinde bir kez):
<p-toast />`,

        msgInline: `<p-message severity="success">İşlem tamamlandı.</p-message>
<p-message severity="info">Bilgi mesajı.</p-message>
<p-message severity="warn">Uyarı mesajı.</p-message>
<p-message severity="error">Hata mesajı.</p-message>`,

        tablo: `// Component'te:
readonly data: PersonelRow[] = [
  { ad: 'Ahmet Yılmaz', birim: 'Vize', durum: 'Aktif' },
];

durumSeverity(durum: string) {
  const map = { Aktif: 'success', Pasif: 'danger', İzinli: 'warn' };
  return map[durum] ?? 'secondary';
}

// Şablonda:
<p-table [value]="data" [paginator]="true" [rows]="10">
  <ng-template #header>
    <tr><th>Ad Soyad</th><th>Birim</th><th>Durum</th></tr>
  </ng-template>
  <ng-template #body let-row>
    <tr>
      <td>{{ row.ad }}</td>
      <td>{{ row.birim }}</td>
      <td>
        <p-tag [value]="row.durum" [severity]="durumSeverity(row.durum)" />
      </td>
    </tr>
  </ng-template>
</p-table>`,

        tag: `<p-tag value="Aktif" severity="success" />
<p-tag value="Bekliyor" severity="warn" />
<p-tag value="Pasif" severity="danger" />
<p-tag value="Taslak" severity="secondary" />
<p-tag value="Yeni" icon="pi pi-star" />
<p-tag value="Onaylı" icon="pi pi-check" severity="success" [rounded]="true" />`,

        badge: `<!-- Bağımsız rozet -->
<p-badge value="5" />
<p-badge value="12" severity="success" />
<p-badge value="3" severity="danger" />

<!-- İkon üzerine bindi -->
<p-overlaybadge value="4" severity="danger">
  <i class="pi pi-bell" style="font-size:2rem"></i>
</p-overlaybadge>

<!-- Buton rozeti -->
<p-button label="Mesajlar" badge="8" />`,

        dialog: `// Component'te:
dialogVisible = signal(false);

// Şablonda:
<p-dialog
  header="Başlık"
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [modal]="true"
  [style]="{ width: '32rem' }">
  <p>İçerik buraya gelir.</p>
  <ng-template #footer>
    <p-button label="İptal" severity="secondary" outlined
              (click)="dialogVisible.set(false)" />
    <p-button label="Kaydet" (click)="kaydet()" />
  </ng-template>
</p-dialog>
<p-button label="Aç" (click)="dialogVisible.set(true)" />`,

        popover: `<p-popover #pop>
  <div class="p-3">
    <p class="m-0">Popover içeriği.</p>
    <p-button label="Kapat" size="small" (click)="pop.hide()" />
  </div>
</p-popover>
<p-button label="Aç" (click)="pop.toggle($event)" />`,

        drawer: `// Component'te:
drawerVisible = signal(false);

// Şablonda:
<p-drawer
  header="Detay Paneli"
  [visible]="drawerVisible()"
  (visibleChange)="drawerVisible.set($event)"
  position="right">
  <p>Panel içeriği buraya gelir.</p>
</p-drawer>
<p-button label="Paneli Aç" (click)="drawerVisible.set(true)" />`,

        tooltip: `<p-button label="Kaydet"
  pTooltip="Formu kaydet"
  tooltipPosition="top" />

<p-button icon="pi pi-trash" severity="danger"
  pTooltip="Seçili kaydı sil"
  tooltipPosition="right" />

<span pTooltip="Açıklama metni">Üzerime gel</span>`,

        progress: `<p-progressbar [value]="yuzdeDegeri" />
<p-progressbar [value]="65" [showValue]="false" />
<p-progressbar mode="indeterminate" [style]="{ height: '6px' }" />`,

        spinner: `<p-progressspinner
  strokeWidth="4"
  [style]="{ width: '3rem', height: '3rem' }" />`,

        skeleton: `@if (isLoading()) {
  <p-skeleton width="100%" height="2rem" />
  <p-skeleton width="75%" height="1rem" styleClass="mt-2" />
  <p-skeleton shape="circle" size="3rem" />
} @else {
  <!-- gerçek içerik -->
}`
    } as const;
}
