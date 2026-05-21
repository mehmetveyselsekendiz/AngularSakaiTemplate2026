import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { SettingsService } from '@/app/core/settings/settings.service';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { AppLanguage, FontScale, ThemeMode } from '@/app/core/settings/settings.types';

@Component({
    selector: 'app-settings-form',
    standalone: true,
    imports: [FormsModule, SelectButtonModule, SelectModule, TranslatePipe],
    template: `
        <div class="flex flex-col gap-6">
            <!-- Tema -->
            <div>
                <label class="block font-medium mb-2">{{ 'settings.theme.label' | t }}</label>
                <p-selectButton
                    [options]="themeOptions()"
                    [ngModel]="themeMode()"
                    (ngModelChange)="onThemeChange($event)"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ariaLabelledBy]="'settings.theme.label' | t" />
            </div>

            <!-- Font Scale -->
            <div>
                <label class="block font-medium mb-2">{{ 'settings.fontScale.label' | t }}</label>
                <p-selectButton
                    [options]="scaleOptions"
                    [ngModel]="fontScale()"
                    (ngModelChange)="onScaleChange($event)"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ariaLabelledBy]="'settings.fontScale.label' | t" />
            </div>

            <!-- Dil -->
            <div>
                <label class="block font-medium mb-2">{{ 'settings.language.label' | t }}</label>
                <p-select
                    [options]="languageOptions()"
                    [ngModel]="language()"
                    (ngModelChange)="onLanguageChange($event)"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full" />
            </div>
        </div>
    `
})
export class AppSettingsForm {
    private readonly settings = inject(SettingsService);
    private readonly translate = inject(TranslateService);

    readonly themeMode = this.settings.themeMode;
    readonly fontScale = this.settings.fontScale;
    readonly language = this.settings.language;

    readonly themeOptions = computed(() => {
        this.translate.dict();
        return [
            { label: this.translate.t('settings.theme.light'), value: 'light' as ThemeMode },
            { label: this.translate.t('settings.theme.dark'), value: 'dark' as ThemeMode },
            { label: this.translate.t('settings.theme.system'), value: 'system' as ThemeMode }
        ];
    });

    readonly scaleOptions: { label: string; value: FontScale }[] = [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 'sm' },
        { label: 'M', value: 'md' },
        { label: 'L', value: 'lg' },
        { label: 'XL', value: 'xl' }
    ];

    readonly languageOptions = computed(() => {
        this.translate.dict();
        return [
            { label: this.translate.t('settings.language.tr'), value: 'tr' as AppLanguage },
            { label: this.translate.t('settings.language.en'), value: 'en' as AppLanguage }
        ];
    });

    onThemeChange(mode: ThemeMode): void {
        this.settings.setThemeMode(mode);
    }
    onScaleChange(scale: FontScale): void {
        this.settings.setFontScale(scale);
    }
    onLanguageChange(lang: AppLanguage): void {
        this.settings.setLanguage(lang);
    }
}
