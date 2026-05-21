import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { PrimeNG } from 'primeng/config';
import type { Translation } from 'primeng/api';
import { SettingsService } from '@/app/core/settings/settings.service';
import { AppLanguage } from '@/app/core/settings/settings.types';

type Dict = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TranslateService {
    private readonly settings = inject(SettingsService);
    private readonly http = inject(HttpClient);
    private readonly primeng = inject(PrimeNG);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    private readonly _dict = signal<Dict>({});
    readonly dict = this._dict.asReadonly();
    readonly locale = this.settings.language;

    constructor() {
        if (this.isBrowser) {
            effect(() => {
                const lang = this.locale();
                this.load(lang);
            });
        }
    }

    t(key: string, params?: Record<string, string | number>): string {
        let template = this._dict()[key] ?? key;
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                template = template.replaceAll(`{${k}}`, String(v));
            }
        }
        return template;
    }

    private async load(lang: AppLanguage): Promise<void> {
        try {
            const dict = await firstValueFrom(this.http.get<Dict>(`/assets/i18n/${lang}.json`));
            this._dict.set(dict ?? {});
            this.primeng.setTranslation(this.toPrimeNgTranslation(dict ?? {}));
        } catch {
            this._dict.set({});
        }
    }

    private toPrimeNgTranslation(dict: Dict): Translation {
        const split = (key: string): string[] => (dict[key] ?? '').split(',').filter(Boolean);
        return {
            accept: dict['primeng.accept'],
            reject: dict['primeng.reject'],
            choose: dict['primeng.choose'],
            upload: dict['primeng.upload'],
            cancel: dict['primeng.cancel'],
            emptyMessage: dict['primeng.emptyMessage'],
            emptyFilterMessage: dict['primeng.emptyFilterMessage'],
            completed: dict['primeng.completed'],
            pending: dict['primeng.pending'],
            clear: dict['primeng.clear'],
            apply: dict['primeng.apply'],
            today: dict['primeng.today'],
            dayNames: split('primeng.dayNames'),
            dayNamesShort: split('primeng.dayNamesShort'),
            dayNamesMin: split('primeng.dayNamesMin'),
            monthNames: split('primeng.monthNames'),
            monthNamesShort: split('primeng.monthNamesShort')
        } as Translation;
    }
}
