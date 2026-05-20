# Angular Migration Plan — Mayıs 2026

T.C. Dışişleri Bakanlığı kurumsal frontend template'inin React'ten Angular'a taşınması için
tam yol haritası. Bu doküman **yeni Angular reposunda** ve **yeni Claude Code oturumunda**
referans olarak kullanılmak üzere hazırlanmıştır.

**Hedef tarih:** Mayıs 2026
**Kaynak repo:** `ReactTemplate2026` (mevcut)
**Hedef repo:** `frontend-starter-angular` (yeni)

---

## 0. Yönetici Özeti

- **Sebep:** MFA kurum kararı — Angular standardına geçiş.
- **Yaklaşım:** Sıfırdan yeni Angular reposu.
- **Stack felsefesi:** **Minimum bağımlılık.** Angular + PrimeNG built-in'leri her zaman önce.
- **Hedef versiyonlar:** Angular 22 (16 Mayıs 2026 release), PrimeNG 21.x (Aura), Tailwind v4.
- **Süre tahmini:** ~14 iş günü.

### Mayıs 2026 İtibarıyla Stable Olan Kritik Özellikler

- **Zoneless change detection** (v20.2'den itibaren stable, v22'de default)
- **Signal Forms** (v22'de stable — modern form API)
- **httpResource() / resource()** (v22'de stable — server state + cache)
- **Signals** (v20'de stable — reaktivite primitifi)
- **OnPush** v22'de default change detection
- **PrimeNG 21.x** — Aura design system tam destek

---

## 1. Stack Eşleştirme — React (Mevcut) → Angular (Mayıs 2026)

| Katman | React (Mevcut) | Angular Karşılığı (Mayıs 2026) | Versiyon | Neden Bu? |
|---|---|---|---|---|
| **UI Framework** | React 19.x | **Angular** | **22.x** (16 Mayıs 2026 release) | Signals stable, zoneless default, Signal Forms stable, httpResource stable, OnPush default. |
| **Dil** | TypeScript 6.x strict | **TypeScript** (Angular 22 ile uyumlu latest) | latest | Angular CLI seçer; strict, noUnusedLocals, verbatimModuleSyntax, erasableSyntaxOnly aynen. |
| **Build** | Vite 8 + Rolldown/Oxc | **Angular CLI (esbuild backend)** | latest | Native, ek konfig gerekmez. |
| **Router** | TanStack Router 1.x | **Angular Router** | built-in | Functional guards, `loadComponent` lazy load. |
| **Server State + Cache** | TanStack Query 5.x | **`httpResource()` / `resource()`** | built-in v22 stable | Signal-native data fetching. Loading/error/success otomatik. Cache built-in. **TanStack Query EKLEME**. |
| **Client State** | Zustand 5.x | **Angular Signals** | built-in | `signal()` + `computed()` yeterli. NgRx/Zustand EKLEME. |
| **Auth (OIDC/SSO)** | `react-oidc-context` 3.x | **Manuel OIDC: HttpClient + Router + Signals** | built-in | MFA SSO'ya direkt bağlan. `keycloak-angular` EKLEME, `angular-oauth2-oidc` EKLEME. |
| **HTTP** | Axios 1.x | **`HttpClient`** (built-in) | built-in | `provideHttpClient(withFetch(), withInterceptors([...]))`. Axios EKLEME. |
| **UI Bileşenler** | shadcn (Radix Nova) | **PrimeNG 21.x (Aura)** | **21.x** (latest) | CSS değişken tabanlı tema. |
| **Stil** | Tailwind 4.x CSS-first | **Tailwind 4.x** + `tailwindcss-primeui` | latest v4 | `@theme inline` MFA token'larını PrimeNG `--p-*` ile paylaşır. |
| **Form** | RHF + Zod 4.x | **Angular Signal Forms** (v22 stable) | built-in | Signal-native. Karmaşıklaşırsa Reactive Forms yedek (yine built-in). |
| **Validasyon** | Zod 4.x | **Angular Validators** | built-in | Validators.required, Validators.email vs. **Zod EKLEME**. |
| **Tablo** | TanStack Table 8.x | **PrimeNG `<p-table>`** | built-in (PrimeNG) | Virtual scroll, lazy, filter, sort. TanStack Table EKLEME. |
| **Toast** | Sonner 2.x | **PrimeNG `MessageService` + `<p-toast>`** | built-in (PrimeNG) | Sonner EKLEME. |
| **Dark Mode** | next-themes 0.4.x | **Custom `ThemeService`** (signal) + `.p-dark` class | custom | PrimeNG Aura `darkModeSelector: '.p-dark'` kullanır. |
| **Grafik** | Recharts 3.x | **PrimeNG `<p-chart>`** (Chart.js wrapper) | built-in (PrimeNG) | ngx-echarts EKLEME. |
| **SVG** | `vite-plugin-svgr` | **Inline SVG / Angular CLI asset** | built-in | Logo/asset için yeterli. |
| **Icon** | lucide-react 1.x | **PrimeIcons** (PrimeNG ile gelir) | built-in (PrimeNG) | `<i class="pi pi-user">` syntax. Lucide EKLEME — sadece eksik ikon çıkarsa yeniden değerlendir. |
| **Change Detection** | (React fiber) | **Zoneless** (`provideZonelessChangeDetection()`) | built-in v22 default | Zone.js YOK. |

### Versiyon Kilidi — Doğrulama Komutları

Scaffold yapmadan önce mutlaka çalıştır:

```bash
npm view @angular/cli version
npm view @angular/core version
npm view primeng version
npm view @primeng/themes version
npm view primeicons version
npm view tailwindcss version
npm view tailwindcss-primeui version
npm view typescript version
node --version
```

Çıktıları `package.json`'a **sabit** (`^` veya `~` yok) yaz.

---

## 2. Klasör Yapısı — Angular Versiyonu

```
src/
├── app/
│   ├── core/                              # [TEMEL — dikkatli düzenle]
│   │   ├── auth/
│   │   │   ├── auth.service.ts            # Signal-based user/roller/token
│   │   │   ├── auth.guard.ts              # Functional CanActivateFn
│   │   │   ├── auth.interceptor.ts        # Bearer token + 401 redirect
│   │   │   ├── auth.callback.component.ts # SSO dönüş handler
│   │   │   └── permission.service.ts      # hasRole / anyRole
│   │   ├── http/
│   │   │   └── error.interceptor.ts       # 403/422/5xx → MessageService toast
│   │   └── config/
│   │       ├── app.config.ts              # window.__ENV__ okuyucu
│   │       ├── theme.config.ts            # MfaPreset definePreset()
│   │       └── navigation.config.ts       # Sidebar menüsü (rol-bazlı)
│   ├── components/
│   │   ├── layout/                        # AppShellComponent, SidebarComponent, TopBarComponent, FooterComponent
│   │   └── ui/                            # MFA özel kompozisyonlar (MfaPreviewCard, MfaEmptyState)
│   ├── features/                          # *** TÜM İŞ MANTIĞI ***
│   │   └── personel/                      # Örnek modül
│   │       ├── personel.routes.ts
│   │       ├── personel.service.ts        # HttpClient + httpResource
│   │       ├── personel.models.ts         # interface Personel { ... }
│   │       ├── list/
│   │       │   ├── personel-list.component.ts
│   │       │   └── personel-list.component.html
│   │       ├── form/
│   │       │   ├── personel-form.component.ts
│   │       │   └── personel-form.component.html
│   │       └── components/
│   ├── shared/
│   │   ├── lib/cn.ts                      # clsx + tailwind-merge wrapper (opsiyonel)
│   │   ├── pipes/
│   │   └── tokens/
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── app.config.ts                      # provideZonelessChangeDetection + Router + HttpClient + PrimeNG
├── styles/
│   ├── mfa-tokens.css                     # *** PALET — TEK KAYNAK ***
│   └── global.css                         # Tailwind + global rules
├── assets/
├── environments/
└── main.ts
```

### Klasör Anahtar Kelimeleri

- **[TEMEL]** = Tüm template'in dayanağı.
- **PrimeNG bileşenleri** = `node_modules`'ten gelir. MFA paleti `mfa-tokens.css` üzerinden otomatik.
- **`src/app/components/ui/`** = Sadece **kompozisyonlar** için. Tek tek button/input wrap'lemiyoruz.

---

## 3. Kavram Eşleştirme — React → Angular

| React Kavramı | Angular Karşılığı |
|---|---|
| `useState(0)` | `signal(0)` |
| `useEffect(() => {...}, [dep])` | `effect(() => {... dep();})` |
| `useMemo(() => x*2, [x])` | `computed(() => x()*2)` |
| `useRef<HTMLInputElement>()` | `viewChild<ElementRef<HTMLInputElement>>('input')` |
| `useContext(Ctx)` | `inject(MY_TOKEN)` |
| `props.title` | `title = input<string>()` ya da `input.required<string>()` |
| `onSave(data)` callback prop | `save = output<Data>()` + `this.save.emit(data)` |
| `<>{cond && <X />}</>` | `@if (cond) { <x-comp /> }` |
| `items.map(i => <Row {...i}/>)` | `@for (i of items(); track i.id) { <row [data]="i" /> }` |
| `useForm` + Zod | **Signal Forms** (v22 stable) |
| `useQuery({queryKey, queryFn})` | **`httpResource(() => ({url, params}))`** |
| `useMutation({mutationFn})` | HttpClient + manuel signal update |
| Zustand `create(set => ({...}))` | `@Injectable({providedIn:'root'}) class Store { state = signal(...) }` |
| File-based route `_auth.personel.tsx` | `app.routes.ts` → `{ path: 'personel', canActivate: [authGuard], loadComponent: ... }` |
| `<Outlet />` (TanStack) | `<router-outlet />` |
| Axios interceptor | `HttpInterceptorFn` (functional) |
| `toast.success('...')` (Sonner) | `messageService.add({severity:'success', summary:'...'})` |
| `next-themes` toggle | `ThemeService.toggle()` → `<html class="p-dark">` |
| shadcn `<Button variant="success">` | `<p-button severity="success">` |
| shadcn `<Dialog>` | `<p-dialog [(visible)]="acik">` |
| TanStack `<DataTable>` | `<p-table [value]="data">` |

### Signal Forms Örneği (v22 stable)

```ts
// personel-form.component.ts
import { Component, signal } from '@angular/core';
import { form, schema, required, email } from '@angular/forms/signals';

@Component({...})
export class PersonelFormComponent {
  personel = signal({ ad: '', soyad: '', email: '', departman: '' });

  personelForm = form(this.personel, schema(p => {
    required(p.ad, { message: 'Ad zorunlu' });
    required(p.soyad, { message: 'Soyad zorunlu' });
    required(p.email, { message: 'E-posta zorunlu' });
    email(p.email, { message: 'Geçerli e-posta giriniz' });
    required(p.departman, { message: 'Departman seçiniz' });
  }));

  submit() {
    if (this.personelForm().valid()) {
      this.svc.create(this.personel()).subscribe();
    }
  }
}
```

**Not:** Signal Forms API'sinin tam syntax'ı v22 release notes'unda netleşir. Üstteki örnek yaklaşımsal — gerçek kullanımı resmi dokümantasyondan al.

### httpResource Örneği

```ts
// personel.service.ts
@Injectable({ providedIn: 'root' })
export class PersonelService {
  private http = inject(HttpClient);

  list(params: PaginationParams) {
    return httpResource<PaginatedResponse<Personel>>(() => ({
      url: '/api/personel',
      params: { page: params.page, pageSize: params.pageSize },
    }));
  }

  create(dto: PersonelDto) {
    return this.http.post<ApiResponse<Personel>>('/api/personel', dto);
  }
}
```

```ts
// personel-list.component.ts
export class PersonelListComponent {
  private svc = inject(PersonelService);
  pagination = signal({ page: 1, pageSize: 10 });
  personelResource = this.svc.list(this.pagination());
  // Otomatik: isLoading(), value(), error(), hasValue()
  // Pagination değişince otomatik refetch
}
```

```html
@if (personelResource.isLoading()) {
  <p-progressspinner />
} @else if (personelResource.error()) {
  <p-message severity="error" text="Hata oluştu" />
} @else if (personelResource.hasValue()) {
  <p-table [value]="personelResource.value()!.data" [paginator]="true" [rows]="10">
    <ng-template pTemplate="header">
      <tr><th>Ad</th><th>Soyad</th><th>İşlemler</th></tr>
    </ng-template>
    <ng-template pTemplate="body" let-row>
      <tr>
        <td>{{ row.ad }}</td>
        <td>{{ row.soyad }}</td>
        <td>
          <p-button icon="pi pi-pencil" severity="secondary" (onClick)="edit(row)" />
          <p-button icon="pi pi-trash" severity="danger" (onClick)="remove(row.id)" />
        </td>
      </tr>
    </ng-template>
  </p-table>
}
```

### Auth (Manuel OIDC — Keycloak Lib YOK)

```ts
// core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  user = signal<AuthUser | null>(null);
  token = signal<string | null>(null);
  roles = computed(() => this.user()?.roles ?? []);
  isLoggedIn = computed(() => !!this.user());

  loginRedirect(returnTo?: string) {
    const state = btoa(JSON.stringify({ returnTo: returnTo ?? '/' }));
    window.location.href = `${appConfig.ssoUrl}/auth?client_id=${appConfig.clientId}&redirect_uri=${appConfig.callbackUrl}&response_type=code&state=${state}`;
  }

  async handleCallback(code: string, state: string) {
    const res = await firstValueFrom(this.http.post<TokenResponse>(`${appConfig.ssoUrl}/token`, { code }));
    this.token.set(res.access_token);
    this.user.set(parseUserFromToken(res.access_token));
    const { returnTo } = JSON.parse(atob(state));
    this.router.navigateByUrl(returnTo);
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    window.location.href = `${appConfig.ssoUrl}/logout`;
  }
}
```

```ts
// core/auth/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;
  auth.loginRedirect(state.url);
  return false;
};
```

```ts
// core/auth/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

---

## 4. Tema Mimarisi — PrimeNG 21 Aura + MFA Paleti

**Felsefe:** Renk her zaman bir CSS değişkeninden gelir. PrimeNG token'ı bu değişkeni referans alır.
Palet değiştirmek için tek `mfa-tokens.css` dosyası düzenlenir → tüm uygulama otomatik retint.

### `src/styles/mfa-tokens.css` (TEK KAYNAK)

```css
/* T.C. Dışişleri Bakanlığı — Kurumsal Renk Token'ları */
:root {
  /* === Ham marka renkleri === */
  --mfa-red:        #DA291C;
  --mfa-gold:       #D7AD4D;
  --mfa-gray:       #53565A;
  --mfa-navy:       #003773;
  --mfa-navy-dark:  #00235A;

  /* === Primary 11-step ramp (PrimeNG zorunlu) === */
  --mfa-red-50:  #FFF5F4;  --mfa-red-100: #FFE3E0;  --mfa-red-200: #FFC2BC;
  --mfa-red-300: #FF9388;  --mfa-red-400: #F4604F;  --mfa-red-500: #DA291C;
  --mfa-red-600: #B61F14;  --mfa-red-700: #921810;  --mfa-red-800: #6E120C;
  --mfa-red-900: #4D0C08;  --mfa-red-950: #2A0604;

  /* === Surface ramp (nötr) === */
  --mfa-surface-0:    #FFFFFF;  --mfa-surface-50:  #FAFAFA;  --mfa-surface-100: #F4F4F5;
  --mfa-surface-200:  #E4E4E7;  --mfa-surface-300: #D4D4D8;  --mfa-surface-400: #A1A1AA;
  --mfa-surface-500:  #71717A;  --mfa-surface-600: #52525B;  --mfa-surface-700: #3F3F46;
  --mfa-surface-800:  #27272A;  --mfa-surface-900: #18181B;  --mfa-surface-950: #09090B;
}
```

### `src/app/core/config/theme.config.ts`

```ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

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

### `src/app/app.config.ts`

```ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MfaPreset } from './core/config/theme.config';
import { authInterceptor } from './core/auth/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),  // v22 default — Zone.js YOK
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MfaPreset,
        options: {
          darkModeSelector: '.p-dark',
          cssLayer: { name: 'primeng', order: 'tailwind-base, primeng, tailwind-utilities' },
        },
      },
    }),
    // Keycloak/OIDC provider YOK — AuthService kendisi handle eder
  ],
};
```

### Tailwind v4 + PrimeNG Köprüsü

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "tailwindcss-primeui";
@import "./mfa-tokens.css";

@theme inline {
  --color-primary:          var(--mfa-red);
  --color-brand-red:        var(--mfa-red);
  --color-brand-gold:       var(--mfa-gold);
  --color-brand-gray:       var(--mfa-gray);
  --color-brand-navy:       var(--mfa-navy);
  --color-brand-navy-dark:  var(--mfa-navy-dark);
}
```

Bundan sonra `<p-button severity="primary">`, `class="bg-primary"` ve `style="background:var(--mfa-red)"`
**üçü de aynı `--mfa-red` değişkenini okur**. Tek-kaynak ilkesi mükemmel korunur.

---

## 5. Faz Faz Yol Haritası (Day 0 → Day 14)

### Phase 0 — Pre-flight (Day 0, ~1 saat)

- [ ] Yeni GitHub reposu: `frontend-starter-angular`
- [ ] Bu dokümanı yeni repo'ya kopyala (`docs/angular-migration-plan.md`)
- [ ] Mevcut React template'i `.reference-react/` olarak yeni repo'nun içine clone'la (gitignore'lu):
  ```bash
  git clone https://github.com/mehmetveyselsekendiz/ReactTemplate2026.git .reference-react
  echo ".reference-react/" >> .gitignore
  ```
- [ ] Yeni Claude Code session başlat — bu dokümanı ilk turn'de oku
- [ ] `npm view` ile versiyonları kilitle (Angular 22.x, PrimeNG 21.x, Tailwind 4.x)

### Phase 1 — Scaffold (Day 1)

```bash
npx @angular/cli@latest new mfa-frontend --standalone --routing --style=css --ssr=false --skip-tests=false --strict
cd mfa-frontend

# Sadece zorunlu paketler
npm i primeng@21 @primeng/themes@21 primeicons
npm i tailwindcss@4 @tailwindcss/postcss tailwindcss-primeui

# TanStack Query, Zod, Lucide, keycloak-angular, angular-oauth2-oidc, Axios — HİÇBİRİ YOK
```

- [ ] `tsconfig.json` strict ayarları
- [ ] `eslint.config.js` (Angular ESLint flat config)
- [ ] `.prettierrc`
- [ ] Tailwind v4 CSS-first — `global.css`'te `@theme inline`
- [ ] `postcss.config.js` Tailwind v4 için
- [ ] `mfa-tokens.css` oluştur
- [ ] `theme.config.ts` oluştur
- [ ] `app.config.ts` — **`provideZonelessChangeDetection()`** kullan
- [ ] `npm run start` — boş Angular sayfası açılsın
- [ ] **Doğrulama:** `<p-button label="Test" severity="primary">` ekrana MFA kırmızısı olarak çıkıyor mu?

### Phase 2 — Core Altyapı (Day 2-3)

**Day 2 — Auth (Manuel OIDC, Keycloak lib YOK):**
- [ ] `src/app/core/auth/auth.service.ts` — Signal-based user/token, SSO redirect, callback handler
- [ ] `src/app/core/auth/auth.guard.ts` — Functional `CanActivateFn`
- [ ] `src/app/core/auth/permission.service.ts` — `hasRole`, `anyRole`
- [ ] `src/app/core/auth/auth.interceptor.ts` — Bearer token ekler
- [ ] `src/app/core/auth/auth.callback.component.ts` — SSO dönüş URL handler
- [ ] `src/app/core/http/error.interceptor.ts` — 401 redirect, 403/422/5xx toast
- [ ] `src/app/core/config/app.config.ts` — `window.__ENV__` reader

**Day 3 — Layout + Theme:**
- [ ] `src/app/components/layout/` — `AppShellComponent`, `SidebarComponent`, `TopBarComponent`, `FooterComponent`
- [ ] `src/app/core/config/navigation.config.ts` — Menü yapısı (rol-bazlı)
- [ ] `app.routes.ts` — `/callback`, `/`, `/dashboard` (guarded layout)
- [ ] `ThemeService` (signal dark mode + `.p-dark` toggle + localStorage)
- [ ] `<p-toast />` root layout'a ekle
- [ ] **Doğrulama:** SSO login flow çalışıyor, kullanıcı sidebar'da görünüyor, dark mode toggle ediyor

### Phase 3 — Kütüphane Sayfası (Day 4-6)

**Day 4 — İskelet:**
- [ ] `src/app/features/kutuphane/` klasörü
- [ ] Routes: `/kutuphane/ui`, `/kutuphane/tablo`, `/kutuphane/form`, `/kutuphane/gelismis`
- [ ] `MfaPreviewCardComponent`
- [ ] `?raw` workaround: Build-time script (`scripts/sync-snippets.mjs`) `prebuild` hook ile

**Day 5 — Bölümler (1/2):**
- [ ] Renk Paleti, Tipografi, Butonlar, Rozetler, Kartlar, Uyarılar, Progress

**Day 6 — Bölümler (2/2):**
- [ ] Tabs, Accordion, Dialog, Tooltip, Skeleton, Breadcrumb, Dropdown, Popover, Drawer, EmptyState

### Phase 4 — Tablo + Form + Gelişmiş (Day 7-9)

- **Day 7:** `<p-table>` örnekleri
- **Day 8:** **Signal Forms** örnekleri
- **Day 9:** `<p-chart>` ile dashboard widget'ları

### Phase 5 — Örnek Modül (Day 10)

- [ ] `src/app/features/personel/` — tam CRUD (httpResource + Signal Forms)
- [ ] **Backend gerçek olmalı** — staging API'ye proxy ile bağlan

### Phase 6 — OpenShift / Docker (Day 11-12)

- [ ] Dockerfile (Node 24 → nginx-unprivileged 1.27)
- [ ] `docker-entrypoint.sh` (ConfigMap → `window.__ENV__`)
- [ ] `nginx.conf`, `/health`

### Phase 7 — CLAUDE.md (Day 13)

- [ ] React `CLAUDE.md`'nin 22 bölümünü Angular için yeniden yaz
- [ ] `README.md`, `.env.example`

### Phase 8 — Doğrulama (Day 14)

- [ ] `npm run typecheck` + `lint` + `build` temiz
- [ ] Lighthouse a11y/perf ≥ 90
- [ ] Playwright smoke test
- [ ] Tag: `v0.1.0-template`

---

## 6. Bilinen Riskler

| Risk | Etki | Azaltma |
|---|---|---|
| `?raw` Angular CLI'da yok | Kütüphane kaynak gösterimi | Build-time snippet script |
| Signal Forms API yeni stable | Stack Overflow örnekleri henüz az | Resmi Angular dokümantasyonu birinci kaynak; karmaşıklaşırsa Reactive Forms'a düş |
| Manuel OIDC akışı | Auth bug (state, PKCE, token refresh) | MFA SSO ekibiyle koordineli; React `auth.config.ts` referans |
| Zoneless + 3rd party uyumsuzluğu | Render bug'ları | PrimeNG 21 zoneless ile uyumlu; başka 3rd party EKLEMEDIK |
| PrimeIcons (~250) yetersiz olabilir | UI eksiklik | İlk eksikte değerlendir; gerekirse Lucide tek istisna |

---

## 7. Geçiş Doğrulama Listesi

- [ ] Tüm 5 MFA paleti renginin en az bir bileşende görünmesi
- [ ] Dark mode tutarlı çalışıyor
- [ ] MFA SSO login + logout + token refresh
- [ ] 401 otomatik redirect, 403/422/5xx toast
- [ ] Kütüphane sayfası tam çalışıyor (?raw dahil)
- [ ] Örnek `personel` modülü tam CRUD
- [ ] Production build < 1.5 MB initial (zoneless ile daha küçük)
- [ ] Docker image < 200 MB
- [ ] nginx 8080'de, `/health` 200
- [ ] OpenShift ConfigMap env runtime'da okunuyor
- [ ] `typecheck` + `lint` + `build` temiz
- [ ] CLAUDE.md tüm 22 bölümün Angular karşılığı
- [ ] **Hiçbir external lib eklenmedi** (sadece primeng + tailwind-primeui)

---

## 8. Sonraki Adım — Yeni Session Açılışı

Yeni Angular reposunda Claude Code oturumu açtığında ilk mesaj olarak `docs/yeni-angular-repo-prompt.md`
dosyasındaki prompt metnini yapıştır. Yeni Claude:

1. Önce bu dokümanı okur
2. `npm view` ile versiyonları doğrular
3. Phase 0'dan başlar

---

**Bu dokümanın amacı:** React template'inin tüm kurallarının Angular'a 1:1 yansımasını sağlamak.
**Minimum bağımlılık ilkesi her kararın üstündedir.**
