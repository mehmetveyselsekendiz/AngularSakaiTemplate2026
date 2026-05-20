# CLAUDE.md — MFA Frontend Template (Sakai-ng Fork)

> Bu dosya her Claude Code oturumunda otomatik yüklenir. Kritik kurallar burada — uzun oturumda unutma.
>
> Detaylı yol haritası: [`docs/sakai-mfa-uyarlama-plani.md`](docs/sakai-mfa-uyarlama-plani.md)
> Açılış prompt'u: [`docs/yeni-sakai-session-prompt.md`](docs/yeni-sakai-session-prompt.md)
> Eski plan (geçersiz, tarihsel): [`docs/angular-migration-plan.md`](docs/angular-migration-plan.md)

---

## 1. Proje

**Ne:** T.C. Dışişleri Bakanlığı kurumsal Angular frontend template'i.
**Kim:** MFA modül takımları (vize, pasaport, personel, konsolosluk) bu template'i fork'layıp kendi modüllerini geliştirecek.
**Başlangıç:** PrimeFaces sakai-ng (Angular 21 stable + PrimeNG 21 Aura + Tailwind v4). Bu repo onun fork'u.
**Felsefe:** Minimum bağımlılık. Sakai bize iskelet veriyor; MFA özelleştirmesi `src/app/core/`, `src/app/features/`, `src/assets/mfa-tokens.scss` altında.

**React referansı:** [`.reference-react/`](.reference-react/) — eski React template. Bir özelliği port ederken önce React karşılığını oradan oku.

---

## 2. Stack — Tartışılmaz

| Katman | Versiyon | Not |
|---|---|---|
| Angular | `^21` stable | Sakai upstream'iyle aynı |
| TypeScript | `~5.9.3` | Sakai default |
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
| Stiller | SCSS | Sakai default |

**Angular 22 stable çıkıp Sakai geçince biz de geçeriz** (o zaman Signal Forms açılır).

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
| Theme | `next-themes` benzeri | Sakai `LayoutService` (signal) |

**Karar kuralı:** "Şu paketi ekleyelim mi?" sorusunda **ÖNCE** sor: *"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?"* — evet ise paket EKLENMEZ.

### İzin Verilen Paketler (Sakai'de var, KORUNUR)

- `primeng`, `@primeuix/themes`, `primeicons`
- `tailwindcss`, `@tailwindcss/postcss`, `tailwindcss-primeui`
- `quill` (PrimeNG `<p-editor>` için)
- `chart.js` (PrimeNG `<p-chart>` için)
- `rxjs`, `tslib`, `@angular/*`

### Silinecek Paketler (Sakai default'unda var ama bize gereksiz)

- `primeclt` — Sakai-spesifik CLI tool

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

PrimeNG'ye bağlama: `src/app/core/config/theme.config.ts` → `MfaPreset = definePreset(Aura, {...})` — `primary` slot CSS değişkenleri okur.

**KURAL:** Renk değişikliği **sadece** `mfa-tokens.scss`'te yapılır. Component'lerde hardcoded hex YAZMA. `<p-button severity="primary">`, `class="bg-primary"`, `style="background:var(--mfa-red)"` üçü de aynı CSS değişkenini okumalı.

---

## 5. Font — Helvetica System Stack

```scss
body { font-family: Helvetica, Arial, sans-serif; }
```

**YASAK:** Inter, Roboto, Google Fonts, herhangi bir CDN font. Sebep: Kurumsal güvenlik + offline kullanım.

---

## 6. Auth — Manuel OIDC

MFA SSO ile bağlanılır. Implementasyon `src/app/core/auth/`:

- `auth.service.ts` — `signal<AuthUser | null>` + `loginRedirect()` + `handleCallback()` + `logout()`
- `auth.guard.ts` — Functional `CanActivateFn`
- `auth.interceptor.ts` — `HttpInterceptorFn`, Bearer token enjekte
- `auth.callback.component.ts` — SSO dönüş handler
- `permission.service.ts` — `hasRole(role)`, `anyRole(roles)` signals

**Referans:** `.reference-react/src/auth/` (AuthSync.tsx, auth.store.ts, config/auth.config.ts, lib/api-client.ts).

**SSO config kaynağı:** `window.__ENV__` (runtime, OpenShift ConfigMap'ten — React'ten port).

**KURAL:** `keycloak-angular`, `angular-oauth2-oidc`, `@auth0/*` paketlerine **dokunma**.

---

## 7. Form — Reactive Forms

```ts
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
```

**Sebep:** Sakai Angular 21'de. Signal Forms v22'de stable, biz v21'deyiz. Sakai upstream v22'ye geçince Signal Forms migration yaparız.

**Yapma:** Template-driven (`FormsModule` `[(ngModel)]` zincirleri) — sadece basit non-validated input için kabul. Validated form = Reactive.

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

**Mock backend YOK.** Geliştirme staging API'ye `proxy.conf.json` ile bağlanır.

---

## 9. Sakai'ye Müdahale Kuralı

MFA kodu **kendi klasörlerimize** yığ → Sakai upstream merge çakışmasını minimize et.

**Bizim klasörler (özgürce yaz):**
- `src/app/core/`
- `src/app/features/`
- `src/assets/mfa-tokens.scss`

**Sakai dosyaları (minimum dokun, commit mesajına "Sakai default'tan farklılık: X" not düş):**
- `src/app/layout/component/*`
- `src/app/pages/auth/login.ts`
- `src/app/pages/dashboard/`
- `src/app.config.ts`, `src/app.routes.ts`
- `src/assets/styles.scss`
- `package.json`

**Sakai upstream sync:**
```bash
git remote add upstream https://github.com/primefaces/sakai-ng.git
git fetch upstream
git merge upstream/master
```

---

## 10. Klasör Yapısı

```
src/
├── app/
│   ├── layout/                    # [SAKAİ — minimum dokun]
│   ├── core/                      # [MFA — özgürce yaz]
│   │   ├── auth/                  # auth.service, guard, interceptor, callback, permission
│   │   ├── http/                  # error.interceptor
│   │   └── config/                # app-env, theme.config, navigation.config
│   ├── pages/                     # [SAKAİ — temizle, TR çevir]
│   └── features/                  # [MFA — modül kodu buraya]
│       └── personel/
└── assets/
    ├── styles.scss                # [SAKAİ — başına mfa-tokens import ekle]
    ├── tailwind.css               # [SAKAİ — @theme inline ekle]
    └── mfa-tokens.scss            # [MFA — TEK PALET KAYNAĞI]

public/
└── config.js                      # window.__ENV__ runtime config (yeni)
```

---

## 11. Çalışma Tarzı

- **Türkçe konuş** (UI Türkçe; kod TR/EN serbest).
- **Yeni terim** (signal, inject, FormBuilder, httpResource, computed, definePreset, providePrimeNG, vs.) ilk kullanımda **1 cümlelik Türkçe açıklama** ver.
- **Kod yazmadan önce** ne yapacağını kısa cümleyle söyle.
- **Büyük komutlardan önce onay al:** `npm install`, `npm run build`, `npm run start`, `ng generate`, paket ekleme/silme, dosya silme.
- **Paket ekleme dürtüsü gelirse**, ÖNCE şunu sor: *"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?"*
- **Hata aldığında** çözmeden önce hatayı kullanıcıya göster.
- **Sakai dosyasını değiştireceksen** önce `Read` ile aç, sonra `Edit` ile **minimum diff** yaz.
- **Her phase sonunda** commit at: `git commit -m "phase X: ..."`. **PUSH ETME** — kullanıcı söyleyince push.

---

## 12. Komut Hatırlatıcı

```bash
npm install                    # bağımlılıkları yükle
npm run start                  # ng serve, http://localhost:4200
npm run build                  # production build
npm run watch                  # dev build watch mode
npm run format                 # prettier
npm test                       # karma + jasmine (Sakai default — kullanılıyor mu sor)
```

---

## 13. Bilinmesi Gereken Yasaklar — Özet Liste

- ❌ Yeni external paket ekleme (zaten Sakai'de olanlar dışında)
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
- ❌ `git push` (kullanıcı söylemeden)
- ❌ Sakai dosyalarına büyük değişiklik (minimum diff)

---

## 14. Bileşen Kütüphanesi Governance — KESİN KURAL

**Kaynak:** `/uikit/*` sayfaları → `src/app/pages/uikit/`

Sayfalar: Butonlar · Giriş Alanları · Form Düzeni · **Zengin Metin** · Tablo · Liste · Ağaç · Panel · Overlay · Medya · Menü · Mesajlar · Dosya Yükleme · Grafikler · Zaman Çizelgesi · Diğer

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

---

## 15. Bir Şeyden Emin Değilsen

1. **`docs/sakai-mfa-uyarlama-plani.md`'ye bak** — detaylı yol haritası, kararların gerekçesi.
2. **`.reference-react/CLAUDE.md`'ye bak** — React versiyonunun 22 bölümlük kuralları (Angular'a uyarlanacak Phase 8'de).
3. **`.reference-react/src/`'i incele** — React karşılığını gör, Angular'a port et.
4. **Kullanıcıya sor** — Türkçe, kısa cümlelerle.
