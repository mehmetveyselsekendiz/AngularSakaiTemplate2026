// TranslatePipe birim testleri — zoneless.
//
// Pipe impure (pure:false) ve TranslateService'e delege eder: transform()
// içinde svc.dict() okunarak reaktif bağımlılık kurulur, çeviri svc.t()'den
// gelir. Gerçek servisi (HTTP) kurmak yerine kontrol edilebilir bir sahte
// (fake) servis sağlanır; pipe'ın sözleşmesi (delege + dict değişince güncel
// değer) doğrulanır.

import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

class FakeTranslateService {
    private readonly _dict = signal<Record<string, string>>({});
    readonly dict = this._dict.asReadonly();

    setDict(value: Record<string, string>): void {
        this._dict.set(value);
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
}

describe('TranslatePipe', () => {
    let pipe: TranslatePipe;
    let fake: FakeTranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), TranslatePipe, { provide: TranslateService, useClass: FakeTranslateService }]
        });
        pipe = TestBed.inject(TranslatePipe);
        fake = TestBed.inject(TranslateService) as unknown as FakeTranslateService;
    });

    afterEach(() => TestBed.resetTestingModule());

    it('bulunamayan anahtarda anahtarı döner', () => {
        expect(pipe.transform('menu.yok')).toBe('menu.yok');
    });

    it('mevcut çeviriyi döner', () => {
        fake.setDict({ 'menu.home': 'Ana Sayfa' });
        expect(pipe.transform('menu.home')).toBe('Ana Sayfa');
    });

    it('parametreleri yerleştirir', () => {
        fake.setDict({ 'greeting.user': 'Merhaba {name}' });
        expect(pipe.transform('greeting.user', { name: 'Veysel' })).toBe('Merhaba Veysel');
    });

    it('impure: sözlük değişince güncel değeri döner', () => {
        expect(pipe.transform('menu.home')).toBe('menu.home');
        fake.setDict({ 'menu.home': 'Ana Sayfa' });
        expect(pipe.transform('menu.home')).toBe('Ana Sayfa');
    });
});
