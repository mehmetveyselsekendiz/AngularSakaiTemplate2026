# Phase 7B — Runtime Ayar Sistemi (Tema, Font, Dil, Persistence)

> **Spec türü:** Design doc (uygulama planı değil)
> **Tarih:** 2026-05-20
> **Hazırlayan:** Claude Code (brainstorming skill ile)
> **Kapsam:** Decomposition altındaki S1 + S2 + S3-min + S4 + S5
> **Sonraki phase'ler:** 7C (i18n full), 8 (palet ihlali + governance), 9 (component kod görüntüleme), 10 (responsive audit)

---

## 1. Amaç

T.C. Dışişleri Bakanlığı MFA Angular template'ine **runtime kullanıcı ayar sistemi** eklemek. Aşağıdaki dört boyutu tek noktadan, kurumsal kimliğe bağlı kalarak, kullanıcı tarafından canlı kontrol edilebilir hâle getirmek:

1. **Tema** (Aydınlık / Karanlık / Sistem)
2. **Yazı tipi boyutu** (5 preset: XS / S / M / L / XL)
3. **Dil** (TR / EN — genişletilebilir)
4. **Persistence** (localStorage, ileride backend hook ile değiştirilebilir)

Sade prensip: **PrimeNG + Angular built-in + 0 yeni paket.** Kurumsal kimlik (renk paleti) son kullanıcı tarafından değiştirilemez; sadece okunur.

## 2. Kapsam Sınırları

### Bu spec'te VAR
- `SettingsService` (yeni) — tema/font/dil + persistence + View Transition
- `LayoutService` refaktörü — sadece menu/sidebar state kalır, ölü kod silinir
- `mfa-tokens.scss` `.app-dark` blok + alias token'lar + `html[data-font-scale]` selector'ları
- `theme.config.ts` PrimeNG dark colorScheme bağlama
- Custom `TranslateService` + `| t` pipe + `tr.json`/`en.json`
- PrimeNG built-in `setTranslation()` ile component metinleri (table/calendar/fileupload vb.)
- Topbar drawer (`<p-drawer>`) — hızlı erişim
- `/pages/ayarlar` tam sayfa — detaylı kontrol (drawer ile canlı senkron)
- `app.floatingconfigurator.ts` silinmesi
- `app.config.ts` `LOCALE_ID` runtime provider + locale data kayıt

### Bu spec'te YOK
- Runtime renk paleti değişimi (kurumsal kimlik sabit)
- Backend persistence (sadece localStorage; ileride `PreferencesAdapter` interface eklenebilir)
- `/uikit/*` demo metinleri çevirisi (Phase 7C)
- Palet ihlali tarayıcı (Phase 8)
- Governance otomasyonu (Phase 8)
- Component kod görüntüleme (Phase 9)
- Responsive audit (Phase 10)
- `@ngx-translate/core` veya başka paket eklenmesi

## 3. Mimari

### 3.1 Sorumluluk Ayrımı

| Servis | Sorumluluk |
|---|---|
| **`SettingsService`** (yeni, `core/settings/`) | Tema modu, font scale, dil, persistence, View Transition sırasında dark sınıfı toggle |
| **`LayoutService`** (refaktör, `layout/service/`) | Sadece sidebar/menu state: `overlayMenuActive`, `mobileMenuActive`, `staticMenuDesktopInactive`, `menuHoverActive`, `onMenuToggle`, `isDesktop()` |
| **`TranslateService`** (yeni, `core/i18n/`) | Sözlük yükleme, dil signal, `t(key, params?)`, PrimeNG `setTranslation()` ile senkron |

`LayoutService`'ten silinen alanlar: `preset`, `primary`, `surface`, `darkTheme`, `menuMode`, `theme` (bozuk computed), `isDarkTheme`, `getPrimary`, `getSurface`, `isOverlay`, `toggleDarkMode`, `handleDarkModeTransition`, `startViewTransition`, `showConfigSidebar`, `hideConfigSidebar`, `configSidebarVisible`. Configurator artık yok.

### 3.2 Tipler (`core/settings/settings.types.ts`)

```ts
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
```

### 3.3 SettingsService API

```ts
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private static readonly STORAGE_KEY = 'mfa.settings.v1';

  private readonly _settings = signal<AppSettings>(this.load());
  private readonly systemPrefersDark = signal<boolean>(this.detectSystemDark());

  readonly settings    = this._settings.asReadonly();
  readonly themeMode   = computed(() => this._settings().themeMode);
  readonly fontScale   = computed(() => this._settings().fontScale);
  readonly language    = computed(() => this._settings().language);
  readonly isDark      = computed(() => this.resolveDark());

  setThemeMode(mode: ThemeMode): void;
  setFontScale(scale: FontScale): void;
  setLanguage(lang: AppLanguage): void;
  reset(): void;

  private resolveDark(): boolean {
    const mode = this._settings().themeMode;
    if (mode === 'system') return this.systemPrefersDark();
    return mode === 'dark';
  }

  private load(): AppSettings { /* localStorage parse + DEFAULT_SETTINGS fallback */ }
  private persist(): void { /* localStorage.setItem(STORAGE_KEY, JSON.stringify(...)) */ }
  private detectSystemDark(): boolean { /* window.matchMedia('(prefers-color-scheme: dark)').matches */ }

  constructor() {
    // 1. matchMedia change listener → systemPrefersDark signal güncelle
    // 2. effect: isDark() değişince → applyDarkClass() + (varsa) startViewTransition
    // 3. effect: fontScale() değişince → document.documentElement.setAttribute('data-font-scale', x)
    // 4. effect: language() değişince → document.documentElement.lang = x
    // 5. effect: any settings change → persist()
  }

  private applyDarkClass(): void {
    document.documentElement.classList.toggle('app-dark', this.isDark());
  }
}
```

**View Transition mantığı:** `applyDarkClass()` çağrısı `document.startViewTransition`'a sarılır (destekleniyorsa). LayoutService'teki mantık kopya değil **taşınır**.

### 3.4 LayoutService Sonrası Hâli

```ts
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _state = signal<{
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
  }>({ /* defaults */ });

  readonly state = this._state.asReadonly();
  readonly isSidebarActive = computed(() => this._state().overlayMenuActive || this._state().mobileMenuActive);

  transitionComplete = signal<boolean>(false);

  onMenuToggle(): void { /* desktop/mobile branş */ }
  isDesktop(): boolean { return window.innerWidth > 991; }
  isMobile(): boolean { return !this.isDesktop(); }
}
```

`menuMode` artık config yok; Sakai default'u `'static'` idi, başka değer hiç verilmedi. `isOverlay()` her yerden çağrılan tek yer `onMenuToggle` içiydi; sabit `false` olduğu için kaldırıldı (overlay branş ölü kod). **İleride overlay menü modu eklenirse bu spec dışı.**

## 4. Dark Mode Stratejisi: Akromatik Invert

### 4.1 Token Katmanlandırma

`mfa-tokens.scss` dosyasına **alias token'lar** eklenir. Component'ler ham `--mfa-surface-*` yerine alias'ları okur — tema değişince otomatik kayar.

```scss
:root {
  // ... mevcut --mfa-red, --mfa-navy vb. korunur

  // ALIAS — light default
  --mfa-bg:          var(--mfa-surface-0);
  --mfa-bg-elevated: var(--mfa-surface-50);
  --mfa-bg-muted:    var(--mfa-surface-100);
  --mfa-text:        var(--mfa-surface-900);
  --mfa-text-muted:  var(--mfa-surface-600);
  --mfa-border:      var(--mfa-surface-200);
  --mfa-brand:       var(--mfa-red);
  --mfa-brand-fg:    #ffffff;
}

.app-dark {
  --mfa-bg:          var(--mfa-surface-950);
  --mfa-bg-elevated: var(--mfa-surface-900);
  --mfa-bg-muted:    var(--mfa-surface-800);
  --mfa-text:        var(--mfa-surface-50);
  --mfa-text-muted:  var(--mfa-surface-300);
  --mfa-border:      var(--mfa-surface-700);

  // Marka renkleri tonal ayar (okunabilirlik için)
  --mfa-red:    var(--mfa-red-500);     // 600 → 500
  --mfa-navy:   var(--mfa-navy-400);    // 600 → 400
  --mfa-gold:   var(--mfa-gold-400);    // 500 → 400
  --mfa-danger: var(--mfa-danger-500);  // 600 → 500
  --mfa-brand:  var(--mfa-red-500);
}
```

**Önemli:** 11-step paletler (`--mfa-red-50..950`) hiç değişmez. Sadece **single-tone token'lar** (`--mfa-red` gibi) `.app-dark` altında farklı step'e bağlanır.

### 4.2 PrimeNG Dark Eşleştirmesi

`theme.config.ts` içinde `definePreset` çağrısına `colorScheme.dark` bloğu eklenir. Aura'nın default dark surface token'ları yerine MFA `--mfa-surface-*` değerleri kullanılır.

PrimeNG'nin dark moduna geçişi `.app-dark` class'ına bağlıdır (Aura'nın default davranışı). `SettingsService.applyDarkClass()` bu class'ı toggle eder.

### 4.3 Component Yazma Kuralı (CLAUDE.md §14 eklemesi)

> **Yeni component yazılırken alias token'lar kullanılır:** `var(--mfa-bg)`, `var(--mfa-text)`, `var(--mfa-border)`, `var(--mfa-brand)`. Doğrudan `--mfa-surface-0` / `--mfa-surface-900` yazmak hâlâ kabul ama dark mode'da statik kalır. PrimeNG severity (`severity="primary"`) en üst tercih — semantic preset'i okur.

## 5. Font Scale

### 5.1 CSS

```scss
:root { font-size: 15px; }  // default md
html[data-font-scale="xs"] { font-size: 13px; }
html[data-font-scale="sm"] { font-size: 14px; }
html[data-font-scale="md"] { font-size: 15px; }
html[data-font-scale="lg"] { font-size: 17px; }
html[data-font-scale="xl"] { font-size: 19px; }
```

### 5.2 Etki

Tailwind v4 ve PrimeNG Aura zaten `rem` tabanlı. `<html>` `font-size` değişince:
- Tailwind `text-sm`, `text-lg`, `p-4`, `gap-6` vb. otomatik ölçeklenir
- PrimeNG `<p-button>`, `<p-table>` padding/border/font-size otomatik ölçeklenir
- Component-level SCSS'lerde `rem` kullanıldığı sürece sorunsuz

### 5.3 Risk

Component SCSS'lerinde **hardcoded `px`** kullanımı font scale'den etkilenmez. Phase 7B'de hızlı grep + gerekli yerlerde `rem`'e çevir; tam denetim Phase 8'de otomatize edilir.

## 6. i18n (Minimum Runtime — Phase 7B)

### 6.1 Bileşenler

```
src/app/core/i18n/
  ├── translate.service.ts   — signal<Locale>, t(key, params?), PrimeNG sync effect
  └── translate.pipe.ts      — { name: 't', pure: false, standalone: true }

src/assets/i18n/
  ├── tr.json
  └── en.json
```

### 6.2 TranslateService API

```ts
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly settings = inject(SettingsService);
  private readonly primeng  = inject(PrimeNG);   // primeng/config
  private readonly _dict = signal<Record<string, string>>({});

  readonly dict = this._dict.asReadonly();
  readonly locale = this.settings.language;  // SettingsService'in signal'ına bağlı

  constructor() {
    effect(async () => {
      const lang = this.locale();
      const json = await fetch(`/assets/i18n/${lang}.json`).then(r => r.json());
      this._dict.set(json);
      this.primeng.setTranslation(this.buildPrimeNgTranslation(json));
    });
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

  private buildPrimeNgTranslation(dict: Record<string, string>): Translation {
    return {
      accept: dict['primeng.accept'],
      reject: dict['primeng.reject'],
      choose: dict['primeng.choose'],
      upload: dict['primeng.upload'],
      cancel: dict['primeng.cancel'],
      // ... date names, table empty message vb.
    };
  }
}
```

### 6.3 Pipe

```ts
@Pipe({ name: 't', pure: false, standalone: true })
export class TranslatePipe implements PipeTransform {
  private readonly svc = inject(TranslateService);
  transform(key: string, params?: Record<string, string | number>): string {
    this.svc.dict();  // signal dependency tracking
    return this.svc.t(key, params);
  }
}
```

**Not:** Signal-based template'lerde signal direkt çağrı (`{{ translateSvc.t('menu.dashboard') }}`) daha temiz olabilir. Pipe Sakai pattern'ine yakın; her ikisi de standalone import edilebilir. Spec'te pipe önerilir (template syntax kısa).

### 6.4 Sözlük Yapısı (örnek)

```json
// tr.json
{
  "menu.dashboard": "Ana Sayfa",
  "menu.library": "Bileşen Kütüphanesi",
  "menu.pages": "Sayfalar",
  "menu.pages.corporate-identity": "Kurumsal Kimlik",
  "menu.pages.settings": "Ayarlar",
  "menu.pages.empty": "Boş Sayfa",
  "menu.pages.notfound": "Sayfa Bulunamadı",
  "topbar.logout": "Çıkış Yap",
  "topbar.settings": "Ayarlar",
  "auth.login.title": "MFA SSO ile Giriş",
  "auth.login.button": "Giriş Yap",
  "settings.title": "Ayarlar",
  "settings.theme.label": "Görünüm",
  "settings.theme.light": "Aydınlık",
  "settings.theme.dark": "Karanlık",
  "settings.theme.system": "Sistem",
  "settings.fontScale.label": "Yazı Tipi Boyutu",
  "settings.language.label": "Dil",
  "settings.reset": "Varsayılana Dön",
  "primeng.accept": "Evet",
  "primeng.reject": "Hayır",
  "primeng.choose": "Seç",
  "primeng.upload": "Yükle",
  "primeng.cancel": "İptal",
  "primeng.emptyMessage": "Kayıt bulunamadı",
  "primeng.emptyFilterMessage": "Sonuç bulunamadı"
}
```

EN ekvivalanları: `"menu.dashboard": "Home"`, `"settings.theme.light": "Light"` vb.

### 6.5 navigation.config.ts Değişikliği

```ts
// Önce:
{ label: 'Ana Sayfa', icon: 'pi pi-home', routerLink: ['/'] }

// Sonra:
{ labelKey: 'menu.dashboard', icon: 'pi pi-home', routerLink: ['/'] }
```

`app.menu.ts` render anında `translate.t(item.labelKey)` çağırır. Signal-aware olduğu için dil değişince menü otomatik güncellenir.

### 6.6 Angular Locale (Date/Currency/Number)

```ts
// app.config.ts
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeTr, 'tr');
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: LOCALE_ID, useFactory: () => inject(SettingsService).language() }
  ]
};
```

**Not:** Angular `LOCALE_ID` runtime'da değişmez (provider factory bir kez çalışır). Date/currency pipe çıktısı dil değiştirince güncellenmez — bu Phase 7B'de **bilinen sınırlama** olarak kabul edilir. Workaround: `formatDate(date, format, lang)` doğrudan çağırılır gerekli yerlerde. Phase 7C'de tam çözüm.

## 7. UI Tasarımı

### 7.1 Topbar Drawer

**Tetikleyici:** `app.topbar.ts`'e `pi-cog` ikon butonu eklenir, mevcut "logout" butonunun solunda.

```html
<button class="layout-topbar-action" (click)="settingsDrawerOpen.set(true)">
  <i class="pi pi-cog"></i>
</button>

<p-drawer
  [(visible)]="settingsDrawerOpenVisible"
  position="right"
  styleClass="!w-full md:!w-96"
  [header]="'settings.title' | t">
  <app-settings-form />
</p-drawer>
```

`<app-settings-form>` standalone component — drawer ve sayfa **aynı formu** kullanır. Tek kaynak, DRY.

### 7.2 Ayarlar Sayfası

```ts
// src/app/pages/ayarlar/ayarlar.ts
@Component({
  standalone: true,
  imports: [CardModule, DividerModule, SettingsFormComponent, ButtonModule, TranslatePipe],
  template: `
    <div class="card">
      <div class="font-semibold text-xl mb-4">{{ 'settings.title' | t }}</div>
      <app-settings-form />
      <p-divider />
      <p-button
        [label]="'settings.reset' | t"
        severity="secondary"
        outlined
        icon="pi pi-refresh"
        (onClick)="settings.reset()" />
    </div>
  `
})
```

### 7.3 SettingsForm (paylaşılan)

```ts
// src/app/layout/component/app.settings-form.ts
@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [SelectButtonModule, SelectModule, FormsModule, TranslatePipe],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Tema -->
      <div>
        <label class="block font-medium mb-2">{{ 'settings.theme.label' | t }}</label>
        <p-selectButton
          [options]="themeOptions()"
          [ngModel]="themeMode()"
          (ngModelChange)="settings.setThemeMode($event)"
          optionLabel="label"
          optionValue="value"
          [allowEmpty]="false" />
      </div>

      <!-- Font Scale -->
      <div>
        <label class="block font-medium mb-2">{{ 'settings.fontScale.label' | t }}</label>
        <p-selectButton
          [options]="scaleOptions"
          [ngModel]="fontScale()"
          (ngModelChange)="settings.setFontScale($event)"
          optionLabel="label"
          optionValue="value"
          [allowEmpty]="false" />
      </div>

      <!-- Dil -->
      <div>
        <label class="block font-medium mb-2">{{ 'settings.language.label' | t }}</label>
        <p-select
          [options]="languageOptions"
          [ngModel]="language()"
          (ngModelChange)="settings.setLanguage($event)"
          optionLabel="label"
          optionValue="value"
          class="w-full" />
      </div>
    </div>
  `
})
export class SettingsFormComponent {
  readonly settings = inject(SettingsService);
  private readonly t = inject(TranslateService);

  themeMode = this.settings.themeMode;
  fontScale = this.settings.fontScale;
  language  = this.settings.language;

  themeOptions = computed(() => [
    { label: this.t.t('settings.theme.light'),  value: 'light'  as const },
    { label: this.t.t('settings.theme.dark'),   value: 'dark'   as const },
    { label: this.t.t('settings.theme.system'), value: 'system' as const }
  ]);
  scaleOptions = [
    { label: 'XS', value: 'xs' as const },
    { label: 'S',  value: 'sm' as const },
    { label: 'M',  value: 'md' as const },
    { label: 'L',  value: 'lg' as const },
    { label: 'XL', value: 'xl' as const }
  ];
  languageOptions = [
    { label: 'Türkçe',  value: 'tr' as const },
    { label: 'English', value: 'en' as const }
  ];
}
```

### 7.4 Responsive Davranış

| Viewport | Drawer | Sayfa |
|---|---|---|
| < 768px (mobile) | Full-width, top-down | Tek kolon |
| 768-1023 (tablet) | 384px sağda | Tek kolon |
| ≥ 1024 (desktop) | 384px sağda | 2 kolon (Görünüm+Yazı / Dil+Hakkında) |

PrimeNG SelectButton wrapping default açık — mobile'da düğmeler 2 satıra düşebilir.

## 8. Dosya Değişim Listesi

### Yeni dosyalar (8)

| Dosya | Satır tahmini |
|---|---|
| `src/app/core/settings/settings.types.ts` | ~25 |
| `src/app/core/settings/settings.service.ts` | ~130 |
| `src/app/core/i18n/translate.service.ts` | ~70 |
| `src/app/core/i18n/translate.pipe.ts` | ~20 |
| `src/assets/i18n/tr.json` | ~80 key |
| `src/assets/i18n/en.json` | ~80 key |
| `src/app/layout/component/app.settings-form.ts` | ~80 |
| `src/app/pages/ayarlar/ayarlar.ts` | ~40 |

### Değişen dosyalar (~11)

| Dosya | Değişim özeti |
|---|---|
| `src/assets/mfa-tokens.scss` | Alias token blok + `.app-dark` override + `html[data-font-scale]` |
| `src/app/core/config/theme.config.ts` | `definePreset` → `semantic.colorScheme.dark` |
| `src/app/layout/service/layout.service.ts` | Sadece menu/sidebar state — tema-related her şey silinir |
| `src/app/layout/component/app.topbar.ts` | Ayarlar butonu + drawer trigger |
| `src/app/layout/component/app.layout.ts` | `<app-floating-configurator>` kaldır |
| `src/app/layout/component/app.menu.ts` | `t()` çağrıları, `labelKey` desteği |
| `src/app/core/config/navigation.config.ts` | `label` → `labelKey`; "Ayarlar" eklenir |
| `src/app/pages/pages.routes.ts` | `ayarlar` route |
| `src/app.config.ts` | `LOCALE_ID` provider + `registerLocaleData` |
| `src/index.html` | `<html lang="tr" data-font-scale="md">` |
| `package.json` | Yeni paket YOK (sadece doğrulama) |

### Silinecek dosyalar (1)

| Dosya | Sebep |
|---|---|
| `src/app/layout/component/app.floatingconfigurator.ts` | Drawer onun yerine geçer |

## 9. Persistence

```ts
// SettingsService.load()
private load(): AppSettings {
  try {
    const raw = localStorage.getItem(SettingsService.STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      themeMode: isValidThemeMode(parsed?.themeMode) ? parsed.themeMode : DEFAULT_SETTINGS.themeMode,
      fontScale: isValidFontScale(parsed?.fontScale) ? parsed.fontScale : DEFAULT_SETTINGS.fontScale,
      language:  isValidLanguage(parsed?.language)   ? parsed.language  : DEFAULT_SETTINGS.language,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
```

**Storage key versiyonu:** `mfa.settings.v1`. İleride şema değişirse `v2` ile breaking migration yapılabilir, v1 read edilip migrate edilir.

**SSR uyarı:** `localStorage` server-side erişilemez — `inject(PLATFORM_ID)` + `isPlatformBrowser` guard gerekir. Implementation sırasında `app.config.ts` mevcut SSR ayarı kontrol edilir.

## 10. Test Senaryoları

### Manuel kabul testleri (build doğrulama dışında)

1. **Tema:** `themeMode='light'`/`'dark'`/`'system'` her geçişte view transition (destekliyorsa) + tüm sayfalar light/dark uyumlu.
2. **Tema persistence:** Sayfa reload sonrası seçim korunur.
3. **Sistem teması:** `themeMode='system'`, OS dark mode değişince UI canlı kayar.
4. **Font scale:** 5 preset'in hepsi farklı font boyutu üretir; PrimeNG bileşenleri orantılı ölçeklenir.
5. **Dil:** TR ↔ EN geçişte menü, topbar, ayarlar paneli metinleri değişir; PrimeNG tablosu boş mesajı değişir.
6. **Reset:** "Varsayılana Dön" → `system`/`md`/`tr` (DEFAULT_SETTINGS).
7. **Drawer/sayfa senkron:** Drawer'da değişiklik → sayfa açıkken anında yansır (aynı signal).
8. **Mobile:** 375px viewport'ta drawer full-width, butonlar dokunulabilir (≥44px).
9. **Klavye:** Drawer tab navigation + Escape kapatır (PrimeNG default).
10. **localStorage:** Tarayıcı storage temizlendiğinde DEFAULT_SETTINGS yüklenir, hata atmaz.

### Otomatik test

Phase 7B'de **birim test yazılmaz** — proje genel test stratejisi Phase 8+'de tartışılır. Sakai'nin karma+jasmine setup'ı duruyor; kullanılıp kullanılmayacağı kullanıcı kararıdır.

## 11. Riskler ve Bilinen Sınırlamalar

| Risk | Etki | Azaltma |
|---|---|---|
| LayoutService refaktör component'leri kırabilir | Build/render bozulması | Adım adım: önce SettingsService ekle, sonra LayoutService'ten kaldır; ara build doğrulamaları |
| `LOCALE_ID` runtime değişmez | Date/currency pipe dil değişince güncellenmez | Bilinen sınırlama, Phase 7C'de çözülür |
| Hardcoded `px` font scale'i bypass eder | Font scale tutarsız | Hızlı grep + spot-fix; tam tarama Phase 8'de |
| Mevcut component'ler `--mfa-surface-*` doğrudan kullanıyorsa dark mode'da statik kalır | Görsel bozukluk | Alias migration spot-fix (en kritik dosyalar: `auth/access`, `auth/error`, `notfound`, `empty`, dashboard) |
| `dict()` async yükleme — ilk render boş key gösterebilir | UX flash | İlk yüklemede `APP_INITIALIZER` ile pre-load veya `key` fallback kabul |
| SSR + localStorage | Server crash | `isPlatformBrowser` guard |

## 12. CLAUDE.md Güncellemeleri (Özet — Bu Spec'in Parçası)

### Eklenir

- **§3** İzin verilen paketler listesine açıklama: "i18n için 0 paket — PrimeNG `setTranslation()` + custom mini-service yeterli"
- **§14** Component governance'a alias token kuralı: "Yeni component `var(--mfa-bg)`, `var(--mfa-text)`, `var(--mfa-border)`, `var(--mfa-brand)` kullanır"
- **YENİ §15 — Runtime Ayar Sistemi (Tema/Dil/Font)**
  - `SettingsService` tek kaynak — direct `document.documentElement.classList.add('app-dark')` yasak
  - `LayoutService` tema yönetmez (artık)
  - `| t` pipe ile çevrilebilir tüm UI metinleri (sabit Türkçe string yazma; yeni metin için key ekle)
  - Hardcoded `px` font yerine `rem` (font scale uyumu için)

### Silinir

- **§9 Sakai Upstream Sync bloğu** — kullanıcı kararı (oturum 2026-05-20): "upstream artık yapmıyoruz, Sakai kodları çekildi, kendi template'imiz"
- §9 başlığı "Sakai'ye Müdahale Kuralı" → "Klasör Sorumluluğu" olarak yeniden adlandırılır; minimum diff ve özel klasör mantığı korunur

### Numaralandırma

- Mevcut §15 "Bir Şeyden Emin Değilsen" → §16'ya kayar (yeni §15 araya girer)

## 13. Sonraki Phase'ler — Kısa Önizleme

| Phase | Kapsam | Tahmini büyüklük |
|---|---|---|
| **7C** | Tam i18n — `/uikit/*` demo metinleri, dashboard, Kurumsal Kimlik, CRUD; LOCALE_ID runtime sorununu çöz | Orta |
| **8** | Palet ihlali tarayıcı (build-time stylelint + runtime denetim sayfası) + governance otomasyonu (pre-commit hook + CI) | Büyük |
| **9** | `/uikit/*` her bileşen için "Kodu Göster" — kaynak `.ts`'den compile-time extraction (Vite plugin veya build script) | Büyük |
| **10** | Responsive audit — tüm sayfalar 5 breakpoint'te doğrulama + kırık layoutların düzeltilmesi | Orta |

## 14. Açık Sorular

Hiçbiri spec onaylanmadan bloklamaz; implementation sırasında karara bağlanır:

1. **Drawer trigger ikon:** `pi-cog` (varsayılan) vs `pi-sliders-h` (ayarlar daha az teknik). Önerilen `pi-cog`.
2. **Font scale `<p-selectbutton>` vs `<p-slider>`:** SelectButton'da etiketler belirgin (XS/S/M/L/XL); slider daha az yer kaplar. Önerilen SelectButton.
3. **Dil değiştirme UX:** Anında geçer mi yoksa "Sayfayı yenile" mesajı mı? Anında geçer (signal-aware pipe sayesinde mümkün); LOCALE_ID-bağlı pipe'lar sınırlama olarak kabul.
4. **`app.menu.ts` `labelKey` migration:** Tüm `label` field'ları aynı anda mı yoksa kademeli mi? Önerilen tek seferde tüm `navigation.config.ts`.
5. **`app.floatingconfigurator.ts` silme zamanı:** Drawer çalıştığı doğrulandıktan sonra mı yoksa aynı PR'da mı? Önerilen aynı PR (ölü kod kalmasın).

---

**Spec sonu.** Onay sonrası `writing-plans` skill'i ile implementation plan oluşturulacak.
