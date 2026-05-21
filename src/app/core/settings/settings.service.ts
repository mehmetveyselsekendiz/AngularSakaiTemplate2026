// src/app/core/settings/settings.service.ts

import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppLanguage, AppSettings, DEFAULT_SETTINGS, FontScale, ThemeMode, isValidFontScale, isValidLanguage, isValidThemeMode } from './settings.types';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private static readonly STORAGE_KEY = 'mfa.settings.v1';
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    private readonly _settings = signal<AppSettings>(this.load());

    readonly settings = this._settings.asReadonly();
    readonly themeMode = computed(() => this._settings().themeMode);
    readonly fontScale = computed(() => this._settings().fontScale);
    readonly language = computed(() => this._settings().language);
    readonly isDark = computed(() => this.resolveDark());

    constructor() {
        if (this.isBrowser) {
            effect(() => {
                const dark = this.isDark();
                this.applyDarkClass(dark);
            });

            effect(() => {
                document.documentElement.setAttribute('data-font-scale', this.fontScale());
            });

            effect(() => {
                document.documentElement.setAttribute('lang', this.language());
            });

            effect(() => {
                this.persist(this._settings());
            });
        }
    }

    setThemeMode(mode: ThemeMode): void {
        this._settings.update((s) => ({ ...s, themeMode: mode }));
    }
    setFontScale(scale: FontScale): void {
        this._settings.update((s) => ({ ...s, fontScale: scale }));
    }
    setLanguage(lang: AppLanguage): void {
        this._settings.update((s) => ({ ...s, language: lang }));
    }
    reset(): void {
        this._settings.set({ ...DEFAULT_SETTINGS });
    }

    private resolveDark(): boolean {
        return this._settings().themeMode === 'dark';
    }

    private applyDarkClass(dark: boolean): void {
        const toggle = () => {
            document.documentElement.classList.toggle('app-dark', dark);
        };
        const supportsVT = typeof (document as any).startViewTransition === 'function';
        if (supportsVT) {
            (document as any).startViewTransition(toggle);
        } else {
            toggle();
        }
    }

    private load(): AppSettings {
        if (!this.isBrowser) return { ...DEFAULT_SETTINGS };
        try {
            const raw = localStorage.getItem(SettingsService.STORAGE_KEY);
            if (!raw) return { ...DEFAULT_SETTINGS };
            const parsed = JSON.parse(raw) as Partial<AppSettings>;
            return {
                themeMode: isValidThemeMode(parsed?.themeMode) ? parsed.themeMode : DEFAULT_SETTINGS.themeMode,
                fontScale: isValidFontScale(parsed?.fontScale) ? parsed.fontScale : DEFAULT_SETTINGS.fontScale,
                language: isValidLanguage(parsed?.language) ? parsed.language : DEFAULT_SETTINGS.language
            };
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    }

    private persist(value: AppSettings): void {
        if (!this.isBrowser) return;
        try {
            localStorage.setItem(SettingsService.STORAGE_KEY, JSON.stringify(value));
        } catch {
            // Quota / privacy mode — sessiz geç
        }
    }
}
