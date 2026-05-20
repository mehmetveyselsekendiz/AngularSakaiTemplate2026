# Phase 7B — Runtime Ayar Sistemi Implementation Plan

> **Agentic worker'lar için:** ZORUNLU ALT-SKILL: `superpowers:subagent-driven-development` (önerilen) veya `superpowers:executing-plans` ile bu planı task-task uygula. Adımlar `- [ ]` syntax'ında takip edilir.

**Spec:** [`../specs/2026-05-20-phase-7b-runtime-settings-design.md`](../specs/2026-05-20-phase-7b-runtime-settings-design.md)

**Amaç:** T.C. Dışişleri Bakanlığı MFA Angular template'ine signal-tabanlı runtime ayar sistemi (tema/font/dil + localStorage persistence + topbar drawer + ayrı tam sayfa) eklemek; mevcut `LayoutService`'i tema sorumluluğundan ayırıp sadece sidebar/menu state'e indirgemek.

**Mimari:** Tek kaynak `SettingsService` (core/settings/) signal+effect ile DOM'a yansır (`.app-dark` class, `data-font-scale` attr, `lang` attr) ve localStorage'a yazar. PrimeNG `setTranslation()` API'si + custom `TranslateService` + `| t` pipe ile i18n (0 paket). Dark mode "akromatik invert" stratejisi: `mfa-tokens.scss`'te alias token'lar `.app-dark` altında dark eşleniğe kayar; 11-step paletler dokunulmaz. Drawer ve `/pages/ayarlar` paylaşılan `<app-settings-form>` kullanır.

**Tech Stack:** Angular 21 (zoneless, standalone, signal), PrimeNG 21 Aura (`<p-drawer>`, `<p-selectbutton>`, `<p-select>`, `<p-card>`), Tailwind v4, TypeScript ~5.9.3, `@primeuix/themes` 2.x (`definePreset`).

**TDD notu:** Spec §10 kararı: Phase 7B'de birim test yazılmaz. Her task sonunda **(1) manuel acceptance smoke test** (browser doğrulama), **(2) `npm run build` temizliği**, **(3) commit** — doğrulama döngüsü korunur.

---

## Dosya Yapısı

### Yeni dosyalar (8)

| Dosya | Sorumluluk |
|---|---|
| `src/app/core/settings/settings.types.ts` | `ThemeMode`, `FontScale`, `AppLanguage`, `AppSettings`, `DEFAULT_SETTINGS`, `FONT_SCALE_PX` |
| `src/app/core/settings/settings.service.ts` | Signal-tabanlı runtime ayar servisi + persistence + DOM effect'leri |
| `src/app/core/i18n/translate.service.ts` | Sözlük yükleme + `t()` + PrimeNG `setTranslation()` sync |
| `src/app/core/i18n/translate.pipe.ts` | `\| t` standalone pipe (signal-aware, pure: false) |
| `src/assets/i18n/tr.json` | TR sözlüğü |
| `src/assets/i18n/en.json` | EN sözlüğü |
| `src/app/layout/component/app.settings-form.ts` | Paylaşılan ayar formu (drawer ve sayfa kullanır) |
| `src/app/pages/ayarlar/ayarlar.ts` | Tam sayfa ayar UI'ı |

### Değiştirilen dosyalar (10)

| Dosya | Değişim |
|---|---|
| `src/assets/mfa-tokens.scss` | Alias token blok + `.app-dark` override + `html[data-font-scale]` |
| `src/app/core/config/theme.config.ts` | `definePreset` → `semantic.colorScheme.dark` |
| `src/app.config.ts` | `LOCALE_ID` runtime factory + `registerLocaleData(tr, en)` + `ENVIRONMENT_INITIALIZER` |
| `src/index.html` | `<html lang="tr" data-font-scale="md">` |
| `src/app/layout/service/layout.service.ts` | Tema-related her şey silinir; sadece sidebar/menu state |
| `src/app/layout/component/app.topbar.ts` | Settings cog butonu + drawer; eski dark toggle silinir |
| `src/app/layout/component/app.layout.ts` | `<app-floating-configurator>` import + render silinir |
| `src/app/layout/component/app.menu.ts` | `labelKey` → `t()` render |
| `src/app/core/config/navigation.config.ts` | Tüm `label` → `labelKey`; "Ayarlar" eklenir |
| `src/app/pages/pages.routes.ts` | `ayarlar` route |

### Silinen dosyalar (1)

| Dosya | Sebep |
|---|---|
| `src/app/layout/component/app.floatingconfigurator.ts` | Drawer onun yerine geçer (Sakai default'tan miras) |

---

## Task 1 — SettingsService Tipleri ve Servis

**Files:**
- Create: `src/app/core/settings/settings.types.ts`
- Create: `src/app/core/settings/settings.service.ts`

- [ ] **Adım 1.1: `settings.types.ts` oluştur**

```ts
// src/app/core/settings/settings.types.ts

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AppLanguage = 'tr' | 'en';

export interface AppSettings {
    themeMode: ThemeMode;
    fontScale: FontScale;
    language: AppLanguage;
}

export const DEFAULT_SETTINGS: AppSettings = {
    themeMode: 'system',
    fontScale: 'md',
    language: 'tr'
};

export const FONT_SCALE_PX: Record<FontScale, number> = {
    xs: 13, sm: 14, md: 15, lg: 17, xl: 19
};

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'] as const;
export const FONT_SCALES: readonly FontScale[] = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const APP_LANGUAGES: readonly AppLanguage[] = ['tr', 'en'] as const;

export function isValidThemeMode(v: unknown): v is ThemeMode {
    return typeof v === 'string' && (THEME_MODES as readonly string[]).includes(v);
}
export function isValidFontScale(v: unknown): v is FontScale {
    return typeof v === 'string' && (FONT_SCALES as readonly string[]).includes(v);
}
export function isValidLanguage(v: unknown): v is AppLanguage {
    return typeof v === 'string' && (APP_LANGUAGES as readonly string[]).includes(v);
}
```

- [ ] **Adım 1.2: `settings.service.ts` oluştur**

```ts
// src/app/core/settings/settings.service.ts

import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    AppLanguage,
    AppSettings,
    DEFAULT_SETTINGS,
    FontScale,
    ThemeMode,
    isValidFontScale,
    isValidLanguage,
    isValidThemeMode
} from './settings.types';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private static readonly STORAGE_KEY = 'mfa.settings.v1';
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    private readonly _settings = signal<AppSettings>(this.load());
    private readonly _systemPrefersDark = signal<boolean>(this.detectSystemDark());

    readonly settings = this._settings.asReadonly();
    readonly themeMode = computed(() => this._settings().themeMode);
    readonly fontScale = computed(() => this._settings().fontScale);
    readonly language = computed(() => this._settings().language);
    readonly isDark = computed(() => this.resolveDark());

    constructor() {
        if (this.isBrowser) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            mq.addEventListener('change', (e) => this._systemPrefersDark.set(e.matches));

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
        const mode = this._settings().themeMode;
        if (mode === 'system') return this._systemPrefersDark();
        return mode === 'dark';
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

    private detectSystemDark(): boolean {
        if (!this.isBrowser) return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
```

- [ ] **Adım 1.3: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI, hata yok. `SettingsService` henüz hiç inject edilmedi; sadece derleniyor.

- [ ] **Adım 1.4: Commit**

```bash
git add src/app/core/settings/
git commit -m "feat(settings): SettingsService + types — signal+effect+localStorage iskelesi (Phase 7B Task 1)"
```

---

## Task 2 — `mfa-tokens.scss` Alias Token + Dark + Font Scale

**Files:**
- Modify: `src/assets/mfa-tokens.scss`

- [ ] **Adım 2.1: Dosyanın sonuna alias + dark + font-scale blokları ekle**

Mevcut dosyanın son `:root { ... }` kapanışından SONRA yeni satırda ekle:

```scss

// ─── Alias token'lar (light default) ─────────────────────────────────────
// Component'ler bu alias'ları okur; .app-dark altında otomatik dark eşleniğe kayar.
:root {
  --mfa-bg:          var(--mfa-surface-0);
  --mfa-bg-elevated: var(--mfa-surface-50);
  --mfa-bg-muted:    var(--mfa-surface-100);
  --mfa-text:        var(--mfa-surface-900);
  --mfa-text-muted:  var(--mfa-surface-600);
  --mfa-border:      var(--mfa-surface-200);
  --mfa-brand:       var(--mfa-red);
  --mfa-brand-fg:    #ffffff;
}

// ─── Dark mode override (akromatik invert) ───────────────────────────────
// Yalnız yüzey/metin/border ters çevrilir. 11-step paletler dokunulmaz.
// Marka renkleri okunabilirlik için tonal kayma yapar.
.app-dark {
  --mfa-bg:          var(--mfa-surface-950);
  --mfa-bg-elevated: var(--mfa-surface-900);
  --mfa-bg-muted:    var(--mfa-surface-800);
  --mfa-text:        var(--mfa-surface-50);
  --mfa-text-muted:  var(--mfa-surface-300);
  --mfa-border:      var(--mfa-surface-700);

  // Marka rengi tonal ayar — palet İÇİNDEN seçim
  --mfa-red:    var(--mfa-red-500);
  --mfa-navy:   var(--mfa-navy-400);
  --mfa-gold:   var(--mfa-gold-400);
  --mfa-danger: var(--mfa-danger-500);
  --mfa-brand:  var(--mfa-red-500);
}

// ─── Font scale (kök font-size) ──────────────────────────────────────────
// SettingsService `data-font-scale` attribute set eder; tüm rem ölçekleri buna bağlı.
:root              { font-size: 15px; }                     // md default
html[data-font-scale="xs"] { font-size: 13px; }
html[data-font-scale="sm"] { font-size: 14px; }
html[data-font-scale="md"] { font-size: 15px; }
html[data-font-scale="lg"] { font-size: 17px; }
html[data-font-scale="xl"] { font-size: 19px; }
```

- [ ] **Adım 2.2: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 2.3: Manuel browser smoke test**

`npm run start` → http://localhost:4200 → DevTools Console:
```js
getComputedStyle(document.documentElement).getPropertyValue('--mfa-bg')
// Beklenen: "#ffffff" veya benzeri
document.documentElement.classList.add('app-dark')
getComputedStyle(document.documentElement).getPropertyValue('--mfa-bg')
// Beklenen: "#0d0e10"
document.documentElement.classList.remove('app-dark')
document.documentElement.setAttribute('data-font-scale', 'xl')
// Font büyür
document.documentElement.setAttribute('data-font-scale', 'md')
```

- [ ] **Adım 2.4: Commit**

```bash
git add src/assets/mfa-tokens.scss
git commit -m "feat(theme): alias token + .app-dark + html[data-font-scale] (Phase 7B Task 2)"
```

---

## Task 3 — PrimeNG `theme.config.ts` Dark colorScheme

**Files:**
- Modify: `src/app/core/config/theme.config.ts`

- [ ] **Adım 3.1: Mevcut `theme.config.ts`'i Read et**

Çalıştır (referans için): `cat src/app/core/config/theme.config.ts`

Mevcut `definePreset(Aura, { ... })` çağrısının `semantic` bloğunu bul.

- [ ] **Adım 3.2: `semantic.colorScheme` bloğunu ekle**

`semantic` bloğunun içinde, mevcut alanların yanına `colorScheme` ekle. Mevcut alanları (`primary`, vb.) SİLME:

```ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MfaPreset = definePreset(Aura, {
    // ... mevcut primitive override (sky/orange/red) KORUNUR
    semantic: {
        // ... mevcut primary slot KORUNUR
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            },
            dark: {
                surface: {
                    0: '#0d0e10',
                    50: '#1a1c1f',
                    100: '#2a2d31',
                    200: '#3e4044',
                    300: '#53565a',
                    400: '#7e8088',
                    500: '#a8aab0',
                    600: '#c8c9cc',
                    700: '#e4e4e7',
                    800: '#f2f2f3',
                    900: '#f9f9fa',
                    950: '#ffffff'
                }
            }
        }
    }
});
```

**NOT:** Mevcut yapıda `semantic.primary` zaten var; bunu KORU. Sadece `colorScheme` alt-bloğunu yanına ekle. Önce `Read`, sonra `Edit` ile minimum diff.

- [ ] **Adım 3.3: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 3.4: Manuel browser smoke test**

`npm run start` → DevTools Console:
```js
document.documentElement.classList.add('app-dark')
// PrimeNG bileşenleri dark sürüm renklerine geçer
document.documentElement.classList.remove('app-dark')
```

- [ ] **Adım 3.5: Commit**

```bash
git add src/app/core/config/theme.config.ts
git commit -m "feat(theme): PrimeNG semantic.colorScheme.dark MFA surface eşleştirmesi (Phase 7B Task 3)"
```

---

## Task 4 — `index.html` Baseline + `ENVIRONMENT_INITIALIZER`

**Files:**
- Modify: `src/index.html`
- Modify: `src/app.config.ts`

- [ ] **Adım 4.1: `index.html` `<html>` tag'ini güncelle**

`src/index.html` Read. `<html lang="...">` (veya `<html>`) tag'ini bul, şu hâle getir:

```html
<html lang="tr" data-font-scale="md">
```

- [ ] **Adım 4.2: `app.config.ts`'e `ENVIRONMENT_INITIALIZER` ekle**

`src/app.config.ts` Read. Mevcut providers array'inin SONUNA şu provider'ı ekle:

```ts
// üst import'lara (mevcut import'larla birleştir):
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { SettingsService } from '@/app/core/settings/settings.service';

// providers array'inin sonuna:
{
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => inject(SettingsService)
}
```

Tam dosya (örnek hâli — mevcut yapı korunur, sadece ekleme):

```ts
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ENVIRONMENT_INITIALIZER, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { MfaPreset } from '@/app/core/config/theme.config';
import { authInterceptor } from '@/app/core/auth/auth.interceptor';
import { errorInterceptor } from '@/app/core/http/error.interceptor';
import { SettingsService } from '@/app/core/settings/settings.service';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: MfaPreset, options: { darkModeSelector: '.app-dark' } } }),
        MessageService,
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue: () => inject(SettingsService)
        }
    ]
};
```

- [ ] **Adım 4.3: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 4.4: Manuel browser smoke test**

`npm run start` → http://localhost:4200
1. **System dark testi:** OS dark mode aç → sayfa dark gelmeli (default `themeMode: 'system'`).
2. **Persistence testi:** DevTools Console:
   ```js
   localStorage.setItem('mfa.settings.v1', JSON.stringify({ themeMode: 'dark', fontScale: 'lg', language: 'tr' }))
   location.reload()
   ```
   `<html lang="tr" data-font-scale="lg" class="app-dark">` olmalı.
3. **Reset:** `localStorage.removeItem('mfa.settings.v1'); location.reload()` → varsayılana döner.

- [ ] **Adım 4.5: Commit**

```bash
git add src/app.config.ts src/index.html
git commit -m "feat(settings): SettingsService early-init + html lang/data-font-scale baseline (Phase 7B Task 4)"
```

---

## Task 5 — i18n Altyapısı (`TranslateService` + Pipe + Sözlükler)

**Files:**
- Create: `src/app/core/i18n/translate.service.ts`
- Create: `src/app/core/i18n/translate.pipe.ts`
- Create: `src/assets/i18n/tr.json`
- Create: `src/assets/i18n/en.json`

- [ ] **Adım 5.1: `src/assets/i18n/tr.json` oluştur**

```json
{
  "menu.home": "Ana Sayfa",
  "menu.dashboard": "Dashboard",
  "menu.library": "Bileşen Kütüphanesi",
  "menu.uikit.button": "Butonlar",
  "menu.uikit.input": "Giriş Alanları",
  "menu.uikit.formlayout": "Form Düzeni",
  "menu.uikit.hierarchy": "Hiyerarşi",
  "menu.uikit.editor": "Zengin Metin",
  "menu.uikit.table": "Tablo",
  "menu.uikit.list": "Liste",
  "menu.uikit.tree": "Ağaç",
  "menu.uikit.panel": "Panel",
  "menu.uikit.overlay": "Overlay",
  "menu.uikit.media": "Medya",
  "menu.uikit.menu": "Menü",
  "menu.uikit.message": "Mesajlar",
  "menu.uikit.file": "Dosya Yükleme",
  "menu.uikit.charts": "Grafikler",
  "menu.uikit.timeline": "Zaman Çizelgesi",
  "menu.uikit.misc": "Diğer",
  "menu.pages": "Sayfalar",
  "menu.pages.corporate-identity": "Kurumsal Kimlik",
  "menu.pages.crud": "CRUD Örneği",
  "menu.pages.empty": "Boş Sayfa",
  "menu.pages.settings": "Ayarlar",
  "menu.pages.auth": "Auth",
  "menu.pages.auth.login": "Giriş",
  "menu.pages.auth.access": "Erişim Engeli",
  "menu.pages.auth.error": "Hata Sayfası",
  "menu.pages.notfound": "Sayfa Bulunamadı",
  "topbar.logout": "Çıkış Yap",
  "topbar.profile": "Profil",
  "topbar.settings": "Ayarlar",
  "topbar.toggle_menu": "Menüyü Aç/Kapat",
  "settings.title": "Ayarlar",
  "settings.theme.label": "Görünüm",
  "settings.theme.light": "Aydınlık",
  "settings.theme.dark": "Karanlık",
  "settings.theme.system": "Sistem",
  "settings.fontScale.label": "Yazı Tipi Boyutu",
  "settings.language.label": "Dil",
  "settings.language.tr": "Türkçe",
  "settings.language.en": "İngilizce",
  "settings.reset": "Varsayılana Dön",
  "settings.about": "Hakkında",
  "settings.about.text": "T.C. Dışişleri Bakanlığı MFA Frontend Template.",
  "primeng.accept": "Evet",
  "primeng.reject": "Hayır",
  "primeng.choose": "Seç",
  "primeng.upload": "Yükle",
  "primeng.cancel": "İptal",
  "primeng.emptyMessage": "Kayıt bulunamadı",
  "primeng.emptyFilterMessage": "Sonuç bulunamadı",
  "primeng.completed": "Tamamlandı",
  "primeng.pending": "Beklemede",
  "primeng.clear": "Temizle",
  "primeng.apply": "Uygula",
  "primeng.dayNames": "Pazar,Pazartesi,Salı,Çarşamba,Perşembe,Cuma,Cumartesi",
  "primeng.dayNamesShort": "Paz,Pzt,Sal,Çar,Per,Cum,Cmt",
  "primeng.dayNamesMin": "Pz,Pt,Sa,Ça,Pe,Cu,Ct",
  "primeng.monthNames": "Ocak,Şubat,Mart,Nisan,Mayıs,Haziran,Temmuz,Ağustos,Eylül,Ekim,Kasım,Aralık",
  "primeng.monthNamesShort": "Oca,Şub,Mar,Nis,May,Haz,Tem,Ağu,Eyl,Eki,Kas,Ara",
  "primeng.today": "Bugün"
}
```

- [ ] **Adım 5.2: `src/assets/i18n/en.json` oluştur**

```json
{
  "menu.home": "Home",
  "menu.dashboard": "Dashboard",
  "menu.library": "Component Library",
  "menu.uikit.button": "Buttons",
  "menu.uikit.input": "Input",
  "menu.uikit.formlayout": "Form Layout",
  "menu.uikit.hierarchy": "Hierarchy",
  "menu.uikit.editor": "Rich Text",
  "menu.uikit.table": "Table",
  "menu.uikit.list": "List",
  "menu.uikit.tree": "Tree",
  "menu.uikit.panel": "Panel",
  "menu.uikit.overlay": "Overlay",
  "menu.uikit.media": "Media",
  "menu.uikit.menu": "Menu",
  "menu.uikit.message": "Messages",
  "menu.uikit.file": "File Upload",
  "menu.uikit.charts": "Charts",
  "menu.uikit.timeline": "Timeline",
  "menu.uikit.misc": "Misc",
  "menu.pages": "Pages",
  "menu.pages.corporate-identity": "Corporate Identity",
  "menu.pages.crud": "CRUD Example",
  "menu.pages.empty": "Empty Page",
  "menu.pages.settings": "Settings",
  "menu.pages.auth": "Auth",
  "menu.pages.auth.login": "Login",
  "menu.pages.auth.access": "Access Denied",
  "menu.pages.auth.error": "Error Page",
  "menu.pages.notfound": "Not Found",
  "topbar.logout": "Logout",
  "topbar.profile": "Profile",
  "topbar.settings": "Settings",
  "topbar.toggle_menu": "Toggle Menu",
  "settings.title": "Settings",
  "settings.theme.label": "Appearance",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.theme.system": "System",
  "settings.fontScale.label": "Font Size",
  "settings.language.label": "Language",
  "settings.language.tr": "Turkish",
  "settings.language.en": "English",
  "settings.reset": "Reset to Defaults",
  "settings.about": "About",
  "settings.about.text": "Republic of Türkiye Ministry of Foreign Affairs Frontend Template.",
  "primeng.accept": "Yes",
  "primeng.reject": "No",
  "primeng.choose": "Choose",
  "primeng.upload": "Upload",
  "primeng.cancel": "Cancel",
  "primeng.emptyMessage": "No records found",
  "primeng.emptyFilterMessage": "No results found",
  "primeng.completed": "Completed",
  "primeng.pending": "Pending",
  "primeng.clear": "Clear",
  "primeng.apply": "Apply",
  "primeng.dayNames": "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
  "primeng.dayNamesShort": "Sun,Mon,Tue,Wed,Thu,Fri,Sat",
  "primeng.dayNamesMin": "Su,Mo,Tu,We,Th,Fr,Sa",
  "primeng.monthNames": "January,February,March,April,May,June,July,August,September,October,November,December",
  "primeng.monthNamesShort": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
  "primeng.today": "Today"
}
```

- [ ] **Adım 5.3: `translate.service.ts` oluştur**

```ts
// src/app/core/i18n/translate.service.ts

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
```

- [ ] **Adım 5.4: `translate.pipe.ts` oluştur**

```ts
// src/app/core/i18n/translate.pipe.ts

import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
    name: 't',
    standalone: true,
    pure: false  // Signal-aware: dict() değişince re-evaluate
})
export class TranslatePipe implements PipeTransform {
    private readonly svc = inject(TranslateService);

    transform(key: string, params?: Record<string, string | number>): string {
        this.svc.dict();  // dependency tracking
        return this.svc.t(key, params);
    }
}
```

- [ ] **Adım 5.5: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 5.6: Commit**

```bash
git add src/app/core/i18n/ src/assets/i18n/
git commit -m "feat(i18n): TranslateService + |t pipe + tr.json/en.json (~70 key) (Phase 7B Task 5)"
```

---

## Task 6 — `LOCALE_ID` Runtime Provider + `registerLocaleData`

**Files:**
- Modify: `src/app.config.ts`

- [ ] **Adım 6.1: Locale data + LOCALE_ID factory ekle**

`src/app.config.ts` Read. Mevcut yapıya ekle (Task 4'teki `ENVIRONMENT_INITIALIZER` zaten var):

```ts
// üst import'lara EKLE:
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import localeEn from '@angular/common/locales/en';

// dosyanın başında, appConfig export'ından ÖNCE:
registerLocaleData(localeTr, 'tr');
registerLocaleData(localeEn, 'en');

// providers array'inin sonuna EKLE:
{
    provide: LOCALE_ID,
    useFactory: () => inject(SettingsService).language()
}
```

Tam dosya hâli:

```ts
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    ENVIRONMENT_INITIALIZER,
    LOCALE_ID,
    inject,
    provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import localeEn from '@angular/common/locales/en';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { MfaPreset } from '@/app/core/config/theme.config';
import { authInterceptor } from '@/app/core/auth/auth.interceptor';
import { errorInterceptor } from '@/app/core/http/error.interceptor';
import { SettingsService } from '@/app/core/settings/settings.service';
import { appRoutes } from './app.routes';

registerLocaleData(localeTr, 'tr');
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: MfaPreset, options: { darkModeSelector: '.app-dark' } } }),
        MessageService,
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue: () => inject(SettingsService)
        },
        {
            provide: LOCALE_ID,
            useFactory: () => inject(SettingsService).language()
        }
    ]
};
```

- [ ] **Adım 6.2: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

**Bilinen sınırlama:** `LOCALE_ID` runtime'da değişmez (factory bir kez çalışır). Date/currency pipe çıktısı dil değiştirince güncellenmez — Phase 7B'de kabul edilen kısıtlama (spec §6.6 ve §11).

- [ ] **Adım 6.3: Commit**

```bash
git add src/app.config.ts
git commit -m "feat(i18n): LOCALE_ID runtime factory + registerLocaleData(tr, en) (Phase 7B Task 6)"
```

---

## Task 7 — `navigation.config.ts` `labelKey` Migration

**Files:**
- Modify: `src/app/core/config/navigation.config.ts`

- [ ] **Adım 7.1: Interface + NAV_GROUPS güncelle**

`src/app/core/config/navigation.config.ts` içeriğini şu hâle getir (tam dosya):

```ts
import type { MenuItem } from 'primeng/api';

export interface NavItem extends Omit<MenuItem, 'items'> {
    requiredRoles?: string[];
    /** i18n key — `\| t` pipe ile çevrilir. Hem labelKey hem label varsa labelKey kazanır. */
    labelKey?: string;
    items?: NavItem[];
}

export interface NavGroup {
    label?: string;
    labelKey?: string;
    icon?: string;
    separator?: boolean;
    requiredRoles?: string[];
    items?: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
    {
        labelKey: 'menu.home',
        items: [{ labelKey: 'menu.dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
    },
    {
        labelKey: 'menu.library',
        items: [
            { labelKey: 'menu.uikit.button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            { labelKey: 'menu.uikit.input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            { labelKey: 'menu.uikit.formlayout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            { labelKey: 'menu.uikit.hierarchy', icon: 'pi pi-fw pi-sitemap', routerLink: ['/uikit/hierarchy'] },
            { labelKey: 'menu.uikit.editor', icon: 'pi pi-fw pi-align-left', routerLink: ['/uikit/editor'] },
            { labelKey: 'menu.uikit.table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            { labelKey: 'menu.uikit.list', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            { labelKey: 'menu.uikit.tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            { labelKey: 'menu.uikit.panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            { labelKey: 'menu.uikit.overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            { labelKey: 'menu.uikit.media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            { labelKey: 'menu.uikit.menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            { labelKey: 'menu.uikit.message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            { labelKey: 'menu.uikit.file', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            { labelKey: 'menu.uikit.charts', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            { labelKey: 'menu.uikit.timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            { labelKey: 'menu.uikit.misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
        ]
    },
    {
        labelKey: 'menu.pages',
        items: [
            { labelKey: 'menu.pages.corporate-identity', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
            { labelKey: 'menu.pages.settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/ayarlar'] },
            { labelKey: 'menu.pages.crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
            { labelKey: 'menu.pages.empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] },
            {
                labelKey: 'menu.pages.auth',
                icon: 'pi pi-fw pi-user',
                path: 'auth',
                items: [
                    { labelKey: 'menu.pages.auth.login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                    { labelKey: 'menu.pages.auth.access', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] },
                    { labelKey: 'menu.pages.auth.error', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/auth/error'] }
                ]
            },
            { labelKey: 'menu.pages.notfound', icon: 'pi pi-fw pi-times-circle', routerLink: ['/notfound'] }
        ]
    }
];

// Breadcrumb için: route → labelKey eşlemesi (eskiden Türkçe string, şimdi key)
export const ROUTE_LABEL_KEY_MAP: Record<string, string> = {
    '/': 'menu.dashboard',
    '/uikit/button': 'menu.uikit.button',
    '/uikit/input': 'menu.uikit.input',
    '/uikit/formlayout': 'menu.uikit.formlayout',
    '/uikit/hierarchy': 'menu.uikit.hierarchy',
    '/uikit/editor': 'menu.uikit.editor',
    '/uikit/table': 'menu.uikit.table',
    '/uikit/list': 'menu.uikit.list',
    '/uikit/tree': 'menu.uikit.tree',
    '/uikit/panel': 'menu.uikit.panel',
    '/uikit/overlay': 'menu.uikit.overlay',
    '/uikit/media': 'menu.uikit.media',
    '/uikit/menu': 'menu.uikit.menu',
    '/uikit/message': 'menu.uikit.message',
    '/uikit/file': 'menu.uikit.file',
    '/uikit/charts': 'menu.uikit.charts',
    '/uikit/timeline': 'menu.uikit.timeline',
    '/uikit/misc': 'menu.uikit.misc',
    '/pages/kurumsal-kimlik': 'menu.pages.corporate-identity',
    '/pages/crud': 'menu.pages.crud',
    '/pages/empty': 'menu.pages.empty',
    '/pages/ayarlar': 'menu.pages.settings',
    '/auth/login': 'menu.pages.auth.login'
};

// Eski sabit hâlâ tüketicide çağrılıyorsa adapter (Phase 7C'de breadcrumb component'i t() ile yeniden yazılacak)
export const ROUTE_LABEL_MAP: Record<string, string> = ROUTE_LABEL_KEY_MAP;
```

- [ ] **Adım 7.2: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI veya `ROUTE_LABEL_MAP` ile ilgili tüketici hatası (breadcrumb component vb.) — varsa o dosyayı da `t()` ile güncelle. Genellikle adapter sayesinde geçer.

- [ ] **Adım 7.3: Commit**

```bash
git add src/app/core/config/navigation.config.ts
git commit -m "feat(i18n): navigation.config.ts label → labelKey migration + Ayarlar menü öğesi (Phase 7B Task 7)"
```

---

## Task 8 — `app.menu.ts` `t()` Render Güncellemesi

**Files:**
- Modify: `src/app/layout/component/app.menu.ts`

- [ ] **Adım 8.1: Mevcut `app.menu.ts`'i Read et**

Çalıştır: `cat src/app/layout/component/app.menu.ts`

Mevcut yapı: `computed()` ile `filteredModel` (Phase 7A). Her grup/item `labelKey` varsa `t()` ile çevrilecek.

- [ ] **Adım 8.2: TranslateService inject + mapItem helper ekle**

`app.menu.ts`'in `@Component` class'ı içinde:

```ts
// Üst import'lara EKLE:
import { TranslateService } from '@/app/core/i18n/translate.service';
import type { MenuItem } from 'primeng/api';
import { NAV_GROUPS, NavItem } from '@/app/core/config/navigation.config';

// Class içinde EKLE (mevcut authService, vb. korunur):
private readonly translate = inject(TranslateService);

// filteredModel computed'unu YENİDEN yaz:
filteredModel = computed<MenuItem[]>(() => {
    const roles = this.authService.roles();
    this.translate.dict();  // dil değişince re-eval

    return NAV_GROUPS
        .filter(g => this.hasAccess(g.requiredRoles, roles))
        .map(g => ({
            label: g.labelKey ? this.translate.t(g.labelKey) : g.label,
            icon: g.icon,
            items: (g.items ?? [])
                .filter(i => this.hasAccess(i.requiredRoles, roles))
                .map(i => this.mapItem(i, roles))
        }));
});

private mapItem(item: NavItem, roles: string[]): MenuItem {
    const mapped: MenuItem = {
        label: item.labelKey ? this.translate.t(item.labelKey) : item.label,
        icon: item.icon,
        class: item.class,
        routerLink: item.routerLink,
        ...(item['path'] !== undefined && { 'path': item['path'] })
    };
    if (item.items?.length) {
        mapped.items = item.items
            .filter(sub => this.hasAccess(sub.requiredRoles, roles))
            .map(sub => this.mapItem(sub, roles));
    }
    return mapped;
}

private hasAccess(required: string[] | undefined, userRoles: string[]): boolean {
    if (!required || required.length === 0) return true;
    return required.some(r => userRoles.includes(r));
}
```

**NOT:** Mevcut `hasAccess` veya benzeri helper varsa onu YENİDEN YAZMA — sadece `mapItem` ekle ve `filteredModel`'i `mapItem` kullanacak şekilde refactor et. Önce Read, sonra surgical Edit.

- [ ] **Adım 8.3: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 8.4: Manuel browser smoke test**

`npm run start` → http://localhost:4200
- Sol sidebar tüm Türkçe etiketleri ("Ana Sayfa", "Bileşen Kütüphanesi", "Sayfalar", "Ayarlar", vb.) göstermeli.
- DevTools Console:
   ```js
   localStorage.setItem('mfa.settings.v1', JSON.stringify({ themeMode: 'system', fontScale: 'md', language: 'en' }))
   location.reload()
   ```
   Menü İngilizce olmalı ("Home", "Component Library", "Pages", "Settings", vb.).
- Geri TR:
   ```js
   localStorage.setItem('mfa.settings.v1', JSON.stringify({ themeMode: 'system', fontScale: 'md', language: 'tr' }))
   location.reload()
   ```

- [ ] **Adım 8.5: Commit**

```bash
git add src/app/layout/component/app.menu.ts
git commit -m "feat(menu): labelKey → t() runtime render, dil değişince otomatik güncelle (Phase 7B Task 8)"
```

---

## Task 9 — `SettingsForm` Paylaşılan Component

**Files:**
- Create: `src/app/layout/component/app.settings-form.ts`

- [ ] **Adım 9.1: `app.settings-form.ts` oluştur**

```ts
// src/app/layout/component/app.settings-form.ts

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
    private readonly t = inject(TranslateService);

    readonly themeMode = this.settings.themeMode;
    readonly fontScale = this.settings.fontScale;
    readonly language = this.settings.language;

    readonly themeOptions = computed(() => {
        this.t.dict();
        return [
            { label: this.t.t('settings.theme.light'),  value: 'light'  as ThemeMode },
            { label: this.t.t('settings.theme.dark'),   value: 'dark'   as ThemeMode },
            { label: this.t.t('settings.theme.system'), value: 'system' as ThemeMode }
        ];
    });

    readonly scaleOptions: { label: string; value: FontScale }[] = [
        { label: 'XS', value: 'xs' },
        { label: 'S',  value: 'sm' },
        { label: 'M',  value: 'md' },
        { label: 'L',  value: 'lg' },
        { label: 'XL', value: 'xl' }
    ];

    readonly languageOptions = computed(() => {
        this.t.dict();
        return [
            { label: this.t.t('settings.language.tr'), value: 'tr' as AppLanguage },
            { label: this.t.t('settings.language.en'), value: 'en' as AppLanguage }
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
```

- [ ] **Adım 9.2: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI. Henüz import edilmedi.

- [ ] **Adım 9.3: Commit**

```bash
git add src/app/layout/component/app.settings-form.ts
git commit -m "feat(settings): app-settings-form paylaşılan component (Phase 7B Task 9)"
```

---

## Task 10 — `/pages/ayarlar` Sayfası + Route

**Files:**
- Create: `src/app/pages/ayarlar/ayarlar.ts`
- Modify: `src/app/pages/pages.routes.ts`

- [ ] **Adım 10.1: `ayarlar.ts` oluştur**

```ts
// src/app/pages/ayarlar/ayarlar.ts

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
```

- [ ] **Adım 10.2: `pages.routes.ts`'e route ekle**

`src/app/pages/pages.routes.ts` Read et. Mevcut routes array'ine ekle (kurumsal-kimlik'ten sonra mantıklı):

```ts
// üst import'lara:
import { Ayarlar } from './ayarlar/ayarlar';

// routes array'inde uygun yere:
{ path: 'ayarlar', data: { breadcrumb: 'Ayarlar' }, component: Ayarlar },
```

- [ ] **Adım 10.3: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI.

- [ ] **Adım 10.4: Manuel browser smoke test**

`npm run start` → http://localhost:4200/pages/ayarlar
- Sayfa açılır, 3 ayar (Görünüm/Yazı Tipi Boyutu/Dil) görünür.
- Karanlık'a tıkla → tüm sayfa anında dark.
- "L" font scale → sayfa fontu büyür.
- "English" → tüm metinler İngilizce.
- "Varsayılana Dön" → system/md/tr.
- F5 reload → seçimler kalır.
- Sidebar menüde "Ayarlar" linkinden de açılabilmeli.

- [ ] **Adım 10.5: Commit**

```bash
git add src/app/pages/ayarlar/ src/app/pages/pages.routes.ts
git commit -m "feat(settings): /pages/ayarlar tam sayfa UI + route (Phase 7B Task 10)"
```

---

## Task 11 — Topbar Drawer + Cog Button + FloatingConfigurator Sil

**Files:**
- Modify: `src/app/layout/component/app.topbar.ts`
- Modify: `src/app/layout/component/app.layout.ts`
- Delete: `src/app/layout/component/app.floatingconfigurator.ts`

- [ ] **Adım 11.1: `app.topbar.ts`'i yeniden yaz**

Mevcut dosyayı şu hâle getir (tam değişim):

```ts
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { SettingsService } from '@/app/core/settings/settings.service';
import { AppSettingsForm } from '@/app/layout/component/app.settings-form';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        TooltipModule,
        DrawerModule,
        AppSettingsForm,
        TranslatePipe
    ],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button
                class="layout-menu-button layout-topbar-action"
                (click)="layoutService.onMenuToggle()"
                [attr.aria-label]="'topbar.toggle_menu' | t">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>MFA</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button
                    type="button"
                    class="layout-topbar-action"
                    (click)="settingsOpen.set(true)"
                    [pTooltip]="'topbar.settings' | t"
                    tooltipPosition="bottom"
                    [attr.aria-label]="'topbar.settings' | t">
                    <i class="pi pi-cog"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                pStyleClass="@next"
                enterFromClass="hidden"
                enterActiveClass="animate-scalein"
                leaveToClass="hidden"
                leaveActiveClass="animate-fadeout"
                [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    @if (authService.isLoggedIn()) {
                        <button
                            type="button"
                            class="layout-topbar-action"
                            [pTooltip]="'topbar.logout' | t"
                            tooltipPosition="bottom"
                            (click)="onLogout()">
                            <i class="pi pi-user"></i>
                            <span>{{ authService.displayName() }}</span>
                        </button>
                    } @else {
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-user"></i>
                            <span>{{ 'topbar.profile' | t }}</span>
                        </button>
                    }
                </div>
            </div>
        </div>

        <p-drawer
            [visible]="settingsOpen()"
            (visibleChange)="settingsOpen.set($event)"
            position="right"
            styleClass="!w-full md:!w-96"
            [header]="'settings.title' | t">
            <app-settings-form />
        </p-drawer>
    </div>`
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    settingsService = inject(SettingsService);

    settingsOpen = signal<boolean>(false);

    onLogout(): void {
        this.authService.logout();
    }
}
```

**Önemli:** Eski `toggleDarkMode()` metodu ve `layoutService.isDarkTheme()` referansları artık YOK. Mevcut dosyada vardı; tamamen kaldırıldı.

- [ ] **Adım 11.2: `app.layout.ts`'ten floating configurator referanslarını kaldır**

`src/app/layout/component/app.layout.ts` Read et. İçinde `AppFloatingConfigurator` import + selector kullanımı bul, ikisini de kaldır:

```ts
// İmport silinir:
// import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';

// @Component imports array'inden silinir:
// AppFloatingConfigurator

// Template'ten silinir:
// <app-floating-configurator />
```

- [ ] **Adım 11.3: `app.floatingconfigurator.ts` dosyasını sil**

Çalıştır (PowerShell):
```powershell
Remove-Item -Force src\app\layout\component\app.floatingconfigurator.ts
```

Doğrula:
```bash
ls src/app/layout/component/app.floatingconfigurator.ts
# Beklenen: No such file or directory
```

- [ ] **Adım 11.4: Build doğrulama**

Çalıştır: `npx ng build --configuration development`
Beklenen: BAŞARILI. "Cannot find AppFloatingConfigurator" gelirse `app.layout.ts`'te kalan referans var — bul ve kaldır.

- [ ] **Adım 11.5: Manuel browser smoke test**

`npm run start` → http://localhost:4200
- Topbar sağ üstte `pi-cog` butonu görünür.
- Tıkla → sağ drawer açılır (mobile full-width).
- Drawer içi 3 ayar — drawer'da seçim yap, `/pages/ayarlar` ekranda açıkken senkron değişmeli.
- Drawer dışı tıkla / Escape → kapanır.
- Eski floating configurator artık ekranda YOK.

- [ ] **Adım 11.6: Commit**

```bash
git add src/app/layout/component/app.topbar.ts src/app/layout/component/app.layout.ts
git rm src/app/layout/component/app.floatingconfigurator.ts 2>/dev/null || true
git commit -m "feat(topbar): settings cog + drawer; floatingconfigurator silindi (Phase 7B Task 11)"
```

---

## Task 12 — LayoutService Refactor + Alias Migration + Final Doğrulama

**Files:**
- Modify: `src/app/layout/service/layout.service.ts`
- Modify (spot-fix): `src/app/pages/auth/access.ts`, `error.ts`, `notfound/notfound.ts`, `empty/empty.ts`, `dashboard/dashboard.ts` (gerekirse)

- [ ] **Adım 12.1: `layout.service.ts`'i yeniden yaz**

`src/app/layout/service/layout.service.ts` tam dosya değişimi:

```ts
import { Injectable, computed, signal } from '@angular/core';

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
}

const DEFAULT_STATE: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
    menuHoverActive: false,
    activePath: null
};

@Injectable({ providedIn: 'root' })
export class LayoutService {
    private readonly _state = signal<LayoutState>(DEFAULT_STATE);
    readonly state = this._state.asReadonly();

    readonly isSidebarActive = computed(
        () => this._state().overlayMenuActive || this._state().mobileMenuActive
    );

    transitionComplete = signal<boolean>(false);

    onMenuToggle(): void {
        if (this.isDesktop()) {
            this._state.update((s) => ({
                ...s,
                staticMenuDesktopInactive: !s.staticMenuDesktopInactive
            }));
        } else {
            this._state.update((s) => ({
                ...s,
                mobileMenuActive: !s.mobileMenuActive
            }));
        }
    }

    isDesktop(): boolean {
        return typeof window !== 'undefined' && window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }
}
```

**Silinen alanlar:** `layoutConfig`, `theme`, `isDarkTheme`, `getPrimary`, `getSurface`, `isOverlay`, `configSidebarVisible`, `toggleDarkMode()`, `handleDarkModeTransition()`, `startViewTransition()`, `showConfigSidebar()`, `hideConfigSidebar()`, `initialized`.

- [ ] **Adım 12.2: Tüketici referans taraması**

Çalıştır:
```bash
grep -rn "layoutConfig\|isDarkTheme\|getPrimary\|getSurface\|isOverlay\|configSidebarVisible\|toggleDarkMode" src/app/
```

Her bulunan dosyada düzeltme:
- `layoutService.isDarkTheme()` → `inject(SettingsService).isDark()`
- `layoutService.toggleDarkMode()` → sil (drawer artık yapıyor)
- `layoutService.layoutConfig.update({ darkTheme: ... })` → sil
- `layoutService.isOverlay()` → sil (overlay mode Phase 7B kapsamında değil)
- `layoutService.configSidebarVisible` → sil

**Olası etkilenen dosyalar:** `app.sidebar.ts`, `app.menu.ts` (Phase 7A'da güncellenmiş ama `isDarkTheme` referansı kalmış olabilir). Sadece `grep` çıktısındaki dosyaları düzelt.

- [ ] **Adım 12.3: Alias token spot-migration (kritik sayfalar)**

Önce tarama:
```bash
grep -rn "var(--mfa-surface-[0-9]" src/app/pages/auth/ src/app/pages/notfound/ src/app/pages/empty/ src/app/pages/dashboard/
```

Değiştirme kuralı:
| Eskisi | Yenisi |
|---|---|
| `var(--mfa-surface-0)` | `var(--mfa-bg)` |
| `var(--mfa-surface-50)` | `var(--mfa-bg-elevated)` |
| `var(--mfa-surface-100)` | `var(--mfa-bg-muted)` |
| `var(--mfa-surface-900)` | `var(--mfa-text)` |
| `var(--mfa-surface-600)` | `var(--mfa-text-muted)` |
| `var(--mfa-surface-200)` | `var(--mfa-border)` |

**NOT:** Tüm `surface-*` kullanımı zorunlu değil. Hedef: dark mode'da bozulan kritik sayfalar (auth/access, auth/error, notfound, empty, dashboard) düzelsin. Browser'da `localStorage.setItem('mfa.settings.v1', JSON.stringify({ themeMode: 'dark', fontScale: 'md', language: 'tr' })); location.reload()` ile her sayfayı ziyaret et; bariz bozuk olanları düzelt. Tam tarama Phase 8'de.

- [ ] **Adım 12.4: Final full build doğrulama**

Çalıştır: `npx ng build --configuration production`
Beklenen: BAŞARILI, hata yok.

- [ ] **Adım 12.5: Tam manuel acceptance test (spec §10)**

`npm run start` → http://localhost:4200

10 maddeyi sırasıyla doğrula:

1. **Tema:** Aydınlık/Karanlık/Sistem — view transition smooth, tüm sayfalar uyumlu.
2. **Tema persistence:** Karanlık seç, F5 — karanlık kalır.
3. **Sistem teması:** Sistem seç, OS dark toggle — UI canlı kayar.
4. **Font scale:** 5 preset — orantılı ölçeklenme.
5. **Dil:** TR ↔ EN — menü, topbar, ayarlar paneli + PrimeNG mesajları değişir.
6. **Reset:** Drawer/sayfadan "Varsayılana Dön" — system/md/tr.
7. **Drawer/sayfa senkron:** Drawer değişikliği `/pages/ayarlar` açıkken canlı yansır.
8. **Mobile:** DevTools device mode 375px — drawer full-width, touch hedefleri ≥44px.
9. **Klavye:** Drawer açıkken Tab navigation + Escape kapatır.
10. **localStorage:** `localStorage.clear()` + F5 — DEFAULT_SETTINGS yüklenir, crash yok.

- [ ] **Adım 12.6: `ilerleme-ve-kararlar.md` Phase 7B kapanış**

`docs/ilerleme-ve-kararlar.md`'ye Oturum 3'ün altına ekle:

```markdown
### Phase 7B — Runtime Ayar Sistemi (TAMAMLANDI)

- [x] Task 1: SettingsService + types
- [x] Task 2: mfa-tokens.scss alias + dark + font-scale
- [x] Task 3: theme.config.ts dark colorScheme
- [x] Task 4: index.html baseline + ENVIRONMENT_INITIALIZER
- [x] Task 5: TranslateService + pipe + tr.json/en.json
- [x] Task 6: LOCALE_ID runtime provider
- [x] Task 7: navigation.config.ts labelKey migration
- [x] Task 8: app.menu.ts t() render
- [x] Task 9: AppSettingsForm paylaşılan component
- [x] Task 10: /pages/ayarlar + route
- [x] Task 11: Topbar drawer + floatingconfigurator silindi
- [x] Task 12: LayoutService refactor + alias spot-migration + final build
- [x] Production build: BAŞARILI
- [x] 10 manuel acceptance testi geçti
```

- [ ] **Adım 12.7: Final commit**

```bash
git add src/app/layout/ src/app/pages/ docs/ilerleme-ve-kararlar.md
git commit -m "feat(layout): LayoutService sadece menu state; alias spot-migration; Phase 7B kapanış (Task 12)"
```

---

## Self-Review

### 1. Spec coverage

Spec §1-13 tarandı:
- §3.1-3.4 sorumluluk ayrımı + tipler + API + LayoutService sonrası → Task 1, 12
- §4.1-4.2 token katmanlandırma + PrimeNG dark → Task 2, 3
- §4.3 component yazma kuralı → CLAUDE.md §14 (commit'li)
- §5 font scale → Task 2 (CSS) + Task 4 (HTML)
- §6 i18n → Task 5, 6, 7, 8
- §7 UI tasarımı (drawer + sayfa + form + responsive) → Task 9, 10, 11
- §8 dosya listesi → Tüm task'lar
- §9 persistence → Task 1
- §10 test senaryoları → Task 12.5

Boşluk yok. ✓

### 2. Placeholder scan

- "TBD/TODO/implement later" yok ✓
- Belirsiz "error handling ekle" yok ✓
- Her code step actual code içerir ✓
- "Similar to Task N" yok ✓

### 3. Type consistency

- `ThemeMode`/`FontScale`/`AppLanguage`/`AppSettings` — Task 1, 5, 9'da tutarlı ✓
- `SettingsService.setThemeMode/setFontScale/setLanguage/reset` — Task 1 tanımlı, Task 9 çağırıyor ✓
- `TranslateService.t()` ve `dict()` — Task 5, 8, 9, 10, 11 ✓
- `NavItem.labelKey` / `NavGroup.labelKey` — Task 7 tanımlı, Task 8 okuyor ✓
- `AppSettingsForm` selector `app-settings-form` — Task 9, 10, 11 ✓

Tutarsızlık yok.

---

## Risk Listesi

1. **`LayoutService` tüketici zinciri (Task 12.2):** Grep beklenmedik bir dosyada tema alanı bulabilir; surgical fix + build doğrulama.
2. **Pipe `pure: false` performans:** Her change detection'da `t()` çağrılır. Zoneless + signal-based'de sorun çıkmamalı; Phase 7C'de ölçülür.
3. **`firstValueFrom(http.get(/assets/i18n/*.json))`:** 404 olursa sözlük boş, key fallback görünür. tr.json/en.json oluşturulmuş olmalı (Task 5.1-5.2).
4. **`p-drawer` API'si:** Plan `[visible]` + `(visibleChange)` patterni kullanıyor — `[(visible)]` two-way ile uyumsuz olabilir. Build'de syntax hatası gelirse `[(visible)]="settingsOpenVisible"` getter/setter'a geç.
5. **`ROUTE_LABEL_MAP` adapter (Task 7.1):** Breadcrumb component bunu okuyorsa key görür. Geçici kabul; Phase 7C'de breadcrumb t() ile yeniden yazılacak.

---

## Execution Handoff

Plan tamamlandı ve `docs/superpowers/plans/2026-05-20-phase-7b-runtime-settings.md`'ye yazıldı. 12 task.

### İki Çalıştırma Seçeneği

**1. Subagent-Driven (önerilen)** — Her task için taze subagent dispatch, task arası iki-aşamalı review, hızlı iterasyon. Context şişmesini engeller, plan tutarlılığı korunur.

**2. Inline Execution** — Tüm task'ları bu oturumda checkpoint'lerle batch hâlinde çalıştır. Daha hızlı ama oturum context'i şişer.

Hangi yaklaşımı tercih edersin?
