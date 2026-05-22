import { Component } from '@angular/core';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [TranslatePipe],
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">{{ 'empty.title' | t }}</div>
        <p>{{ 'empty.description' | t }}</p>
    </div>`
})
export class Empty {}
