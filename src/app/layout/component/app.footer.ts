import { Component } from '@angular/core';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [TranslatePipe],
    template: `<div class="layout-footer">{{ 'footer.text' | t }}</div>`
})
export class AppFooter {}
