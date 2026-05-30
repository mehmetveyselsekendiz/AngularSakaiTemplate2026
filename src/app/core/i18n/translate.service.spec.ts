// TranslateService birim testleri — zoneless.
//
// Servis, locale() değişince /i18n/<lang>.json'u HttpClient ile yükleyen bir
// effect kurar (firstValueFrom). Effect ApplicationRef.tick() ile flush edilir;
// HTTP HttpTestingController ile kontrol edilir. PrimeNG.setTranslation çağrısı
// stub spy ile doğrulanır. load() async olduğundan flush sonrası mikro-görev
// kuyruğu settle() ile boşaltılır.

import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrimeNG } from 'primeng/config';
import { TranslateService } from './translate.service';
import { SettingsService } from '@/app/core/settings/settings.service';

// firstValueFrom devamını (continuation) çalıştırmak için mikro-görev kuyruğunu boşalt
async function settle(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
}

describe('TranslateService', () => {
    let httpMock: HttpTestingController;
    let setTranslationSpy: jasmine.Spy;
    let savedViewTransition: unknown;

    function setup() {
        setTranslationSpy = jasmine.createSpy('setTranslation');
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), { provide: PrimeNG, useValue: { setTranslation: setTranslationSpy } }]
        });
        const service = TestBed.inject(TranslateService);
        const appRef = TestBed.inject(ApplicationRef);
        httpMock = TestBed.inject(HttpTestingController);
        return { service, tick: () => appRef.tick() };
    }

    beforeEach(() => {
        localStorage.clear();
        // Gerçek SettingsService (dependency) dark effect'inde startViewTransition
        // çağırır; headless Chrome'da gerçek geçiş animasyonu teardown'ı kilitler.
        // Test ortamında nötrle → senkron toggle, deterministik.
        savedViewTransition = (document as unknown as Record<string, unknown>)['startViewTransition'];
        (document as unknown as Record<string, unknown>)['startViewTransition'] = undefined;
    });

    afterEach(() => {
        (document as unknown as Record<string, unknown>)['startViewTransition'] = savedViewTransition;
        httpMock.verify();
        TestBed.resetTestingModule();
        localStorage.clear();
    });

    it('açılışta mevcut dilin (tr) sözlüğünü yükler ve çeviri döner', async () => {
        const { service, tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush({ 'app.title': 'Bakanlık' });
        await settle();
        expect(service.t('app.title')).toBe('Bakanlık');
    });

    it('bulunamayan anahtar için anahtarın kendisini döner', async () => {
        const { service, tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush({});
        await settle();
        expect(service.t('yok.boyle.anahtar')).toBe('yok.boyle.anahtar');
    });

    it('parametreleri {placeholder} olarak yerleştirir', async () => {
        const { service, tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush({ welcome: 'Hoş geldin {name}, {count} mesaj' });
        await settle();
        expect(service.t('welcome', { name: 'Ada', count: 3 })).toBe('Hoş geldin Ada, 3 mesaj');
    });

    it('PrimeNG.setTranslation’ı eşlenmiş çeviriyle çağırır', async () => {
        const { tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush({
            'primeng.accept': 'Evet',
            'primeng.reject': 'Hayır',
            'primeng.dayNames': 'Pazar,Pazartesi,Salı'
        });
        await settle();
        expect(setTranslationSpy).toHaveBeenCalled();
        const arg = setTranslationSpy.calls.mostRecent().args[0];
        expect(arg.accept).toBe('Evet');
        expect(arg.reject).toBe('Hayır');
        expect(arg.dayNames).toEqual(['Pazar', 'Pazartesi', 'Salı']);
    });

    it('dil değişince yeni sözlüğü yükler', async () => {
        const { service, tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush({ greeting: 'Merhaba' });
        await settle();

        TestBed.inject(SettingsService).setLanguage('en');
        tick();
        httpMock.expectOne('/i18n/en.json').flush({ greeting: 'Hello' });
        await settle();

        expect(service.locale()).toBe('en');
        expect(service.t('greeting')).toBe('Hello');
    });

    it('HTTP hatasında sözlük boş kalır (anahtar geri döner)', async () => {
        const { service, tick } = setup();
        tick();
        httpMock.expectOne('/i18n/tr.json').flush('hata', { status: 500, statusText: 'Server Error' });
        await settle();
        expect(service.t('herhangi.bir.key')).toBe('herhangi.bir.key');
    });
});
