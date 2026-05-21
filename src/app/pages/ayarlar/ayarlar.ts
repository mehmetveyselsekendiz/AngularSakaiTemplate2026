import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AppSettingsForm } from '@/app/layout/component/app.settings-form';
import { SettingsService } from '@/app/core/settings/settings.service';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    selector: 'app-ayarlar',
    standalone: true,
    imports: [CardModule, DividerModule, ButtonModule, AppSettingsForm, TranslatePipe],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-1">{{ 'settings.title' | t }}</div>
            <div class="text-sm text-color-secondary mb-4">{{ 'settings.about.text' | t }}</div>

            <p-divider />

            <app-settings-form />

            <p-divider />

            <p-button
                [label]="'settings.reset' | t"
                severity="secondary"
                [outlined]="true"
                icon="pi pi-refresh"
                (onClick)="settings.reset()" />
        </div>
    `
})
export class Ayarlar {
    readonly settings = inject(SettingsService);
}
