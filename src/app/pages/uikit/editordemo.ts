import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-editor-demo',
    standalone: true,
    imports: [FormsModule, EditorModule, ButtonModule, MessageModule],
    template: `
        <div class="flex flex-col gap-8">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Zengin Metin Editörü (p-editor)</div>
                <p-editor [(ngModel)]="icerik" [style]="{ height: '320px' }">
                    <ng-template #header>
                        <span class="ql-formats">
                            <select class="ql-header"></select>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-bold"></button>
                            <button class="ql-italic"></button>
                            <button class="ql-underline"></button>
                            <button class="ql-strike"></button>
                        </span>
                        <span class="ql-formats">
                            <select class="ql-color"></select>
                            <select class="ql-background"></select>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-list" value="ordered"></button>
                            <button class="ql-list" value="bullet"></button>
                            <button class="ql-indent" value="-1"></button>
                            <button class="ql-indent" value="+1"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-align" value=""></button>
                            <button class="ql-align" value="center"></button>
                            <button class="ql-align" value="right"></button>
                            <button class="ql-align" value="justify"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-link"></button>
                            <button class="ql-image"></button>
                            <button class="ql-code-block"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-clean"></button>
                        </span>
                    </ng-template>
                </p-editor>
                <div class="flex gap-2 mt-4">
                    <p-button label="İçeriği Temizle" severity="secondary" outlined (click)="temizle()" />
                    <p-button label="Varsayılanı Yükle" (click)="varsayilanYukle()" />
                </div>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Salt Okunur Mod</div>
                <p-editor [ngModel]="saltOkunurIcerik" [readonly]="true" [style]="{ height: '200px' }">
                </p-editor>
            </div>

            @if (icerik()) {
                <div class="card">
                    <div class="font-semibold text-xl mb-4">HTML Çıktısı</div>
                    <p-message severity="info">
                        Aşağıdaki içerik editörden üretilen ham HTML'dir. Güvenilir kaynaklardan geldiğinde <code>[innerHTML]</code> ile render edilebilir.
                    </p-message>
                    <pre class="mt-4 p-4 rounded-border text-sm overflow-auto" style="background: var(--surface-100)">{{ icerik() }}</pre>
                </div>
            }
        </div>
    `
})
export class EditorDemo {
    icerik = signal<string>('');

    saltOkunurIcerik =
        '<h3>T.C. Dışişleri Bakanlığı</h3>' +
        '<p>Bu alan <strong>salt okunur</strong> modda çalışmaktadır. ' +
        'İçerik düzenlenemez, yalnızca görüntülenebilir.</p>' +
        '<ul><li>Vize İşlemleri</li><li>Pasaport Hizmetleri</li><li>Konsolosluk Bilgileri</li></ul>';

    temizle() {
        this.icerik.set('');
    }

    varsayilanYukle() {
        this.icerik.set(
            '<h3>Örnek Zengin Metin İçeriği</h3>' +
            '<p>Bu metin <strong>kalın</strong>, <em>italik</em> ve <u>altı çizili</u> biçimlendirme içermektedir.</p>' +
            '<ul><li>Madde 1</li><li>Madde 2</li><li>Madde 3</li></ul>'
        );
    }
}
