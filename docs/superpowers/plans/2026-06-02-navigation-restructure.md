# Navigasyon Yeniden Yapılandırma Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sidebar navigasyonunu tek-modül modeline göre ikiye böl (modül nav + dev-only template nav), dashboard'u kaldır, dev referansını collapsible yap; dokümanları güncelle ve türev modül için migration rehberi üret.

**Architecture:** Navigasyon verisi iki dosyaya ayrılır: `module-nav.config.ts` (fork ekibinin düzenlediği, üretimde görünen modül menüsü) ve `template-nav.config.ts` (SSO boşken görünen, collapsible geliştirici referansı). Saf `buildNavGroups(isDevMode)` fonksiyonu ikisini birleştirir; `app.menu` bunu `!appEnv.ssoUrl()` ile çağırır. Dashboard route'u modülün ana sayfasına redirect olur.

**Tech Stack:** Angular 21 (standalone, zoneless, signals), PrimeNG menü, custom i18n (`| t`), Karma+Jasmine (zoneless).

---

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `src/app/core/config/module-nav.config.ts` | **Yeni.** `NavItem`/`NavGroup` tipleri + `MODULE_NAV` (modülün kendi menüsü). Fork ekibi SADECE burayı düzenler. |
| `src/app/core/config/template-nav.config.ts` | **Yeni.** `TEMPLATE_NAV` — collapsible dev referans grupları (Bileşen Kütüphanesi / Kurumsal Kimlik+Ayarlar / Örnek Sayfalar). |
| `src/app/core/config/navigation.config.ts` | Sadeleşir: `buildNavGroups(isDevMode)` saf fonksiyonu + geriye-uyumlu `NAV_GROUPS`, `ROUTE_LABEL_KEY_MAP`, `ROUTE_LABEL_MAP` re-export'ları. |
| `src/app/core/config/navigation.config.spec.ts` | **Yeni.** `buildNavGroups` saf birim testi. |
| `src/app/layout/component/app.menu.ts` | `buildNavGroups(!appEnv.ssoUrl())` kullanır. |
| `src/app.routes.ts` | Dashboard route → `/vize` redirect; `Dashboard` import temizliği. |
| `src/app/pages/dashboard/dashboard.ts` | **Silinir.** |
| `public/i18n/tr.json`, `public/i18n/en.json` | Key ekle/temizle. |
| `CLAUDE.md`, `README.md`, `docs/MODULE-DEV-GUIDE.md`, `docs/ilerleme-ve-kararlar.md` | Yapı güncellemesi. |
| `docs/navigasyon-migrasyon-rehberi.md` | **Yeni** — türev modül için adımlar + hazır prompt. |

---

## Task 1: `module-nav.config.ts` — tipler + MODULE_NAV

**Files:**
- Create: `src/app/core/config/module-nav.config.ts`

- [ ] **Step 1: Dosyayı oluştur**

```ts
import type { MenuItem } from 'primeng/api';

// NavItem: label'a alternatif olarak labelKey (i18n için) eklenir
export interface NavItem extends Omit<MenuItem, 'items'> {
    requiredRoles?: string[];
    /** i18n key — `| t` pipe ile çevrilir. Hem labelKey hem label varsa labelKey kazanır. */
    labelKey?: string;
    items?: NavItem[];
}

// NavGroup: menü üst grubu (label/labelKey + items)
export interface NavGroup {
    label?: string;
    labelKey?: string;
    icon?: string;
    separator?: boolean;
    requiredRoles?: string[];
    items?: NavItem[];
}

/**
 * MODULE_NAV — BU MODÜLÜN kendi menüsü.
 *
 * Bu template her fork'ta TEK bir modül olur (Vize, Pasaport, Personel...).
 * Aşağıdaki örnek "Vize" modülüdür. Fork ekibi:
 *   1. Grup başlığını (labelKey) kendi modülüne göre değiştirir.
 *   2. Kendi sayfalarını item olarak ekler (routerLink + requiredRoles).
 *   3. `app.routes.ts`'teki "/" redirect hedefini kendi ana route'una çevirir.
 *
 * `template-nav.config.ts`'e DOKUNMAYIN — o yalnızca geliştirici referansıdır
 * ve üretimde (SSO yapılandırılınca) otomatik gizlenir.
 */
export const MODULE_NAV: NavGroup[] = [
    {
        labelKey: 'menu.module.vize',
        items: [{ labelKey: 'menu.modules.vize', icon: 'pi pi-fw pi-id-card', routerLink: ['/vize'], requiredRoles: ['VIZE_OKUMA'] }]
    }
];
```

- [ ] **Step 2: Derlenebilirliği kontrol et**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: Hata yok (yeni dosya henüz tüketilmiyor; sadece tip kontrolü).

- [ ] **Step 3: Commit**

```bash
git add src/app/core/config/module-nav.config.ts
git commit -m "feat(nav): module-nav.config — modül menüsü + nav tipleri"
```

---

## Task 2: `template-nav.config.ts` — collapsible dev referansı

**Files:**
- Create: `src/app/core/config/template-nav.config.ts`

- [ ] **Step 1: Dosyayı oluştur**

`TEMPLATE_NAV` tek bir `GELİŞTİRİCİ` root grubudur; altındaki üç madde (`path` taşıyan, nested) collapsible'dır ve varsayılan kapalıdır. İlgili route'a gidilince mevcut `AppMenuitem.updateActiveStateFromRoute` mekaniği o grubu otomatik açar.

```ts
import type { NavGroup } from './module-nav.config';

/**
 * TEMPLATE_NAV — geliştirici referansı. SADECE dev modda (SSO boş) gösterilir.
 * Fork ekibi buraya dokunmaz. `path` alanı olan maddeler collapsible'dır
 * (PrimeNG sakai menüsünde nested item + activePath davranışı).
 */
export const TEMPLATE_NAV: NavGroup[] = [
    {
        labelKey: 'menu.dev',
        items: [
            {
                labelKey: 'menu.library',
                icon: 'pi pi-fw pi-th-large',
                path: 'uikit',
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
                    { labelKey: 'menu.uikit.misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] },
                    { labelKey: 'menu.uikit.patterns', icon: 'pi pi-fw pi-objects-column', routerLink: ['/uikit/patterns'] }
                ]
            },
            {
                labelKey: 'menu.dev.corporate',
                icon: 'pi pi-fw pi-palette',
                path: 'kk',
                items: [
                    { labelKey: 'menu.pages.corporate-identity', icon: 'pi pi-fw pi-palette', routerLink: ['/pages/kurumsal-kimlik'] },
                    { labelKey: 'menu.pages.audit', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/kurumsal-kimlik/denetim'] },
                    { labelKey: 'menu.pages.settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/ayarlar'] }
                ]
            },
            {
                labelKey: 'menu.dev.examples',
                icon: 'pi pi-fw pi-copy',
                path: 'ornek',
                items: [
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
        ]
    }
];
```

- [ ] **Step 2: Derlenebilirliği kontrol et**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: Hata yok.

- [ ] **Step 3: Commit**

```bash
git add src/app/core/config/template-nav.config.ts
git commit -m "feat(nav): template-nav.config — collapsible dev referansı"
```

---

## Task 3: `navigation.config.ts` → `buildNavGroups` + re-export (TDD)

**Files:**
- Modify: `src/app/core/config/navigation.config.ts` (tamamen yeniden yazılır)
- Test: `src/app/core/config/navigation.config.spec.ts` (yeni)

- [ ] **Step 1: Başarısız testi yaz**

```ts
import { buildNavGroups } from './navigation.config';

describe('buildNavGroups', () => {
    it('dev modda template (GELİŞTİRİCİ) grubunu ekler', () => {
        const groups = buildNavGroups(true);
        expect(groups.some((g) => g.labelKey === 'menu.dev')).toBe(true);
        expect(groups.some((g) => g.labelKey === 'menu.module.vize')).toBe(true);
    });

    it('üretim modunda sadece modül nav döner (template gizli)', () => {
        const groups = buildNavGroups(false);
        expect(groups.some((g) => g.labelKey === 'menu.dev')).toBe(false);
        expect(groups.some((g) => g.labelKey === 'menu.module.vize')).toBe(true);
    });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL — `buildNavGroups is not a function` / `navigation.config` export yok (henüz yeniden yazılmadı).

- [ ] **Step 3: navigation.config.ts'i yeniden yaz**

```ts
import { MODULE_NAV, type NavGroup, type NavItem } from './module-nav.config';
import { TEMPLATE_NAV } from './template-nav.config';

// Geriye uyumluluk: tipler eski yoldan da import edilebilsin
export type { NavItem, NavGroup };

/**
 * Sidebar gruplarını kur. Dev modda (SSO boş) geliştirici referansı eklenir;
 * üretimde sadece modülün kendi menüsü görünür.
 */
export function buildNavGroups(isDevMode: boolean): NavGroup[] {
    return isDevMode ? [...MODULE_NAV, ...TEMPLATE_NAV] : [...MODULE_NAV];
}

// Geriye uyumlu tam liste (breadcrumb / olası tüketiciler)
export const NAV_GROUPS: NavGroup[] = buildNavGroups(true);

// Breadcrumb için: route → labelKey eşlemesi
export const ROUTE_LABEL_KEY_MAP: Record<string, string> = {
    '/': 'menu.module.vize',
    '/vize': 'menu.modules.vize',
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
    '/uikit/patterns': 'menu.uikit.patterns',
    '/pages/kurumsal-kimlik': 'menu.pages.corporate-identity',
    '/pages/kurumsal-kimlik/denetim': 'menu.pages.audit',
    '/pages/crud': 'menu.pages.crud',
    '/pages/empty': 'menu.pages.empty',
    '/pages/ayarlar': 'menu.pages.settings',
    '/auth/login': 'menu.pages.auth.login'
};

// Eski sabit hâlâ tüketicide çağrılıyorsa adapter
export const ROUTE_LABEL_MAP: Record<string, string> = ROUTE_LABEL_KEY_MAP;
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test`
Expected: PASS — `buildNavGroups` iki testi de yeşil.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/config/navigation.config.ts src/app/core/config/navigation.config.spec.ts
git commit -m "feat(nav): buildNavGroups + geriye-uyumlu re-export (test)"
```

---

## Task 4: `app.menu.ts` — dev moda göre birleştir

**Files:**
- Modify: `src/app/layout/component/app.menu.ts`

- [ ] **Step 1: Import ve filteredModel'i güncelle**

`NAV_GROUPS` yerine `buildNavGroups` + `appEnv` kullan. Mevcut dosyada şu satırı:

```ts
import { NAV_GROUPS, NavItem } from '@/app/core/config/navigation.config';
```

şununla değiştir:

```ts
import { buildNavGroups, NavItem } from '@/app/core/config/navigation.config';
import { appEnv } from '@/app/core/config/app-env';
```

- [ ] **Step 2: `filteredModel` gövdesinde `NAV_GROUPS` → `buildNavGroups(...)`**

`filteredModel` içindeki şu satırı:

```ts
        return NAV_GROUPS.filter((g) => this.hasAccess(g.requiredRoles, roles)).map((g) => ({
```

şununla değiştir:

```ts
        // SSO boşsa dev modu → geliştirici referansını ekle; doluysa sadece modül nav
        const groups = buildNavGroups(!appEnv.ssoUrl());
        return groups.filter((g) => this.hasAccess(g.requiredRoles, roles)).map((g) => ({
```

- [ ] **Step 3: Build + test ile doğrula**

Run: `npm test`
Expected: PASS — mevcut testler kırılmaz (app.menu testi yok; navigation.config testi yeşil kalır).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout/component/app.menu.ts
git commit -m "feat(nav): app.menu dev modda template nav'ı ekler"
```

---

## Task 5: `app.routes.ts` — dashboard route → redirect

**Files:**
- Modify: `src/app.routes.ts`

- [ ] **Step 1: Dashboard import'unu kaldır, route'u redirect yap**

Mevcut dosyayı tamamen şununla değiştir:

```ts
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // "/" modülün ana sayfasına yönlenir. Fork ekibi 'vize'yi kendi ana route'uyla değiştirir.
            { path: '', redirectTo: 'vize', pathMatch: 'full' },
            { path: 'vize', loadChildren: () => import('./app/features/vize/vize.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
```

- [ ] **Step 2: Build ile doğrula**

Run: `npm run build`
Expected: Başarılı build (Dashboard artık referans edilmiyor).

- [ ] **Step 3: Commit**

```bash
git add src/app.routes.ts
git commit -m "feat(nav): '/' → /vize redirect; dashboard route kaldırıldı"
```

---

## Task 6: Dashboard sayfasını sil

**Files:**
- Delete: `src/app/pages/dashboard/dashboard.ts` (ve boşalırsa klasör)

- [ ] **Step 1: Dosyayı sil**

Run: `git rm src/app/pages/dashboard/dashboard.ts`
Expected: Dosya silindi.

- [ ] **Step 2: Kalan referans olmadığını doğrula**

Run: `npx tsc --noEmit -p tsconfig.json` ve ayrıca `grep -rn "pages/dashboard\|/dashboard/dashboard\|{ Dashboard }" src/`
Expected: tsc hata yok; grep boş (referans kalmadı).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(nav): sahte dashboard sayfası kaldırıldı"
```

---

## Task 7: i18n key güncellemeleri

**Files:**
- Modify: `public/i18n/tr.json`
- Modify: `public/i18n/en.json`

- [ ] **Step 1: tr.json — eski grup key'lerini değiştir/ekle**

`tr.json` başındaki blokta şu iki satırı:

```json
  "app.module_name": "KURUMSAL MODÜL",
  "menu.home": "Ana Sayfa",
  "menu.dashboard": "Dashboard",
  "menu.library": "Bileşen Kütüphanesi",
```

şununla değiştir (yeni grup key'leri eklenir, `menu.home`/`menu.dashboard` kaldırılır):

```json
  "app.module_name": "KURUMSAL MODÜL",
  "menu.dev": "Geliştirici",
  "menu.dev.corporate": "Kurumsal Kimlik",
  "menu.dev.examples": "Örnek Sayfalar",
  "menu.module.vize": "Vize İşlemleri",
  "menu.library": "Bileşen Kütüphanesi",
```

- [ ] **Step 2: tr.json — `menu.modules` / `menu.pages` satırlarını sil**

Şu iki satırı bul ve **sil** (item key `menu.modules.vize` KALIR — breadcrumb kullanır):

```json
  "menu.pages": "Sayfalar",
```

ve

```json
  "menu.modules": "Modüller",
```

(`menu.modules.vize` satırına dokunma.)

- [ ] **Step 3: tr.json — dashboard.* key'lerini sil**

Şu satırların tamamını sil:

```json
  "dashboard.welcome.title": "Hoş geldiniz",
  "dashboard.welcome.title.named": "Hoş geldiniz, {name}",
  "dashboard.welcome.subtitle": "T.C. Dışişleri Bakanlığı — Kurumsal Uygulama Platformu",
  "dashboard.link.library.description": "PrimeNG bileşenlerini MFA kurumsal paletinde inceleyin",
  "dashboard.link.corporate.description": "MFA renk paleti, tipografi ve logo kullanım rehberi",
  "dashboard.link.crud.description": "Veri listeleme, ekleme ve düzenleme sayfası şablonu",
  "dashboard.link.empty.description": "Yeni modül geliştirmek için başlangıç şablonu",
  "dashboard.action.inspect": "İncele",
```

- [ ] **Step 4: en.json — aynı düzenlemeler (İngilizce karşılıklar)**

`en.json` başında `menu.home`/`menu.dashboard`'ı kaldırıp yeni key'leri ekle:

```json
  "menu.dev": "Developer",
  "menu.dev.corporate": "Corporate Identity",
  "menu.dev.examples": "Example Pages",
  "menu.module.vize": "Visa Operations",
```

`en.json`'daki `menu.modules` ("Modules") ve `menu.pages` ("Pages") satırlarını sil (`menu.modules.vize` kalır). `dashboard.*` key'lerinin İngilizce karşılıklarını da sil.

- [ ] **Step 5: JSON geçerliliğini ve build'i doğrula**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/i18n/tr.json','utf8')); JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8')); console.log('OK')"`
Expected: `OK` (iki JSON da geçerli).

- [ ] **Step 6: Commit**

```bash
git add public/i18n/tr.json public/i18n/en.json
git commit -m "i18n(nav): yeni grup key'leri + eski/dashboard key temizliği"
```

---

## Task 8: Doğrulama — build + lint + test + görsel

**Files:** (yok — sadece doğrulama)

- [ ] **Step 1: Governance + token lint**

Run: `npm run lint:palette && npm run lint:tokens`
Expected: İkisi de `exit 0` (ihlal/drift yok).

- [ ] **Step 2: Birim testleri + script testleri**

Run: `npm test && npm run test:scripts`
Expected: Hepsi PASS.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Başarılı.

- [ ] **Step 4: Görsel doğrulama (preview)**

`preview_start` → ana sayfa açılınca otomatik `/vize`'ye yönlenmeli. Dev modda (SSO boş) sidebar: `VİZE İŞLEMLERİ` + `GELİŞTİRİCİ` (Bileşen Kütüphanesi / Kurumsal Kimlik / Örnek Sayfalar — varsayılan KAPALI, tıklayınca açılır). `/uikit/table`'a gidince Bileşen Kütüphanesi grubu otomatik açılmalı.
Expected: Yukarıdaki davranış. Ekran görüntüsüyle kullanıcıya kanıt sun.

- [ ] **Step 5: (Doğrulama commit'i yok — kod değişmedi)**

---

## Task 9: Dokümantasyon güncellemeleri

**Files:**
- Modify: `CLAUDE.md`, `README.md`, `docs/MODULE-DEV-GUIDE.md`, `docs/ilerleme-ve-kararlar.md`

- [ ] **Step 1: CLAUDE.md — §10 Klasör Yapısı**

`core/config/` satırını güncelle. Mevcut:

```
│   │   ├── config/                # app-env, theme.config, navigation.config, design-tokens
```

şununla değiştir:

```
│   │   ├── config/                # app-env, theme.config, module-nav + template-nav (+navigation.config birleştirici), design-tokens
```

- [ ] **Step 2: CLAUDE.md — §15 topbar gerçeği düzeltmesi**

§15'teki "Topbar `pi-cog` butonu → sağ `<p-drawer>`" ifadesini şununla değiştir:

```
- Topbar 3'lü ayar grubu (dil/font/tema) → ayarları doğrudan değiştirir (hızlı ayar). Tam Ayarlar sayfası `/pages/ayarlar` dev sidebar'da Kurumsal Kimlik grubundadır.
```

- [ ] **Step 3: CLAUDE.md — navigasyon modeli notu ekle**

§9 (Klasör Sorumluluğu) altındaki `src/app/core/` maddesine şu cümleyi ekle:

```
  - **Navigasyon:** `module-nav.config.ts` (fork ekibi düzenler, üretimde görünür) ve `template-nav.config.ts` (dev-only referans, SSO boşken görünür) ayrıdır. Her fork = TEK modül; "Modüller" üst sekmesi yoktur.
```

- [ ] **Step 4: README.md — navigasyon bölümü**

README'de menü/başlangıç bölümü varsa, "/" → modül ana sayfası ve module-nav/template-nav ayrımını 2-3 cümleyle ekle. Yoksa "Navigasyon" başlıklı kısa bölüm ekle:

```markdown
## Navigasyon

- `src/app/core/config/module-nav.config.ts` — bu modülün menüsü (fork ekibi düzenler).
- `src/app/core/config/template-nav.config.ts` — geliştirici referansı (yalnızca SSO boşken görünür, üretimde gizli).
- `/` modülün ana sayfasına yönlenir (`app.routes.ts` içindeki redirect; fork kendi route'una çevirir).
```

- [ ] **Step 5: MODULE-DEV-GUIDE.md — fork yönergesi**

`docs/MODULE-DEV-GUIDE.md`'ye "Navigasyonu uyarlama" başlıklı bölüm ekle:

```markdown
## Navigasyonu uyarlama

1. `src/app/core/config/module-nav.config.ts` → `MODULE_NAV` grubunun `labelKey`'ini ve item'larını kendi modülünüze göre değiştirin.
2. `src/app.routes.ts` → `{ path: '', redirectTo: 'vize', ... }` hedefini kendi ana route'unuza çevirin.
3. `template-nav.config.ts`'e DOKUNMAYIN — geliştirici referansıdır, üretimde otomatik gizlenir.
4. Yeni menü etiketleri için `tr.json`/`en.json`'a `menu.*` key ekleyin (sabit metin yazmayın).
```

- [ ] **Step 6: ilerleme-ve-kararlar.md — karar kaydı**

`docs/ilerleme-ve-kararlar.md` sonundaki son karar numarasını bul (`K-NNN`) ve bir sonraki numarayla şu kaydı ekle:

```markdown
### K-NNN: Navigasyon tek-modül modeli (module-nav vs template-nav)
- Sidebar ikiye bölündü: `module-nav.config.ts` (fork düzenler, üretimde görünür) + `template-nav.config.ts` (dev-only, SSO boşken, collapsible referans).
- Dashboard kaldırıldı; "/" → modül ana sayfasına (`/vize`) redirect.
- Her fork = TEK modül; "Modüller" üst sekmesi yok. Ayarlar sayfası korundu (dev sidebar'da Kurumsal Kimlik altında; üretimde topbar hızlı-ayar grubundan).
- Tasarım: `docs/superpowers/specs/2026-06-02-navigation-restructure-design.md`.
```

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md README.md docs/MODULE-DEV-GUIDE.md docs/ilerleme-ve-kararlar.md
git commit -m "docs(nav): yapı güncellemeleri (CLAUDE/README/guide/kararlar)"
```

---

## Task 10: Türev modül için migration rehberi + prompt

**Files:**
- Create: `docs/navigasyon-migrasyon-rehberi.md`

- [ ] **Step 1: Rehberi yaz**

```markdown
# Navigasyon Migrasyon Rehberi — Türev Modüller

Bu rehber, MFA template'inin **eski bir sürümünden** geliştirilmiş bir modüle, yeni
navigasyon yapısını (tek-modül modeli) uygulamak içindir.

## Ne değişiyor (özet)

1. Sidebar ikiye bölünür: `module-nav.config.ts` (modülün kendi menüsü) +
   `template-nav.config.ts` (dev-only geliştirici referansı).
2. `app.menu.ts` ikisini `buildNavGroups(!appEnv.ssoUrl())` ile birleştirir;
   SSO doluysa template referansı gizlenir.
3. Dashboard kaldırılır; `/` modülün ana route'una redirect olur.
4. Dağınık "Sayfalar" grubu temizlenir; dev referans grupları collapsible olur.

## Adım adım

1. **Referans template'i aç.** Bu template projesinin nihai dosyalarını oku:
   - `src/app/core/config/module-nav.config.ts`
   - `src/app/core/config/template-nav.config.ts`
   - `src/app/core/config/navigation.config.ts`
   - `src/app/layout/component/app.menu.ts`
   - `src/app.routes.ts`
2. **module-nav.config.ts** oluştur; `MODULE_NAV` grubunu KENDİ modülünün
   sayfalarıyla doldur (grup `labelKey` = modül adı; item'lar kendi route'ların).
3. **template-nav.config.ts** oluştur; referans template'tekiyle birebir kopyala
   (dev referansı modüle özgü değildir).
4. **navigation.config.ts**'i `buildNavGroups` + re-export olacak şekilde uyarla.
5. **app.menu.ts**'i `buildNavGroups(!appEnv.ssoUrl())` kullanacak şekilde güncelle.
6. **app.routes.ts**: dashboard route'unu kaldır, `{ path:'', redirectTo:'<senin-ana-route>', pathMatch:'full' }` ekle. Varsa dashboard sayfasını sil.
7. **i18n**: kendi `menu.*` grup key'lerini ekle; kullanılmayan `menu.home`,
   `menu.dashboard`, `menu.modules`, `menu.pages`, `dashboard.*` key'lerini temizle.
8. Doğrula: `npm run lint:palette`, `npm test`, `npm run build`, görsel kontrol.

## Hazır Prompt (türev projede Claude Code'a yapıştır)

> Bu projede sidebar navigasyonunu MFA template'inin yeni "tek-modül" modeline
> taşımanı istiyorum. Referans template şu yolda: **`<BURAYA TEMPLATE PROJESİNİN
> TAM YOLUNU YAZ>`**. Şu adımları izle:
>
> 1. Referans template'teki şu dosyaları OKU ve deseni anla:
>    `src/app/core/config/module-nav.config.ts`, `template-nav.config.ts`,
>    `navigation.config.ts`, `src/app/layout/component/app.menu.ts`,
>    `src/app.routes.ts`.
> 2. Bu projede `template-nav.config.ts`'i referanstakiyle BİREBİR oluştur
>    (geliştirici referansı modüle özgü değildir).
> 3. `module-nav.config.ts`'i oluştur ama `MODULE_NAV`'ı BU PROJENİN kendi
>    sayfalarıyla doldur — referanstaki Vize örneğini KOPYALAMA; bu projedeki
>    mevcut menü maddelerini (route + roller + i18n key) koru.
> 4. `navigation.config.ts`'i `buildNavGroups` + geriye-uyumlu re-export olacak
>    şekilde uyarla; `app.menu.ts`'i `buildNavGroups(!appEnv.ssoUrl())` kullanacak
>    şekilde güncelle.
> 5. `app.routes.ts`'te dashboard route'unu kaldır ve `{ path:'', redirectTo:
>    '<bu projenin ana route'u>', pathMatch:'full' }` ekle; varsa dashboard
>    sayfasını sil ve kalan referansları temizle.
> 6. i18n dosyalarında kendi grup key'lerini ekle, kullanılmayan eski key'leri sil.
> 7. Her adımdan sonra `npm run build` ve `npm test` ile doğrula; bitince
>    `npm run lint:palette` çalıştır. Kuralları MUTLAKA koru: sıfır yeni paket,
>    sabit Türkçe metin yok (i18n key), hardcoded renk yok.
> 8. Bu projedeki modül adlarını/route'larını DEĞİŞTİRME — sadece navigasyon
>    iskeletini yeni modele uyarla.

## Dikkat

- Bu projenin mevcut modül sayfaları/route'ları korunur; sadece navigasyon
  iskeleti değişir.
- `template-nav.config.ts` üretimde otomatik gizlidir (SSO dolu) — silmene gerek yok.
- Bu projede dosya/route adları template'ten farklıysa, prompt'taki `<...>`
  yer tutucularını ona göre doldur.
```

- [ ] **Step 2: Commit**

```bash
git add docs/navigasyon-migrasyon-rehberi.md
git commit -m "docs(nav): türev modül migration rehberi + hazır prompt"
```

---

## Self-Review Notları

- **Spec kapsamı:** K1–K7 → Task 1-7 (yapı/route/i18n/Ayarlar), §4.6 → Task 9 (docs), §4.7 → Task 10 (migration). Görsel/dev-mode davranışı → Task 8.
- **TDD:** Ana mantık (`buildNavGroups` dev/prod ayrımı) Task 3'te testle korunur; gerisi declarative wiring (build + görsel ile doğrulanır).
- **Tip tutarlılığı:** `NavGroup`/`NavItem` Task 1'de tanımlanır, diğer tüm task'lar bu isimleri kullanır; `buildNavGroups(isDevMode: boolean)` imzası Task 3 ve Task 4'te birebir aynı.
- **i18n:** `menu.modules.vize` (item) korunur (breadcrumb bağımlılığı); silinen yalnızca grup/dashboard key'leri.
```
