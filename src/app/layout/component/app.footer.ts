import { Component } from '@angular/core';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [TranslatePipe],
    // Sol: kurumsal geliştirici atıfı (tr/en aynı). Sağ: footer modül adı (footer.module, topbar'dan
    // bağımsız) + sürüm (footer.version). Her ikisi de normal footer metni — ayrı stil yok.
    template: `<div class="layout-footer">
        <span class="layout-footer-credit">{{ 'footer.developed_by' | t }}</span>
        <span class="layout-footer-app">{{ 'footer.module' | t }} {{ 'footer.version' | t }}</span>
    </div>`
})
export class AppFooter {}
