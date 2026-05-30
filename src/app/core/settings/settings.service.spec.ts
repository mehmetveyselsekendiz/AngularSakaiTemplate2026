// SettingsService birim testleri — zoneless (provideZonelessChangeDetection).
//
// Servis constructor'da DOM/localStorage'a yazan effect'ler kurar; bunlar
// ApplicationRef.tick() ile flush edilir. startViewTransition deterministik
// olmadığı için beforeEach'te devre dışı bırakılır → applyDarkClass senkron
// toggle yolundan ilerler.

import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { DEFAULT_SETTINGS } from './settings.types';

describe('SettingsService', () => {
    const STORAGE_KEY = 'mfa.settings.v1';
    let savedViewTransition: unknown;

    // Servisi (ve effect flush yardımcısını) tembel kur — bazı testler inject
    // ÖNCESİNDE localStorage'ı doldurmalı (load() yolunu test etmek için).
    function setup() {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()]
        });
        const service = TestBed.inject(SettingsService);
        const appRef = TestBed.inject(ApplicationRef);
        return { service, tick: () => appRef.tick() };
    }

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('app-dark');
        document.documentElement.removeAttribute('data-font-scale');
        document.documentElement.removeAttribute('lang');
        // startViewTransition'ı kapat → senkron sınıf toggle (test determinizmi)
        savedViewTransition = (document as unknown as Record<string, unknown>)['startViewTransition'];
        (document as unknown as Record<string, unknown>)['startViewTransition'] = undefined;
    });

    afterEach(() => {
        (document as unknown as Record<string, unknown>)['startViewTransition'] = savedViewTransition;
        TestBed.resetTestingModule();
        localStorage.clear();
    });

    it('localStorage boşken varsayılan ayarlarla başlar', () => {
        const { service } = setup();
        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
        expect(service.themeMode()).toBe('light');
        expect(service.fontScale()).toBe('md');
        expect(service.language()).toBe('tr');
    });

    it('localStorage’teki geçerli ayarları yükler', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeMode: 'dark', fontScale: 'lg', language: 'en' }));
        const { service } = setup();
        expect(service.themeMode()).toBe('dark');
        expect(service.fontScale()).toBe('lg');
        expect(service.language()).toBe('en');
    });

    it('geçersiz değerleri varsayılana düşürür', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeMode: 'rainbow', fontScale: 'huge', language: 'fr' }));
        const { service } = setup();
        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    });

    it('bozuk JSON’da varsayılana döner (çökmeden)', () => {
        localStorage.setItem(STORAGE_KEY, '{bozuk json');
        const { service } = setup();
        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    });

    it('isDark() themeMode ile reaktif değişir', () => {
        const { service } = setup();
        expect(service.isDark()).toBeFalse();
        service.setThemeMode('dark');
        expect(service.isDark()).toBeTrue();
    });

    it('dark mod tick sonrası <html> üzerine app-dark sınıfını uygular/kaldırır', () => {
        const { service, tick } = setup();
        service.setThemeMode('dark');
        tick();
        expect(document.documentElement.classList.contains('app-dark')).toBeTrue();
        service.setThemeMode('light');
        tick();
        expect(document.documentElement.classList.contains('app-dark')).toBeFalse();
    });

    it('font scale tick sonrası data-font-scale özniteliğini yazar', () => {
        const { service, tick } = setup();
        service.setFontScale('xl');
        tick();
        expect(document.documentElement.getAttribute('data-font-scale')).toBe('xl');
    });

    it('dil tick sonrası lang özniteliğini yazar', () => {
        const { service, tick } = setup();
        service.setLanguage('en');
        tick();
        expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    it('değişiklikleri tick sonrası localStorage’e kalıcı yazar', () => {
        const { service, tick } = setup();
        service.setThemeMode('dark');
        service.setFontScale('sm');
        tick();
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
        expect(stored.themeMode).toBe('dark');
        expect(stored.fontScale).toBe('sm');
    });

    it('reset() ayarları varsayılana döndürür', () => {
        const { service, tick } = setup();
        service.setThemeMode('dark');
        service.setLanguage('en');
        tick();
        service.reset();
        tick();
        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    });
});
