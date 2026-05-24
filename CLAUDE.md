# CLAUDE.md — MFA Frontend Template

> Bu dosya her Claude Code oturumunda otomatik yüklenir. Kritik kurallar burada — uzun oturumda unutma.
>
> Detaylı yol haritası: [`docs/sakai-mfa-uyarlama-plani.md`](docs/sakai-mfa-uyarlama-plani.md)
> Açılış prompt'u: [`docs/yeni-sakai-session-prompt.md`](docs/yeni-sakai-session-prompt.md)
> Aktif tasarım dokümanları: [`docs/superpowers/specs/`](docs/superpowers/specs/)

---

## 1. Proje

**Ne:** T.C. Dışişleri Bakanlığı kurumsal Angular frontend template'i.
**Kim:** MFA modül takımları (vize, pasaport, personel, konsolosluk) bu template'i fork'layıp kendi modüllerini geliştirecek.
**Başlangıç:** PrimeFaces sakai-ng (Angular 21 stable + PrimeNG 21 Aura + Tailwind v4) tek seferlik kod tabanı olarak çekildi. **Artık upstream sync yok — bu kod tamamen bizim, MFA template'i olarak ileri gidiyor.**
**Felsefe:** Minimum bağımlılık. PrimeNG + Angular built-in + Tailwind yeterli.

---

## 2. Stack — Tartışılmaz

| Katman | Versiyon | Not |
|---|---|---|
| Angular | `^21` stable | — |
| TypeScript | `~5.9.3` | — |
| PrimeNG | `^21.0.2` Aura | UI library |
| `@primeuix/themes` | `^2.0.0` | PrimeNG tema paketi |
| PrimeIcons | `^7.0.0` | İkon seti |
| Tailwind | `^4.1.11` (v4) + `@tailwindcss/postcss` | CSS-first |
| `tailwindcss-primeui` | `^0.6.1` | Tailwind ↔ PrimeNG köprüsü |
| Quill | `^2.0.3` | PrimeNG `<p-editor>` peer dep |
| Chart.js | `4.4.2` | PrimeNG `<p-chart>` peer dep |
| Node | `22 LTS` veya `24` | — |
| Change detection | `provideZonelessChangeDetection()` | Zone.js YOK |
| Components | Standalone only | Module YOK |
| Stiller | SCSS | — |

**Angular 22 stable** çıktığında planlı bir migration yapılır (Signal Forms o zaman açılır). Şimdi v21.

---

## 3. Bağımlılık Kuralı — KESİN

### Eklenebilir Paket — SIFIR
Hiçbir yeni external paket eklemiyoruz. Her ihtiyaç Angular + PrimeNG + Tailwind içinde karşılanır.

### Yasaklı Paketler (Asla Ekleme)

| Kategori | Yasaklı | Yerine |
|---|---|---|
| HTTP | `axios` | `HttpClient` (built-in) |
| Server state | `@tanstack/angular-query`, SWR | `httpResource()` / `resource()` (built-in v21) |
| Client state | `zustand`, `@ngrx/*`, `mobx` | `signal()` + `computed()` (built-in) |
| Form | `@ngx-formly/*`, RHF | **Reactive Forms** (`ReactiveFormsModule`, built-in) |
| Validasyon | `zod`, `yup`, `joi`, `class-validator` | Angular `Validators` (built-in) |
| Tablo | `@tanstack/angular-table` | `<p-table>` |
| Grafik | `ngx-echarts`, `recharts`, `chart.js` direct | `<p-chart>` (chart.js peer dep, dolaylı) |
| Rich Text | `tinymce`, `ckeditor`, `slate`, `lexical`, `tiptap` | `<p-editor>` (Quill peer dep, dolaylı) |
| Toast | `sonner`, `ngx-toastr` | `MessageService` + `<p-toast>` |
| İkon | `lucide-angular`, `font-awesome` | PrimeIcons |
| Auth | `keycloak-angular`, `angular-oauth2-oidc`, `@auth0/angular-jwt` | **Manuel OIDC** (HttpClient + Router + Signals) |
| Dialog/Drawer | (PrimeNG dışı) | `<p-dialog>`, `<p-drawer>` |
| Tarih | `moment`, `date-fns`, `luxon` | `<p-datepicker>` + `Intl.DateTimeFormat` |
| Test mock | `msw`, `json-server`, `nock` | Yok — staging API'ye proxy |
| Theme | `next-themes` benzeri | **MFA `SettingsService`** (signal + localStorage) |
| **i18n** | `@ngx-translate/core`, `@angular/localize` | **Custom mini `TranslateService`** + PrimeNG built-in `setTranslation()` |

**Karar kuralı:** "Şu paketi ekleyelim mi?" sorusunda **ÖNCE** sor: *"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?"* — evet ise paket EKLENMEZ.

### İzin Verilen Paketler

- `primeng`, `@primeuix/themes`, `primeicons`
- `tailwindcss`, `@tailwindcss/postcss`, `tailwindcss-primeui`
- `quill` (PrimeNG `<p-editor>` için)
- `chart.js` (PrimeNG `<p-chart>` için)
- `rxjs`, `tslib`, `@angular/*`

---

## 4. MFA Paleti — TEK KAYNAK

**Dosya:** `src/assets/mfa-tokens.scss`

| Renk | Hex | Kullanım |
|---|---|---|
| Kırmızı | `#DA291C` | Pantone 199 C — **Ana renk** |
| Altın Varak | `#D7AD4D` | Sadece tören/sertifika |
| Gri | `#53565A` | Nötr metin/border |
| Lacivert | `#003773` | Pantone 287 |
| Koyu Lacivert | `#00235A` | Pantone 288 |

CSS değişken token'ları: `--mfa-red`, `--mfa-gold`, `--mfa-gray`, `--mfa-navy`, `--mfa-navy-dark` + 11-step `--mfa-red-{50..950}` + `--mfa-surface-{0..950}`.

**Alias token'lar (Phase 7B+):** `--mfa-bg`, `--mfa-bg-elevated`, `--mfa-bg-muted`, `--mfa-text`, `--mfa-text-muted`, `--mfa-border`, `--mfa-brand`, `--mfa-brand-fg`. Bunlar `.app-dark` altında otomatik dark eşleniğe kayar. **Yeni component'lerde alias token'lar tercih edilir.**

PrimeNG'ye bağlama: `src/app/core/config/theme.config.ts` → `MfaPreset = definePreset(Aura, {...})` — `primary` slot CSS değişkenleri okur; `semantic.colorScheme.dark` bloğu dark mode token'larını verir.

**KURAL:** Renk değişikliği **sadece** `mfa-tokens.scss`'te yapılır. Component'lerde hardcoded hex YAZMA. `<p-button severity="primary">`, `class="bg-primary"`, `style="background:var(--mfa-red)"` üçü de aynı CSS değişkenini okumalı.

---

## 5. Font — Helvetica System Stack

```scss
body { font-family: Helvetica, Arial, sans-serif; }
```

**YASAK:** Inter, Roboto, Google Fonts, herhangi bir CDN font. Sebep: Kurumsal güvenlik + offline kullanım.

**Font boyutu (Phase 7B+):** `<html>` kök `font-size` `data-font-scale` özniteliğine bağlı (`xs=13/sm=14/md=15/lg=17/xl=19 px`). Component-level SCSS'lerde `rem` kullan, hardcoded `px` yazma — yoksa font scale bypass edilir.

---

## 6. Auth — Manuel OIDC

MFA SSO ile bağlanılır. Implementasyon `src/app/core/auth/`:

- `auth.service.ts` — `signal<AuthUser | null>` + `loginRedirect()` + `handleCallback()` + `logout()`
- `auth.guard.ts` — Functional `CanActivateFn`
- `auth.interceptor.ts` — `HttpInterceptorFn`, Bearer token enjekte
- `auth.callback.component.ts` — SSO dönüş handler
- `permission.service.ts` — `hasRole(role)`, `anyRole(roles)` signals

**SSO config kaynağı:** `window.__ENV__` (runtime, OpenShift ConfigMap'ten — `public/config.js` şablon).

**Geliştirici modu:** `SSO_URL` boşken `auth/login` sayfasında "Geliştirici Modu" bypass aktif olur.

**KURAL:** `keycloak-angular`, `angular-oauth2-oidc`, `@auth0/*` paketlerine **dokunma**.

---

## 7. Form — Reactive Forms

```ts
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
```

**Sebep:** Angular 21. Signal Forms v22'de stable, biz v21'deyiz; v22 migration sırasında Signal Forms'a geçeriz.

**Yapma:** Template-driven (`FormsModule` `[(ngModel)]` zincirleri) — sadece basit non-validated input için kabul (örn. ayarlar paneli enum seçimi). Validated form = Reactive.

---

## 8. Data Fetching — `httpResource()` / `HttpClient`

```ts
// GET (otomatik loading/error/cache, signal-friendly)
list = httpResource<Personel[]>(() => ({ url: '/api/personel', params: { ... } }));

// Template'te:
@if (list.isLoading()) { <p-progressspinner /> }
@else if (list.error()) { <p-message severity="error" /> }
@else if (list.hasValue()) { <p-table [value]="list.value()" /> }

// Mutation (POST/PUT/DELETE)
this.http.post<ApiResponse>('/api/personel', dto).subscribe(...);
```

**Mock backend YOK.** Geliştirme staging API'ye `proxy.conf.js` ile bağlanır (`/api/**` → `window.__ENV__.API_URL`).

---

## 9. Klasör Sorumluluğu

MFA-spesifik kodu kendi klasörlerimize topla; render/layout dosyaları temiz kalsın.

**MFA-spesifik (özgürce yaz):**
- `src/app/core/` — auth, settings, i18n, http, config
- `src/app/features/` — modül kodu (vize, pasaport, personel, konsolosluk)
- `src/assets/mfa-tokens.scss` — TEK PALET KAYNAĞI
- `src/assets/i18n/` — TR/EN sözlükleri

**Genel template (değiştir ama düşün):**
- `src/app/layout/component/*` — topbar, sidebar, menü, drawer
- `src/app/pages/*` — uikit, dashboard, kurumsal-kimlik, ayarlar, auth, vb.
- `src/app.config.ts`, `src/app.routes.ts`
- `src/assets/styles.scss`, `src/assets/tailwind.css`
- `package.json`

**Kural:** Bir dosyaya dokunacağın zaman önce `Read` ile aç, sonra `Edit` ile **minimum diff** yaz. Layout/menü gibi yatay etkili dosyaları büyük diff'lerle değiştirmeden önce kullanıcıya plan göster.

---

## 10. Klasör Yapısı

```
src/
├── app/
│   ├── layout/                    # Topbar, sidebar, menü, drawer
│   │   ├── component/
│   │   └── service/               # LayoutService (sadece menu/sidebar state)
│   ├── core/                      # MFA-spesifik runtime
│   │   ├── auth/                  # auth.service, guard, interceptor, callback, permission
│   │   ├── settings/              # settings.service, settings.types  (Phase 7B+)
│   │   ├── i18n/                  # translate.service, translate.pipe (Phase 7B+)
│   │   ├── http/                  # error.interceptor
│   │   └── config/                # app-env, theme.config, navigation.config
│   ├── pages/                     # Tüm sayfalar (uikit/, dashboard, ayarlar, kurumsal-kimlik, auth, vs.)
│   └── features/                  # Modül kodu (vize, pasaport, ...)
└── assets/
    ├── styles.scss                # Tailwind import + mfa-tokens import
    ├── tailwind.css               # @theme inline
    ├── mfa-tokens.scss            # TEK PALET KAYNAĞI
    └── i18n/                      # tr.json, en.json  (Phase 7B+)

public/
└── config.js                      # window.__ENV__ runtime config
```

---

## 11. Çalışma Tarzı

- **Türkçe konuş** (UI Türkçe; kod TR/EN serbest).
- **Yeni terim** (signal, inject, FormBuilder, httpResource, computed, definePreset, providePrimeNG, vs.) ilk kullanımda **1 cümlelik Türkçe açıklama** ver.
- **Kod yazmadan önce** ne yapacağını kısa cümleyle söyle.
- **Büyük komutlardan önce onay al:** `npm install`, `npm run build`, `npm run start`, `ng generate`, paket ekleme/silme, dosya silme.
- **Paket ekleme dürtüsü gelirse**, ÖNCE şunu sor: *"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?"*
- **Hata aldığında** çözmeden önce hatayı kullanıcıya göster.
- **Layout/menü gibi yatay dosyalarda** önce `Read`, sonra **minimum diff**.
- **Her phase sonunda** commit at: `git commit -m "phase X: ..."`. **PUSH ETME** — kullanıcı söyleyince push.

---

## 12. Komut Hatırlatıcı

```bash
npm install                    # bağımlılıkları yükle
npm run start                  # ng serve, http://localhost:4200
npm run build                  # production build
npm run watch                  # dev build watch mode
npm run format                 # prettier
npm run lint:palette           # governance tarayıcı (hex/tailwind/cdn/import) — ihlalde exit 1
npm test                       # karma + jasmine — kullanılmıyor (test stratejisi Phase 8+)
```

---

## 13. Bilinmesi Gereken Yasaklar — Özet Liste

- ❌ Yeni external paket ekleme (mevcut listenin dışında)
- ❌ Hardcoded renk (her şey `mfa-tokens.scss` üzerinden)
- ❌ Google Fonts / CDN font / Inter / Roboto
- ❌ Keycloak/OIDC lib
- ❌ Zod / Axios / TanStack / Zustand / NgRx
- ❌ Lucide / Font Awesome
- ❌ Sonner / ngx-toastr
- ❌ Mock backend / json-server / MSW
- ❌ Template-driven validated form
- ❌ Module syntax (`@NgModule`) — standalone only
- ❌ Zone.js (`provideZoneChangeDetection`) — zoneless only
- ❌ `ngx-translate` / `@angular/localize` — custom `TranslateService` + PrimeNG built-in
- ❌ Doğrudan `document.documentElement.classList.add('app-dark')` — `SettingsService` tek yetkili
- ❌ Hardcoded `px` font-size (font scale bypass eder) — `rem` kullan
- ❌ `git push` (kullanıcı söylemeden)

---

## 14. Bileşen Kütüphanesi Governance — KESİN KURAL

**Kaynak:** `/uikit/*` sayfaları → `src/app/pages/uikit/`

Sayfalar: Butonlar · Giriş Alanları · Form Düzeni · **Zengin Metin** · Tablo · Liste · Ağaç · Panel · Overlay · Medya · Menü · Mesajlar · Dosya Yükleme · Grafikler · Zaman Çizelgesi · Hiyerarşi · Diğer

Tüm PrimeNG bileşenleri `MfaPreset` üzerinden **otomatik olarak MFA kurumsal paletini** kullanır. Renk, border, shadow — hiçbiri hardcoded değil.

### Modül takımları için kural
Modül takımları `/uikit/*` sayfalarında **gösterilen bileşenleri** kullanabilir.

**Yeni bileşen ihtiyacı varsa sıra:**
1. İlgili `src/app/pages/uikit/*demo.ts` dosyasına canlı örnek ekle
2. Ardından modül kodunda kullan

**Kesinlikle yasak:**
- ❌ `/uikit/*` sayfalarında gösterilmemiş bileşen kullanmak
- ❌ Hardcoded hex, `style="color:#xxx"`, Tailwind arbitrary renk (`text-[#DA291C]`)
- ❌ `bg-red-500`, `text-blue-700` gibi sabit Tailwind renkleri — `var(--mfa-*)` veya PrimeNG severity kullan
- ❌ Harici CDN görseli/URL'si — tüm assets yerel veya `data:` URI olmalı
- ❌ Component template/SCSS'inde sabit Türkçe metin — yeni metin için `tr.json`/`en.json`'a key ekle, `| t` pipe kullan

**Alias token tercih kuralı:** Yeni component yazılırken `var(--mfa-bg)`, `var(--mfa-text)`, `var(--mfa-border)`, `var(--mfa-brand)` kullan. Ham `--mfa-surface-0` / `--mfa-surface-900` yazmak hâlâ kabul ama dark mode'da statik kalır. PrimeNG `severity="primary"` en üst tercih — semantic preset'i okur.

### Governance Otomasyonu (Phase 8+)

Yukarıdaki kuralları **otomatik denetleyen** bir tarayıcı var: `scripts/check-palette.mjs` (sıfır bağımlılık, saf Node). `npm run lint:palette` ile çalışır; `src/app/**/*.ts` dosyalarını tarar. İhlal varsa `exit 1` döner (CI / pre-commit durur), temizse `exit 0`.

4 kural:
- **HEX** — hardcoded hex renk. İstisna (whitelist): `theme.config.ts`, `design-tokens.ts` (tek yetkili palet kaynakları).
- **TAILWIND** — sabit Tailwind renk sınıfı (`bg-red-500`, `text-blue-700`) + arbitrary renk (`text-[#...]`). `surface-*` / `primary` semantic sınıfları serbest.
- **CDN** — harici `http(s)` asset URL'i. İstisna: `w3.org` (SVG namespace), `mfa.gov.tr` (kurumun kendi domaini).
- **IMPORT** — `features/**` içinde `/uikit/*`'te gösterilmemiş PrimeNG modülü import'u (§14 enforcement).

**Kaçış:** Bir satırda kasıtlı, meşru istisna varsa satır sonuna `// mfa-ignore` ekle (ör. colorpicker default'u gibi literal-zorunlu durumlar; ama önce `design-tokens.ts`'ten import etmeyi dene).

**svgPlaceholder kuralı:** Demo/örnek görseller için CDN yerine `src/app/core/util/svg-placeholder.ts` → `svgPlaceholder(w, h, bg?, label?)` kullan — MFA paletinden beslenen `data:` URI üretir. `data:` SVG içinde `var()` çözülmediği için hex değerleri `design-tokens.ts`'ten okunur.

**Runtime denetim sayfası:** `/pages/kurumsal-kimlik/denetim` — açık ekranı canlı denetler (satır-içi hex, canlı token değerleri, gövde fontu) + statik tarayıcı bilgisi. Yetkili karar build-zamanı tarayıcısındadır; bu sayfa görsel/bilgilendirici yardımcıdır.

---

## 15. Runtime Ayar Sistemi (Phase 7B+)

Kullanıcının canlı kontrol edebildiği üç boyut: **tema** (light/dark/system), **font scale** (xs/sm/md/lg/xl), **dil** (tr/en).

**Tek kaynak:** `src/app/core/settings/settings.service.ts` — signal-based, localStorage persistence, View Transition'lı dark geçiş.

**Erişim noktaları:**
- Topbar `pi-cog` butonu → sağ `<p-drawer>` (hızlı erişim, mobile full-width)
- `/pages/ayarlar` → tam sayfa (drawer ile aynı `<app-settings-form>` paylaşır)

**Sorumluluk ayrımı:**
- `SettingsService` (core/settings) → tema, font, dil, persistence
- `LayoutService` (layout/service) → SADECE sidebar/menu state
- `TranslateService` (core/i18n) → sözlük + `| t` pipe + PrimeNG `setTranslation()` sync

**Renk paleti runtime'da değiştirilemez.** Kurumsal kimlik son kullanıcı tarafından kilitli; sadece dark mode tonal kayması var (palet İÇİNDEN: `--mfa-red-600` → `--mfa-red-500` gibi).

**i18n kuralları:**
- Yeni UI metni eklerken `tr.json`/`en.json`'a key ekle, template'te `{{ 'menu.x' | t }}`
- Menü etiketleri `navigation.config.ts` → `labelKey` field'ında
- `LOCALE_ID` runtime provider — `date`/`currency`/`number` pipe'ları dil'e uyar (sınırlama: runtime değişmez, sayfa reload ister)

**Bilgi:** Tam tasarım dokümanı [`docs/superpowers/specs/2026-05-20-phase-7b-runtime-settings-design.md`](docs/superpowers/specs/2026-05-20-phase-7b-runtime-settings-design.md).

---

## 16. Bir Şeyden Emin Değilsen

1. **`docs/sakai-mfa-uyarlama-plani.md`'ye bak** — yol haritası, faz durumları.
2. **`docs/ilerleme-ve-kararlar.md`'ye bak** — tamamlanan adımlar, alınan kararlar (K-001...K-NNN).
3. **`docs/superpowers/specs/`'e bak** — aktif faz için detaylı tasarım dokümanı.
4. **`docs/i18n-rehber.md`'ye bak** — modüller için i18n stratejisi (namespace, pipe'lar, yasaklar).
5. **Kullanıcıya sor** — Türkçe, kısa cümlelerle.
