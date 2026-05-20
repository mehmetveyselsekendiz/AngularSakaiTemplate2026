# Sakai-ng → MFA Frontend Template Uyarlama Planı

**Tarih:** Mayıs 2026
**Başlangıç:** PrimeFaces `sakai-ng` (Angular 21 stable + PrimeNG 21 Aura + Tailwind v4)
**Hedef:** T.C. Dışişleri Bakanlığı kurumsal Angular frontend template
**Tahmin:** 7-8 iş günü
**Önceki yaklaşım:** `docs/angular-migration-plan.md` (sıfırdan Angular 22 RC). **Artık geçersiz** — Sakai stable v21 üzerine inşa ediyoruz.

---

## 0. Yönetici Özeti

- **Yaklaşım değişikliği:** Plan'ın orijinali "sıfırdan Angular 22 RC scaffold" idi. Mayıs 2026 itibarıyla Angular 22 hâlâ RC (release candidate). PrimeFaces'ın resmi admin template'i **sakai-ng**, Angular 21 stable + PrimeNG 21 Aura + Tailwind v4 + signal-based mimarisi ile hazır geldi. Bunu **başlangıç noktası** olarak kabul ediyoruz.
- **Felsefe değişmedi:** Minimum bağımlılık. Sakai sadece bize iskelet veriyor; MFA'ya özgü her şeyi (palet, auth, modül yapısı) biz ekliyoruz.
- **Avantaj:** Layout + sidebar + topbar + dark mode + 15+ UIKit demo sayfası + CRUD örneği hazır. ~6 günlük zaman tasarrufu.
- **Risk:** Sakai upstream (`primefaces/sakai-ng`) ile sync. Patch'lerimizi mümkün olduğunca **MFA'ya özgü dosyalarda** (yeni `core/`, yeni `features/`) tutacağız, Sakai'nin kendi dosyalarına minimal müdahale.

### Mayıs 2026 İtibarıyla Sakai'nin Bize Verdikleri

- ✓ **Standalone components** (Angular module YOK — modern Angular)
- ✓ **`provideZonelessChangeDetection()`** — zoneless
- ✓ **Signal-based `LayoutService`** — sidebar/dark mode state'i `signal()` ile
- ✓ **PrimeNG 21 Aura** + `@primeuix/themes` (eski `@primeng/themes`'in yeni adı)
- ✓ **Tailwind v4** (`@tailwindcss/postcss`) + `tailwindcss-primeui` köprüsü
- ✓ MIT license
- ✓ Layout, Topbar, Sidebar, Menu, Footer, Configurator, FloatingConfigurator
- ✓ Auth UI sayfaları (login, access, error) — sadece görsel, OIDC bağlama bize
- ✓ UIKit demo sayfaları (`pages/uikit/*`) — "Kütüphane" sayfası iskeleti
- ✓ CRUD demo (`pages/crud/crud.ts`) — Personel modülü iskeleti
- ✓ Documentation, Empty, Notfound sayfaları
- ✓ View Transitions API ile dark mode geçişi
- ✓ `app.routes.ts` + lazy load
- ✓ **Rich text editor için Quill** (PrimeNG `<p-editor>`'ın peer dep'i) — Sakai zaten dahil etmiş

### Sakai'de Olmayanlar / Değiştireceklerimiz

- ❌ Angular 22 (bizde Angular 21 stable — Sakai upstream'e bağlı)
- ❌ Signal Forms (Plan A); v22'de stable, Sakai v21'de yok → **Reactive Forms** (built-in, yedek plan)
- ❌ Manuel OIDC auth (Sakai login.ts hardcoded `routerLink="/"` — biz `AuthService` ekleyeceğiz)
- ❌ MFA paleti (Sakai default `emerald` primary — `#DA291C`'ye çevireceğiz)
- ❌ Helvetica font kilidi (Sakai default font stack — overwrite edeceğiz)
- ❌ `window.__ENV__` reader (Sakai yok — React'ten port edeceğiz)
- ❌ Docker / OpenShift config (yok — React'ten port edeceğiz)
- ❌ HTTP interceptor (auth interceptor, error interceptor)
- ❌ Permission service (rol-bazlı yetki)
- ❌ Türkçe UI

---

## 1. Stack — Sakai + MFA Eklemeleri

| Katman | Sakai'de Var | MFA Eklemesi | Versiyon |
|---|---|---|---|
| **Framework** | Angular 21 stable | — | `@angular/core ^21` (Sakai default) |
| **TypeScript** | `~5.9.3` | — | Sakai default |
| **UI Library** | PrimeNG 21.x Aura | — | `primeng ^21.0.2` |
| **Theme paketi** | `@primeuix/themes ^2.0.0` | `definePreset(Aura)` ile `MfaPreset` | — |
| **Stil** | Tailwind v4 + SCSS | `src/assets/mfa-tokens.scss` (MFA paleti) | `tailwindcss ^4.1.11` |
| **Tailwind köprüsü** | `tailwindcss-primeui ^0.6.1` | — | — |
| **İkonlar** | `primeicons ^7.0.0` | — | — |
| **Rich Text** | `quill ^2.0.3` (PrimeNG `<p-editor>` peer dep) | — | KORU |
| **Change detection** | zoneless | — | — |
| **Routing** | Angular Router (lazy) | `core/auth/auth.guard.ts` (functional CanActivateFn) | — |
| **HTTP** | `HttpClient` + `withFetch()` | `core/auth/auth.interceptor.ts`, `core/http/error.interceptor.ts` | — |
| **Server state** | (yok, services basit) | `httpResource()` / `resource()` | Angular 21'de mevcut |
| **Client state** | Signal-based services | — | — |
| **Form** | `FormsModule` (template-driven) | **Reactive Forms** (`ReactiveFormsModule`) — built-in | — |
| **Auth** | Yalnız UI | Manuel OIDC: `AuthService` + Guard + Interceptor + Callback | — |
| **Toast** | (Sakai bazı sayfalarda kullanıyor) | `MessageService` + root `<p-toast>` | — |

### Silinecek Paketler (Sakai default'unda var ama bize gereksiz)

- ❌ `primeclt` (Sakai-spesifik CLI tool — kullanmıyoruz)
- ⚠ `chart.js`: **DİKKAT** — PrimeNG `<p-chart>` zaten chart.js peer dependency olarak kullanıyor. Direct kaldırmadan önce `npm ls chart.js` ile kontrol et; eğer PrimeNG çekiyorsa direct entry silinebilir, indirect kalır. Eğer kararsızsan **kalsın**.

### Korunacak Paketler (Sakai default'unda var, biz de kullanacağız)

- ✓ `quill` — PrimeNG `<p-editor>` (rich text editor) peer dep'i. MFA modüllerinde duyuru, vize başvuru notu, raporlama gibi yerlerde işe yarar. Kütüphane sayfasında örnek olarak göstereceğiz.
- ✓ `chart.js` — PrimeNG `<p-chart>` için (dashboard widget'ları)

### Eklenecek Paket — Sıfır

Hiçbir external paket eklemiyoruz. Tüm ihtiyaçlar Angular + PrimeNG + Tailwind built-in'i ile karşılanır.

---

## 2. Sakai Klasör Yapısı — Mevcut + MFA Eklemeleri

```
src/
├── app/
│   ├── layout/                           # [SAKAİ — DOKUNMA, sadece TR text]
│   │   ├── component/
│   │   │   ├── app.layout.ts             # Ana layout (header/sidebar/main/footer)
│   │   │   ├── app.topbar.ts             # Topbar (logo, dark toggle, configurator)
│   │   │   ├── app.sidebar.ts            # Sidebar wrapper
│   │   │   ├── app.menu.ts               # *** SİDEBAR MENÜ MODELİ — MFA'ya göre yaz ***
│   │   │   ├── app.menuitem.ts           # Menü öğesi (multi-level)
│   │   │   ├── app.footer.ts             # Footer
│   │   │   ├── app.configurator.ts       # Tema seçici → KALDIR veya SADECE dark toggle bırak
│   │   │   └── app.floatingconfigurator.ts  # Floating button → KALDIR
│   │   └── service/
│   │       └── layout.service.ts         # Signal-based — primary'yi MFA'ya kilitle
│   │
│   ├── core/                             # *** MFA EKLEMESİ — yeni klasör ***
│   │   ├── auth/
│   │   │   ├── auth.service.ts           # Signal-based user/roller/token, OIDC redirect
│   │   │   ├── auth.guard.ts             # Functional CanActivateFn
│   │   │   ├── auth.interceptor.ts       # Bearer token + 401 redirect
│   │   │   ├── auth.callback.component.ts  # SSO callback handler
│   │   │   └── permission.service.ts     # hasRole / anyRole signals
│   │   ├── http/
│   │   │   └── error.interceptor.ts      # 403/422/5xx → MessageService toast
│   │   └── config/
│   │       ├── app-env.ts                # window.__ENV__ reader (React'ten port)
│   │       ├── theme.config.ts           # MfaPreset = definePreset(Aura, {...})
│   │       └── navigation.config.ts      # Sidebar menüsü (rol-bazlı) — app.menu.ts buradan okur
│   │
│   ├── pages/                            # [SAKAİ — temizle ve TR'ye çevir]
│   │   ├── auth/
│   │   │   ├── login.ts                  # *** OIDC redirect ile bağla ***
│   │   │   ├── access.ts                 # 403 sayfası — TR
│   │   │   ├── error.ts                  # Hata sayfası — TR
│   │   │   └── auth.routes.ts            # + callback route ekle
│   │   ├── dashboard/                    # Sakai e-commerce dashboard — MFA'ya UYARLA
│   │   │   ├── dashboard.ts              # Widget'ları MFA modüllerine göre değiştir
│   │   │   └── components/               # statswidget, recentsales vs. — TR + sahte veri yerine staging
│   │   ├── uikit/                        # *** "KÜTÜPHANE" sayfası — TR çeviri + MFA renkleri ***
│   │   │   ├── buttondemo.ts             # Buton örnekleri
│   │   │   ├── inputdemo.ts              # Form input örnekleri
│   │   │   ├── tabledemo.ts              # Tablo örnekleri
│   │   │   ├── chartdemo.ts              # Grafik
│   │   │   ├── formlayoutdemo.ts         # Form layout
│   │   │   ├── messagesdemo.ts           # Mesaj/Toast
│   │   │   ├── overlaydemo.ts            # Dialog/Drawer
│   │   │   ├── panelsdemo.ts             # Card/Panel/Tabs/Accordion
│   │   │   ├── editordemo.ts             # *** YENİ — <p-editor> Quill örneği ***
│   │   │   └── ... (15+ dosya)
│   │   ├── crud/
│   │   │   └── crud.ts                   # *** "Personel" örneğine dönüştür ***
│   │   ├── service/                      # *** SİL — demo verileri ***
│   │   │   ├── product.service.ts        # SİL
│   │   │   ├── customer.service.ts       # SİL
│   │   │   ├── country.service.ts        # SİL (gerekirse koruma)
│   │   │   ├── icon.service.ts           # SİL
│   │   │   ├── node.service.ts           # SİL
│   │   │   └── photo.service.ts          # SİL
│   │   ├── landing/                      # *** TÜM KLASÖRÜ SİL — MFA için gereksiz ***
│   │   ├── notfound/                     # KALSIN (TR çevir)
│   │   ├── empty/                        # KALSIN (boş şablon)
│   │   └── documentation/                # SİL veya MFA dokümanına çevir
│   │
│   └── features/                         # *** MFA EKLEMESİ — modül kodu buraya ***
│       └── personel/                     # Örnek modül
│           ├── personel.routes.ts
│           ├── personel.service.ts       # HttpClient + httpResource()
│           ├── personel.models.ts        # interface Personel { ... }
│           ├── list/
│           │   └── personel-list.component.ts
│           ├── form/
│           │   └── personel-form.component.ts  # Reactive Forms (Signal Forms değil)
│           └── components/
│
├── assets/                               # [SAKAİ konumu — angular.json bunu işaret eder]
│   ├── styles.scss                       # *** MFA paleti import burada ***
│   ├── tailwind.css                      # Tailwind v4 base + theme inline
│   ├── mfa-tokens.scss                   # *** YENİ — MFA renk değişkenleri ***
│   └── mfa-logo.svg                      # MFA armason / icon
│
├── environments/                         # *** YENİ — Angular CLI standart ***
│
├── app.component.ts                      # Sakai default
├── app.config.ts                         # *** GÜNCELLE — MfaPreset + interceptors ***
├── app.routes.ts                         # *** GÜNCELLE — auth callback + guard ***
└── main.ts                               # Sakai default

public/
├── demo/                                 # *** TÜM KLASÖRÜ SİL — Sakai demo görselleri ***
├── favicon.ico                           # MFA armason ile değiştir
└── config.js                             # *** YENİ — window.__ENV__ runtime config ***
```

---

## 3. MFA Tema Mimarisi

### Yaklaşım

Sakai'nin `LayoutService.layoutConfig` signal'ı runtime'da `preset` ve `primary` değiştirmeye izin veriyor (`AppConfigurator` UI'sıyla). MFA için bunu **kilitliyoruz** — sadece dark mode toggle açık kalsın.

### `src/assets/mfa-tokens.scss` (TEK KAYNAK)

```scss
// T.C. Dışişleri Bakanlığı — Kurumsal Renk Token'ları
:root {
  // Ham marka renkleri
  --mfa-red:       #DA291C;  // Pantone 199 C
  --mfa-gold:      #D7AD4D;  // Sadece tören/sertifika
  --mfa-gray:      #53565A;
  --mfa-navy:      #003773;  // Pantone 287
  --mfa-navy-dark: #00235A;  // Pantone 288

  // Primary 11-step ramp (PrimeNG zorunlu)
  --mfa-red-50:  #FFF5F4;
  --mfa-red-100: #FFE3E0;
  --mfa-red-200: #FFC2BC;
  --mfa-red-300: #FF9388;
  --mfa-red-400: #F4604F;
  --mfa-red-500: #DA291C;
  --mfa-red-600: #B61F14;
  --mfa-red-700: #921810;
  --mfa-red-800: #6E120C;
  --mfa-red-900: #4D0C08;
  --mfa-red-950: #2A0604;

  // Surface ramp (nötr)
  --mfa-surface-0:   #FFFFFF;
  --mfa-surface-50:  #FAFAFA;
  --mfa-surface-100: #F4F4F5;
  --mfa-surface-200: #E4E4E7;
  --mfa-surface-300: #D4D4D8;
  --mfa-surface-400: #A1A1AA;
  --mfa-surface-500: #71717A;
  --mfa-surface-600: #52525B;
  --mfa-surface-700: #3F3F46;
  --mfa-surface-800: #27272A;
  --mfa-surface-900: #18181B;
  --mfa-surface-950: #09090B;
}
```

### `src/app/core/config/theme.config.ts`

```ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const v = (token: string) => `var(--mfa-${token})`;

export const MfaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: v('red-50'),   100: v('red-100'), 200: v('red-200'), 300: v('red-300'),
      400: v('red-400'), 500: v('red-500'), 600: v('red-600'), 700: v('red-700'),
      800: v('red-800'), 900: v('red-900'), 950: v('red-950'),
    },
    colorScheme: {
      light: {
        primary: { color: '{primary.500}', contrastColor: '#ffffff',
                   hoverColor: '{primary.600}', activeColor: '{primary.700}' },
        surface: { 0: v('surface-0'), 50: v('surface-50'), 100: v('surface-100'),
                   200: v('surface-200'), 300: v('surface-300'), 400: v('surface-400'),
                   500: v('surface-500'), 600: v('surface-600'), 700: v('surface-700'),
                   800: v('surface-800'), 900: v('surface-900'), 950: v('surface-950') },
      },
      dark: {
        primary: { color: '{primary.400}', contrastColor: v('surface-900'),
                   hoverColor: '{primary.300}', activeColor: '{primary.200}' },
        surface: { 0: v('surface-950'), 50: v('surface-900'), 100: v('surface-800'),
                   200: v('surface-700'), 300: v('surface-600'), 400: v('surface-500'),
                   500: v('surface-400'), 600: v('surface-300'), 700: v('surface-200'),
                   800: v('surface-100'), 900: v('surface-50'),  950: v('surface-0') },
      },
    },
  },
});
```

### `src/app.config.ts` (Sakai default → MFA güncellemesi)

```ts
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { MfaPreset } from './app/core/config/theme.config';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { errorInterceptor } from './app/core/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideZonelessChangeDetection(),
    providePrimeNG({
      theme: {
        preset: MfaPreset,
        options: {
          darkModeSelector: '.app-dark',  // Sakai default — KORUYORUZ
          cssLayer: { name: 'primeng', order: 'tailwind-base, primeng, tailwind-utilities' },
        },
      },
    }),
  ],
};
```

### `src/assets/styles.scss` Güncellemesi

```scss
// MFA token'larını ilk import et
@import './mfa-tokens.scss';

// Sakai'nin orijinal styles.scss içeriği aynen kalır
// (layout SCSS'leri, kendi @import'ları)
```

### Tailwind v4 — `src/assets/tailwind.css`

```css
@import "tailwindcss";
@import "tailwindcss-primeui";

@theme inline {
  --color-primary:          var(--mfa-red);
  --color-brand-red:        var(--mfa-red);
  --color-brand-gold:       var(--mfa-gold);
  --color-brand-gray:       var(--mfa-gray);
  --color-brand-navy:       var(--mfa-navy);
  --color-brand-navy-dark:  var(--mfa-navy-dark);
}
```

---

## 4. Faz Faz Yol Haritası (Day 0 → Day 8)

### Phase 0 — Doğrulama (Day 0, ~1 saat)

**Hedef:** Sakai'yi olduğu gibi çalıştır, MFA'ya başlamadan baseline'ı gör.

- [ ] `cd C:\Users\...\AngularSakaiTemplate2026`
- [ ] `npm install` (Sakai'nin tüm bağımlılıkları)
- [ ] `npm run start` → http://localhost:4200 — default emerald Sakai dashboard görmelisin
- [ ] **Doğrulama:** Sidebar açılıyor, dark toggle çalışıyor, UIKit ve CRUD sayfaları erişilebilir
- [ ] `docs/angular-migration-plan.md` (tarihsel referans) zaten kopyalı — incele ama uygulama
- [ ] `.reference-react/` React kaynak kodunu Sakai dizinine clone'la:
  ```bash
  git clone https://github.com/mehmetveyselsekendiz/ReactTemplate2026.git .reference-react
  echo .reference-react/ >> .gitignore
  ```
- [ ] Git: ilk commit `chore: initial sakai-ng baseline + docs`

### Phase 1 — Temizlik (Day 1, ~3-4 saat)

**Hedef:** Sakai'nin demo içeriğini sil, MFA için yer aç. **Quill ve chart.js kalsın** (PrimeNG bileşenlerinin peer dep'i).

- [ ] **Sil:** `src/app/pages/landing/` (tüm landing klasörü)
- [ ] **Sil:** `src/app/pages/service/product.service.ts`, `customer.service.ts`, `node.service.ts`, `photo.service.ts`, `icon.service.ts`
- [ ] **Sil:** `public/demo/images/galleria/`, `public/demo/images/product/`, `public/demo/images/flag/`
- [ ] **`src/app/layout/component/app.menu.ts`** — Hierarchy demo submenu'leri ve "Pages" altındaki Landing/Auth submenu'leri kaldır
- [ ] **`src/app.routes.ts`** — `path: 'landing'` rotasını sil
- [ ] **`src/app/layout/component/app.configurator.ts`** — Primary color ve preset (Aura/Lara/Nora) seçeneklerini sil; **sadece dark/light toggle bırak** (veya tüm AppConfigurator'ı kaldır)
- [ ] **`src/app/layout/component/app.floatingconfigurator.ts`** — Auth sayfalarında görünen float button — kaldır
- [ ] `app.topbar.ts`'te "PrimeLand" yazısı varsa "MFA Frontend" yap
- [ ] `package.json`'dan `primeclt` kaldır
- [ ] **DOKUNMA:** `quill` (PrimeNG `<p-editor>` peer dep — Kütüphane sayfası rich text örneği için), `chart.js` (PrimeNG `<p-chart>` peer dep — dashboard için)
- [ ] `npm install` (lock güncelle)
- [ ] `npm run start` → her şey hâlâ çalışıyor mu doğrula
- [ ] Git: commit `chore(cleanup): remove sakai demo content`

### Phase 2 — MFA Teması (Day 1-2, ~4-6 saat)

**Hedef:** MFA paleti her yerde görünüyor. Default emerald'ın yerine MFA kırmızısı.

- [ ] `src/assets/mfa-tokens.scss` oluştur (yukarıdaki Bölüm 3)
- [ ] `src/assets/styles.scss` en başına `@import './mfa-tokens.scss';` ekle
- [ ] `src/assets/tailwind.css`'ye `@theme inline` bloğu ekle (yukarıdaki Bölüm 3)
- [ ] `src/app/core/config/theme.config.ts` oluştur — `MfaPreset` (yukarıdaki Bölüm 3)
- [ ] `src/app.config.ts`'i güncelle: `Aura` yerine `MfaPreset` ver, `cssLayer` ekle
- [ ] `src/app/layout/service/layout.service.ts`'i güncelle: `layoutConfig` signal'ının default'unu MFA değerlerine sabitle (`primary: 'mfa-red'`, `surface: null`). Kullanıcının runtime'da değiştirmesini engelle (`AppConfigurator`'ı kaldırdığımız için zaten yapamayacak)
- [ ] **Font:** `src/assets/styles.scss`'te `body { font-family: Helvetica, Arial, sans-serif; }` ekle
- [ ] **Logo:** `public/favicon.ico` → MFA armason ile değiştir; `src/assets/mfa-logo.svg` ekle; `app.topbar.ts`'te logo referansını güncelle
- [ ] `npm run start` → buton ve ikonlar **MFA kırmızısı**, dark mode hâlâ çalışıyor
- [ ] **Doğrulama:** `<p-button>` ve sidebar active state MFA kırmızısı
- [ ] Git: commit `feat(theme): apply MFA palette via MfaPreset + tokens`

### Phase 3 — Auth (Day 2-4, ~1-2 gün)

**Hedef:** Manuel OIDC. Login → SSO redirect → callback → token kaydet → user signal'a yaz.

- [ ] `src/app/core/auth/auth.service.ts` oluştur:
  - Signal: `user`, `token`, `roles` (computed), `isLoggedIn` (computed)
  - `loginRedirect(returnTo?)` → `window.location.href = ssoUrl + ...`
  - `handleCallback(code, state)` → token exchange + user parse
  - `logout()` → token sıfırla + SSO logout URL'sine git
- [ ] `src/app/core/auth/auth.guard.ts` — `CanActivateFn`: `isLoggedIn` yoksa `loginRedirect(state.url)`
- [ ] `src/app/core/auth/auth.interceptor.ts` — `HttpInterceptorFn`: Bearer token ekle
- [ ] `src/app/core/http/error.interceptor.ts` — 401 → `auth.loginRedirect()`, 403/422/5xx → `messageService.add({severity: 'error', ...})`
- [ ] `src/app/core/auth/auth.callback.component.ts` — query'den `code`, `state` al, `auth.handleCallback()` çağır
- [ ] `src/app/core/auth/permission.service.ts` — `hasRole(role)`, `anyRole(roles)` signal'lar
- [ ] `src/app/core/config/app-env.ts` — `window.__ENV__` reader (React `.reference-react/src/config/app.config.ts`'ten port)
- [ ] `src/app.config.ts`'e `authInterceptor` ve `errorInterceptor`'ı `withInterceptors([...])`'a ekle
- [ ] `src/app.routes.ts`'i güncelle:
  - `/auth/callback` rotası ekle → `AuthCallbackComponent`
  - Ana layout rotasına `canActivate: [authGuard]` ekle
- [ ] `src/app/pages/auth/login.ts`'i revize et — hardcoded `routerLink="/"` kaldır, "MFA SSO ile Giriş" butonu yap, `(onClick)="auth.loginRedirect()"` çağır
- [ ] `src/app/pages/auth/access.ts` — TR'ye çevir ("Yetkisiz Erişim")
- [ ] `src/app/pages/auth/error.ts` — TR'ye çevir ("Hata Oluştu")
- [ ] `src/app/layout/component/app.topbar.ts` — Kullanıcı menüsü ekle (user.fullName, logout)
- [ ] `npm run start` + staging SSO ile test
- [ ] **Referans:** `.reference-react/src/auth/AuthSync.tsx`, `auth.store.ts`, `config/auth.config.ts`, `lib/api-client.ts`
- [ ] **Doğrulama:** Korumalı URL'ye gidince SSO'ya redirect; SSO'dan dönünce callback handle ediyor; topbar'da user görünüyor
- [ ] Git: commit `feat(auth): manual OIDC with AuthService + guards + interceptors`

### Phase 4 — Sidebar Menü + Layout (Day 4-5, ~4-6 saat)

**Hedef:** Sakai'nin demo menüsü yerine MFA modül menüsü; rol-bazlı görünürlük.

- [ ] `src/app/core/config/navigation.config.ts` oluştur — MFA modülleri:
  ```ts
  export const MFA_NAVIGATION: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] },
    {
      label: 'Personel', icon: 'pi pi-users', routerLink: ['/personel'],
      visible: () => permission.hasRole('PERSONEL_OKUMA')
    },
    { label: 'Kütüphane', icon: 'pi pi-book', routerLink: ['/kutuphane'] },
    // ... vize, pasaport, konsolosluk vs.
  ];
  ```
- [ ] `src/app/layout/component/app.menu.ts`'i güncelle — `MFA_NAVIGATION`'dan oku, `inject(PermissionService)` ile filtrele
- [ ] **Doğrulama:** Sidebar'da MFA modülleri görünüyor; rol değişince menü değişiyor
- [ ] Git: commit `feat(layout): MFA navigation config + role-based menu`

### Phase 5 — Kütüphane Sayfası (Day 5-6, ~1-2 gün)

**Hedef:** Sakai'nin UIKit demolarını "Kütüphane" sayfasına dönüştür, TR çevir. **Rich text editör örneği ekle.**

- [ ] `src/app/pages/uikit/` → `src/app/features/kutuphane/` olarak yeniden adlandır
- [ ] Her demo sayfasını gez, İngilizce metinleri Türkçe yap
- [ ] **Yeni:** `editordemo.ts` — `<p-editor>` (Quill) rich text örneği. Toolbar config, model binding, max-length, preview gösterimi
- [ ] Bölümleri MFA'nın isteğine göre düzenle:
  - Renk Paleti (yeni — MFA paleti gösterimi)
  - Tipografi (Helvetica örnekleri)
  - Butonlar, Form Inputları, Tablolar, Grafikler, Mesajlar, Overlays, Paneller, Dosya, Medya, Menü
  - **Rich Text Editör** (yeni — `<p-editor>` örneği)
- [ ] Sidebar'da "Kütüphane" altında alt sekmeler
- [ ] Demo verileri statik tutabilir (sadece görsel preview)
- [ ] Git: commit `feat(kutuphane): port UIKit demos to MFA library page + editor demo`

### Phase 6 — Personel Modülü (Day 6-7, ~1 gün)

**Hedef:** Sakai'nin CRUD demosunu "personel" örnek modülüne dönüştür. Gerçek staging API.

- [ ] `src/app/pages/crud/` → `src/app/features/personel/`
- [ ] `personel.models.ts`:
  ```ts
  export interface Personel {
    id: string;
    ad: string;
    soyad: string;
    email: string;
    departman: string;
    rol: string[];
  }
  ```
- [ ] `personel.service.ts`:
  ```ts
  list(params) {
    return httpResource<PaginatedResponse<Personel>>(() => ({
      url: '/api/personel',
      params: { page: params.page, pageSize: params.pageSize },
    }));
  }
  create(dto) { return this.http.post(...) }
  update(id, dto) { return this.http.put(...) }
  delete(id) { return this.http.delete(...) }
  ```
- [ ] `personel-list.component.ts` — `<p-table>` + signal pagination + httpResource
- [ ] `personel-form.component.ts` — **Reactive Forms** + Angular Validators (Signal Forms v21'de yok)
- [ ] `proxy.conf.json` ekle (staging API CORS bypass):
  ```json
  { "/api": { "target": "https://staging-api.mfa.gov.tr", "secure": false, "changeOrigin": true } }
  ```
- [ ] `angular.json` `serve.options.proxyConfig: "proxy.conf.json"` ekle
- [ ] `personel.routes.ts` + `app.routes.ts`'e `/personel` lazy load ekle
- [ ] **Doğrulama:** Staging API'den personel listesi geliyor, ekleme/silme çalışıyor
- [ ] Git: commit `feat(personel): CRUD module with httpResource + reactive forms`

### Phase 7 — OpenShift / Docker (Day 7-8, ~4-6 saat)

**Hedef:** React template'in Docker setup'ını Angular'a port. nginx-unprivileged + ConfigMap → window.__ENV__.

- [ ] **`Dockerfile`** — `.reference-react/Dockerfile`'dan port:
  - Build stage: `node:24-alpine`, `npm ci`, `npm run build`
  - Runtime stage: `nginxinc/nginx-unprivileged:1.27-alpine`
  - Copy `dist/sakai-ng/browser/` → `/usr/share/nginx/html/`
  - Copy `nginx.conf` → `/etc/nginx/conf.d/default.conf`
  - Copy `docker-entrypoint.sh` + chmod
  - `EXPOSE 8080`
  - `ENTRYPOINT [docker-entrypoint.sh]`, `CMD [nginx, -g, daemon off;]`
- [ ] **`docker-entrypoint.sh`** — `.reference-react/docker-entrypoint.sh`'tan port (ConfigMap env → window.__ENV__ yazımı)
- [ ] **`nginx.conf`** — `.reference-react/nginx.conf`'tan port (port 8080, /health endpoint, SPA fallback)
- [ ] **`public/config.js`** — boş template:
  ```js
  window.__ENV__ = {
    SSO_URL: '',
    CLIENT_ID: '',
    API_URL: '',
    // ...
  };
  ```
- [ ] **`.dockerignore`** — `node_modules`, `.angular`, `dist`, `.reference-react`, `.git`
- [ ] Local test: `docker build -t mfa-frontend . && docker run -p 8080:8080 mfa-frontend`
- [ ] Git: commit `feat(docker): nginx-unprivileged + ConfigMap window.__ENV__ pattern`

### Phase 8 — CLAUDE.md + README + Doğrulama (Day 8)

- [ ] `CLAUDE.md` — React `.reference-react/CLAUDE.md`'nin 22 bölümünü Angular için yeniden yaz
- [ ] `README.md` — kurulum, geliştirme, build, deploy
- [ ] `.env.example` — runtime env değişkenleri
- [ ] `npm run build` → temiz mi
- [ ] (varsa) `npm run lint` → temiz mi
- [ ] (varsa) `npm test` → temiz mi
- [ ] Lighthouse a11y/perf
- [ ] Git: `v0.1.0-template` tag

---

## 5. Bilinen Riskler

| Risk | Etki | Azaltma |
|---|---|---|
| Sakai upstream patch'i geldiğinde merge çakışması | Sakai dosyalarına ne kadar müdahale ettiğimize bağlı | MFA kodu **yalnız** `core/`, `features/`, `assets/mfa-tokens.scss`'te. Sakai dosyalarına minimum dokun. |
| Angular 22 stable çıktığında upgrade | Signal Forms açılır, breaking change olabilir | Sakai upstream v22'ye geçince biz de geçeriz. O zaman Reactive Forms → Signal Forms migration. |
| `chart.js` direct silmek `<p-chart>`'ı kırabilir | Grafik sayfası çalışmaz | Sakai default'ta tutuyoruz. Şüpheyle yaklaş, silme. |
| Manuel OIDC: state/PKCE/refresh token bug'ları | Auth bozulur | MFA SSO ekibiyle koordineli; React `auth.config.ts` referans; ilk gün staging'de teste tabi tut. |
| `LayoutService.layoutConfig` runtime değişimi MFA brand kilidini bozar | Kullanıcı kırmızı'yı maviye çevirir | `AppConfigurator`'ı kaldır. layoutConfig'in `primary` field'ını signal init'inde MFA değerine sabitle. |
| Sakai SCSS yapısı vs Plan'ın CSS yaklaşımı | Stil çakışması | SCSS kalsın. Tailwind v4 + SCSS uyumlu. mfa-tokens.scss düz CSS değişkenleri içerir; her yerden okunur. |
| Quill bundle size (~150 KB gzip) | Production bundle şişer | Lazy load: `<p-editor>` sadece kullandığı sayfada import edilir (standalone component'lerle otomatik). Ana bundle'a girmez. |

---

## 6. Doğrulama Listesi

- [ ] `npm run start` → çalışıyor, default sayfa MFA kırmızısı ile açılıyor
- [ ] Sidebar: MFA modülleri görünüyor (Dashboard, Personel, Kütüphane, ...)
- [ ] 5 MFA renginin (kırmızı, gold, gri, lacivert, koyu lacivert) en az bir bileşende görünmesi
- [ ] Dark mode toggle çalışıyor
- [ ] Korumalı route → SSO redirect → callback → user signal dolu
- [ ] Logout → SSO logout URL + token sıfır
- [ ] 401 otomatik redirect, 403/422/5xx toast
- [ ] Kütüphane sayfası TR + MFA renkleri + `<p-editor>` örneği çalışıyor
- [ ] Personel modülü: CRUD çalışıyor, staging API'ye bağlanıyor
- [ ] Production build < 1.5 MB initial (Quill lazy-loaded, ana bundle dışı)
- [ ] Docker image < 200 MB
- [ ] nginx 8080'de, `/health` → 200
- [ ] OpenShift ConfigMap env runtime'da `window.__ENV__` üzerinden okunuyor
- [ ] `npm run build` temiz
- [ ] CLAUDE.md tüm 22 bölümün Angular karşılığı
- [ ] **Sakai default'a göre eklenmiş external paket sayısı: 0**

---

## 7. Sakai Upstream Sync Stratejisi

Bu template Sakai'nin fork'u olduğu için ileride upstream patch'leri çekmek isteyebiliriz:

```bash
git remote add upstream https://github.com/primefaces/sakai-ng.git
git fetch upstream
git merge upstream/master   # veya cherry-pick
```

**Çakışma riski olan dosyalar (Sakai dosyaları):**
- `src/app/layout/component/*` (özellikle `app.menu.ts`, `app.configurator.ts`, `app.topbar.ts`)
- `src/app/pages/auth/login.ts`
- `src/app/pages/dashboard/`
- `src/app/pages/uikit/` (eğer `features/kutuphane/`'ye taşımadıysak)
- `src/app.config.ts`
- `src/app.routes.ts`
- `src/assets/styles.scss`
- `package.json` (paket eklendi/kaldırıldı)

**Çakışma riski olmayan dosyalar (MFA'ya özgü):**
- Her şey `src/app/core/`, `src/app/features/`, `src/assets/mfa-tokens.scss` altında.

Strateji: MFA özelleştirmesini mümkün olduğunca kendi klasörlerimize yığ. Sakai'nin dosyalarına yapılan değişikliği minimal tut ve PR/commit mesajında "Sakai default'tan değişiklik: X" diye işaretle.

---

## 8. Sonraki Adım

Yeni Claude Code oturumunda **`docs/yeni-sakai-session-prompt.md`** dosyasını oku ve ilk mesaj olarak yapıştır. Yeni Claude:

1. Bu dokümanı okur
2. `npm install` ve `npm run start` ile Sakai baseline doğrular
3. Phase 0'dan başlar
