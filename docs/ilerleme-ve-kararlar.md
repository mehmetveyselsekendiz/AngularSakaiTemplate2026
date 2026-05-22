# MFA Angular Template — İlerleme ve Kararlar

> Bu dosya her oturumda alınan kararları ve tamamlanan adımları kaydeder.
> Yol haritası için bkz. [`sakai-mfa-uyarlama-plani.md`](sakai-mfa-uyarlama-plani.md)

---

## Oturum 1 — 20 Mayıs 2026

### Tamamlanan Adımlar

- [x] `docs/sakai-mfa-uyarlama-plani.md` okundu, özet verildi
- [x] Proje durumu doğrulandı: Angular 21, PrimeNG 21, Tailwind v4, paket listesi CLAUDE.md ile uyumlu
- [x] `.reference-react/` klasörü mevcut ve içerik tam
- [x] `node_modules/` mevcut (`npm install` daha önce çalıştırılmış)
- [x] **Sorun tespit edildi:** `src/assets/` klasörü repo'ya hiç commit edilmemiş — `styles.scss` ve `tailwind.css` yoktu; build başlamıyordu
- [x] **Çözüm:** PrimeFaces `sakai-ng` upstream'i `sakai` adıyla eklendi; submodule URL'si `https://github.com/cetincakiroglu/sakai-assets` olarak bulundu; `git archive` ile `src/assets/` içeriği çıkartıldı
- [x] `src/assets/` klasörü artık mevcut: `styles.scss`, `tailwind.css`, `layout/`, `demo/` SCSS dosyaları

### Phase 1 — Sakai Demo Temizliği (Tamamlandı)

- [x] `src/index.html` — Lato CDN font kaldırıldı, favicon düzeltildi
- [x] `src/app.routes.ts` — Landing ve Documentation rotaları kaldırıldı
- [x] `src/app/layout/component/app.menu.ts` — Tüm menü Türkçeleştirildi, MFA yapısına çevrildi
- [x] `src/app/layout/component/app.topbar.ts` — SAKAI logosu → MFA, palette butonu kaldırıldı
- [x] `src/app/layout/component/app.configurator.ts` — Tamamen silindi
- [x] `src/app/layout/component/app.floatingconfigurator.ts` — Sadece dark toggle bırakıldı
- [x] `src/app/pages/auth/login.ts` — PrimeLand içerikleri Türkçeleştirildi
- [x] `package.json` — `primeclt` kaldırıldı
- [x] `src/app/pages/landing/` — Klasör silindi
- [x] `src/app/pages/service/` — Demo servisler silindi (customer, product, node, photo), country.service korundu
- [x] `public/demo/` — Demo görseller silindi, `flags/` korundu
- [x] `tabledemo.ts`, `treedemo.ts`, `crud.ts`, `recentsaleswidget.ts`, `inputdemo.ts`, `listdemo.ts`, `mediademo.ts`, `overlaydemo.ts` — Silinen servis bağımlılıkları inline statik verilerle değiştirildi
- [x] Build doğrulandı: `npx ng build --configuration development` — **BAŞARILI**, hata yok

### Phase 2 — MFA Tema Entegrasyonu (Tamamlandı)

- [x] `src/assets/mfa-tokens.scss` oluşturuldu — 6 marka rengi, 5 adet 11-adımlı palet (red/navy/gold/danger/surface)
- [x] `src/app/core/config/theme.config.ts` oluşturuldu — `MfaPreset = definePreset(Aura, {...})`
- [x] PrimeNG primitive override stratejisi uygulandı: `sky` → lacivert, `orange` → altın, `red` → tehlike
  - Bu sayede Button/Tag/Badge/Toast/Message tüm bileşenler severity eşlemesi olmadan otomatik MFA rengi kullanır
- [x] `src/app.config.ts` güncellendi — `providePrimeNG({ preset: MfaPreset })`
- [x] `src/assets/styles.scss` güncellendi — `@use '@/assets/mfa-tokens.scss'`
- [x] Build doğrulandı: **BAŞARILI**

### Phase 3 — Kurumsal Kimlik Sayfası (Tamamlandı)

- [x] `src/app/core/config/design-tokens.ts` oluşturuldu — React referansıyla hizalı TypeScript sabitler
  - `brandColors` (6 renk: 5 resmi + 1 Angular eki `danger`)
  - `brandTypography` (dijital: Helvetica, Times; basılı: Myriad Pro, Minion Pro, Snell Roundhand)
  - `logoVariants` (6 varyant, min boyutlar)
  - `logoBackgroundRules` (6 zemin-logo eşleşme kuralı)
  - `differentiationAreas` (4 farklılaşma alanı)
  - `corporateIdentity` aggregate export
- [x] `src/app/pages/kurumsal-kimlik/kurumsal-kimlik.ts` oluşturuldu
  - Tamamen `design-tokens.ts`'ten besleniyor; renk değişikliğinde sayfa otomatik güncellenir
  - Bölümler: Renk Paleti, Farklılaşma Alanları, Tipografi, Logo Varyantları, Zemin Kuralları
- [x] `src/app/pages/pages.routes.ts` güncellendi — `/pages/kurumsal-kimlik` rotası eklendi
- [x] `src/app/layout/component/app.menu.ts` güncellendi — "Sayfalar" grubuna "Kurumsal Kimlik" eklendi
- [x] Build doğrulandı: **BAŞARILI**

### Phase 4 — Bileşen Kütüphanesi (Tamamlandı)

- [x] `src/app/pages/kutuphane/kutuphane.ts` oluşturuldu — `/pages/kutuphane` rotasında yaşayan stil rehberi
  - 6 sekmeli `p-tabs` navigasyonu: Butonlar, Form, Mesajlar, Tablo & Etiketler, Overlay, Durum
  - Her bölümde canlı örnek + "Kodu Göster/Gizle" toggle + kopyalanabilir snippet
  - `signal()` ile dialog/drawer görünürlük yönetimi (zoneless uyumlu)
  - `MessageService` ile toast demo — yeni bağımlılık eklenmedi
- [x] `src/app/pages/pages.routes.ts` güncellendi — `{ path: 'kutuphane', component: Kutuphane }` eklendi
- [x] `src/app/layout/component/app.menu.ts` güncellendi — "Bileşen Kütüphanesi" menü öğesi eklendi
- [x] `CLAUDE.md` güncellendi — Bölüm 14: Governance kuralı eklendi (kütüphanede olmayan bileşen kullanılamaz)
- [x] Build doğrulandı: **BAŞARILI**

### Phase 5 — Manuel OIDC Auth (Tamamlandı)

- [x] `src/app/core/types/auth.types.ts` oluşturuldu — `AuthUser`, `OidcTokenResponse`, `ApiError` interface'leri + `Window.__ENV__` global tipi
- [x] `src/app/core/config/app-env.ts` oluşturuldu — React `auth.config.ts`'ten port; `window.__ENV__` okuyucu, `extractRoles()` (realm_access / profile.roles / resource_access), `appEnv` sabiti
- [x] `public/config.js` oluşturuldu — boş şablon (`window.__ENV__ = { SSO_URL, CLIENT_ID, REDIRECT_URI, POST_LOGOUT_URI, API_URL, PORTAL_URL }`)
- [x] `src/app/core/auth/auth.service.ts` oluşturuldu — PKCE (SHA-256 + base64url), `signal<AuthUser | null>`, `computed isLoggedIn / roles / displayName`, `loginRedirect()` / `handleCallback()` / `logout()` / `getToken()` / `consumeReturnTo()`
- [x] `src/app/core/auth/auth.guard.ts` oluşturuldu — Functional `CanActivateFn`, `isLoggedIn()` yoksa `loginRedirect(state.url)`
- [x] `src/app/core/auth/auth.interceptor.ts` oluşturuldu — `HttpInterceptorFn`, Bearer token enjekte (token endpoint hariç)
- [x] `src/app/core/http/error.interceptor.ts` oluşturuldu — 401→loginRedirect+EMPTY, 403/422/5xx/0→MessageService toast
- [x] `src/app/core/auth/auth.callback.component.ts` oluşturuldu — URL `code`+`state` al, `handleCallback()` çağır, `consumeReturnTo()`'ya yönlendir
- [x] `src/app/core/auth/permission.service.ts` oluşturuldu — `hasRole(role): Signal<boolean>`, `anyRole(roles[]): Signal<boolean>`
- [x] `src/app.config.ts` güncellendi — `withInterceptors([authInterceptor, errorInterceptor])` + global `MessageService` provider
- [x] `src/app.routes.ts` güncellendi — AppLayout rotasına `canActivate: [authGuard]`
- [x] `src/app/pages/auth/auth.routes.ts` güncellendi — `{ path: 'callback', component: AuthCallback }` eklendi
- [x] `src/app/pages/auth/login.ts` güncellendi — e-posta/şifre formu kaldırıldı, "MFA SSO ile Giriş Yap" butonu eklendi
- [x] `src/app/layout/component/app.topbar.ts` güncellendi — `AuthService` inject, `displayName()` göster, tıklayınca `logout()`
- [x] `src/app/layout/component/app.layout.ts` güncellendi — global `<p-toast />` eklendi
- [x] `src/index.html` güncellendi — `<script src="config.js">` + sayfa başlığı Türkçeleştirildi
- [x] Build doğrulandı: **BAŞARILI**

### Phase 6 — Bileşen Kütüphanesi (Tamamlandı)

**Bağlam:** Phase 4'te oluşturulan `/pages/kutuphane` sınırlı kalmıştı (~20 bileşen). Sakai'nin orijinal `/uikit/*` sayfaları Phase 1'de route'dan kaldırılmış ama dosyalar disk üzerinde duruyordu. Karar: `/uikit/*` sayfaları tek yetkili bileşen referansı olarak restore edildi (bkz. K-007).

- [x] `src/app/pages/uikit/buttondemo.ts` — Harici CDN PrimeFaces logosu kaldırıldı; "Templating" bölümü PrimeIcons'lu yerel butonlarla yeniden yazıldı
- [x] `src/app/pages/uikit/overlaydemo.ts` — `CommonModule` eklendi (currency pipe için); kırık `/demo/images/product/*.jpg` görselli tablo kaldırıldı, yerine isim + TRY para birimi fiyat sütunu getirildi; `ToastModule` çift import temizlendi
- [x] `src/app/pages/uikit/filedemo.ts` — Sıfırdan yeniden yazıldı: `https://www.primefaces.org/cdn/api/upload.php` → `/api/upload`; `inject()` pattern'ine geçildi; Türkçeleştirildi; sadeleştirildi
- [x] `src/app/pages/uikit/mediademo.ts` — Sıfırdan yeniden yazıldı: Tüm CDN görsel URL'leri kaldırıldı; `svgPlaceholder(w, h, bg, label)` yardımcı fonksiyonu oluşturuldu — `data:image/svg+xml` URI üretir, CDN bağımlılığı yok; Carousel: 5 MFA hizmet kartı (Vize, Pasaport, Konsolosluk, Belge, Tercüme) PrimeIcons + MFA paletleriyle; Galleria: 5 MFA palet renkli SVG placeholder; Image: tek SVG placeholder
- [x] `src/app/pages/uikit/chartdemo.ts` — Pie/Polar/Radar chart renkleri `--p-indigo`, `--p-purple`, `--p-teal`, `--p-orange` → `--mfa-red`, `--mfa-navy`, `--mfa-gold`, `--mfa-gray`; tüm dataset etiketleri Türkçeleştirildi
- [x] `src/app/pages/uikit/editordemo.ts` — YENİ DOSYA: `p-editor` (Quill peer dep zaten var) Zengin Metin Editörü demosu; tam toolbar (başlık seçici, kalın/italik/altçizgi/üstüçizgi, renk/arka plan seçici, liste/girintileme, hizalama, bağlantı/görsel/kod-bloğu, temizle); salt okunur mod demosu; `@if (icerik())` koşullu HTML çıktı önizlemesi; `signal<string>('')`, `temizle()`, `varsayilanYukle()` metodları
- [x] `src/app/pages/uikit/uikit.routes.ts` — `EditorDemo` import + `{ path: 'editor', data: { breadcrumb: 'Zengin Metin' }, component: EditorDemo }` rotası eklendi; tüm breadcrumb'lar Türkçeleştirildi
- [x] `src/app/pages/pages.routes.ts` — `Kutuphane` import ve `{ path: 'kutuphane', component: Kutuphane }` rotası kaldırıldı (`kutuphane/` klasörü dosya olarak diskte duruyor — henüz silinmedi)
- [x] `src/app/layout/component/app.menu.ts` — Menü grubu "Kütüphane" → "Bileşen Kütüphanesi"; Sayfalar grubundan "Kütüphane" linki kaldırıldı; "Zengin Metin" menü öğesi eklendi (`/uikit/editor`)
- [x] `CLAUDE.md` Bölüm 14 — Governance kaynağı `/pages/kutuphane` → `/uikit/*`; CDN asset yasağı kuralı eklendi; eski onaylı bileşen listesi kaldırıldı
- [x] Build doğrulandı: **BAŞARILI** (commit `16f4e3e`)

### Geliştirici Login Bypass + Commit Temizliği — 20 Mayıs 2026 (Oturum 2, devam)

- [x] Phase 5-6 dosyalarındaki Prettier format değişiklikleri commit edildi (`74ae37c`)
- [x] `src/app/core/auth/auth.service.ts` — `devLogin(displayName)` metodu eklendi
  - Yalnızca `SSO_URL` boş olduğunda çalışır (production'da otomatik devre dışı)
  - Mock `AuthUser` oluşturur, sessionStorage'a yazar, `/` adresine yönlendirir
- [x] `src/app/pages/auth/login.ts` — Geliştirici bypass bölümü eklendi
  - `@if (!isSsoConfigured)` ile SSO URL tanımlıysa hiç gösterilmez
  - "GELİŞTİRİCİ MODU" altın rengi badge, görünen ad input'u, "Geliştirici Olarak Devam Et" butonu
  - `InputTextModule` import eklendi; signal tabanlı input (`devName`)
- [x] Build doğrulandı: **BAŞARILI** (22.3 sn)

### Phase 6 Devam + Phase 7 Başlangıcı — 20 Mayıs 2026 (Oturum 2)

- [x] `src/app/pages/kutuphane/` klasörü silindi (route'dan daha önce kaldırılmıştı, diskteki atıl dosya temizlendi)
- [x] `src/app/core/config/navigation.config.ts` oluşturuldu
  - `NavItem` interface (MenuItem genişlemesi + `requiredRoles?`)
  - `NavGroup` interface (üst grup + `requiredRoles?`)
  - `NAV_GROUPS` sabiti — tüm menü tanımları merkezi config'e taşındı
  - `ROUTE_LABEL_MAP` — breadcrumb için route → Türkçe etiket eşlemesi (23 rota)
- [x] `src/app/layout/component/app.menu.ts` yeniden yazıldı
  - `ngOnInit()` + inline model kaldırıldı
  - `inject(AuthService)` + `computed()` signal pattern eklendi
  - `filteredModel = computed(...)` — `authService.roles()` değişince otomatik güncellenir (zoneless uyumlu)
  - Rol bazlı filtreleme: grup ve item seviyesinde `requiredRoles` desteği
- [x] `src/app/pages/dashboard/dashboard.ts` MFA karşılama sayfasına dönüştürüldü
  - Sakai demo widget'ları kaldırıldı (StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget)
  - `src/app/pages/dashboard/components/` klasörü silindi
  - `AuthService.displayName()` ile "Hoş geldiniz, {Ad Soyad}" başlığı
  - 4 adet `p-card` hızlı erişim kartı: Bileşen Kütüphanesi, Kurumsal Kimlik, CRUD Örneği, Boş Sayfa
- [x] `proxy.conf.js` oluşturuldu — `/api/**` → `process.env.API_URL || 'http://localhost:8080'` (geliştirme proxy; çalışma zamanında `window.__ENV__.API_URL` karşılığı)
- [x] `angular.json` güncellendi — `serve.options.proxyConfig: "proxy.conf.js"` eklendi
- [x] Build doğrulandı: **BAŞARILI** (21.1 sn)

### Eksik/Kırık Sayfalar Tespiti + Türkçeleştirme — 20 Mayıs 2026 (Oturum 2)

- [x] `src/app/pages/notfound/notfound.ts` — Türkçeleştirildi; lorem ipsum linkler → Ana Sayfa / Bileşen Kütüphanesi / Kurumsal Kimlik; "Go to Dashboard" → "Ana Sayfaya Dön"
- [x] `src/app/pages/empty/empty.ts` — "Empty Page" → "Boş Sayfa" Türkçeleştirildi
- [x] `src/app/pages/auth/access.ts` — Türkçeleştirildi; CDN görseli kaldırıldı → `pi pi-ban` PrimeIcon; Tailwind orange → `var(--mfa-gold)` (gradient, border, icon renkleri)
- [x] `src/app/pages/auth/error.ts` — Türkçeleştirildi; CDN görseli kaldırıldı → `pi pi-exclamation-circle` PrimeIcon; Tailwind pink → `var(--mfa-red)` (gradient, border, icon renkleri)
- [x] `src/app/pages/documentation/documentation.ts` — Sakai İngilizce demo silindi; `src/app/pages/pages.routes.ts`'ten route kaldırıldı
- [x] `src/app/pages/uikit/hierarchydemo.ts` oluşturuldu — `p-organizationchart` demosu; MFA org yapısı mock verisi (T.C. Dışişleri Bakanlığı kök); temel görünüm + seçilebilir düğüm demosu
- [x] `src/app/pages/uikit/uikit.routes.ts` güncellendi — `HierarchyDemo` import + `{ path: 'hierarchy', ... }` rotası eklendi
- [x] `src/app/core/config/navigation.config.ts` güncellendi — Sayfalar grubuna Hiyerarşi eklendi; Auth alt-grup yapısı oluşturuldu (Giriş / Erişim Engeli / Hata Sayfası); Sayfa Bulunamadı eklendi
- [x] Build doğrulandı: **BAŞARILI** (commit `8c77c05`)

---

## Alınan Kararlar

### K-001 — Kütüphane Sayfası Yaklaşımı (20 Mayıs 2026)

**Karar:** "Kütüphane sayfası" sıfırdan component library değil, yaşayan stil rehberidir.

**Gerekçe:** PrimeNG 21'in semantic token sistemi sayesinde `MfaPreset = definePreset(Aura, {...})` ile tek bir config değişikliği tüm 50+ PrimeNG bileşenini MFA kurumsal rengine çevirir. Ayrıca custom component yazmaya gerek yok. Kütüphane sayfası modül takımlarına (vize, pasaport, personel, konsolosluk) "ne var, nasıl kullanılır?" gösteren dokümantasyon ve örnek sayfasıdır.

**Etki:** Phase 5 kapsamı değişmedi; sayfa hâlâ yapılacak ama amacı netleşti.

---

### K-002 — `src/assets/` Submodule Stratejisi (20 Mayıs 2026)

**Karar:** `src/assets/` Sakai-ng'de git submodule (`cetincakiroglu/sakai-assets`) olarak yönetiliyor. Biz submodule bağımlılığını ortadan kaldırmak için dosyaları doğrudan repo'ya kopyaladık (`git archive` ile extract).

**Gerekçe:** Submodule yönetimi fork senaryosunda karmaşıklık yaratır; MFA reposunun harici bir submodule'e bağımlı olmaması gerekir.

**Etki:** `src/assets/` artık bu repo'nun parçası; upstream sync elle yapılacak (gerektiğinde).

---

### K-004 — PrimeNG Primitive Override Stratejisi (20 Mayıs 2026)

**Karar:** Bileşen başına token yazmak yerine `definePreset` içinde `primitive` bloğunu override ediyoruz: Aura'nın `sky` paletini lacivert, `orange` paletini altın, `red` paletini tehlike rengiyle eziyoruz.

**Gerekçe:** Aura tema motorunda Button/Tag/Badge/Toast/Message vb. 50+ bileşen `info` severity için `{sky.500}`, `warn` için `{orange.500}`, `danger` için `{red.500}` token'ını otomatik kullanıyor. Primitive'i bir kez override etmek, tüm bu bileşenleri hiç dokunmadan MFA renklerine çekiyor. Alternatif olan component-level token override yaklaşımı yüzlerce satır gerektirirdi.

**Etki:** `theme.config.ts` → `primitive: { sky, orange, red }` blokları. Sakai'nin Aura versiyonu değişirse token isimleri korunduğu sürece sorunsuz çalışır.

---

### K-005 — `danger` Renginin Resmi Kimlik Rehberinden Bağımsız Tanımlanması (20 Mayıs 2026)

**Karar:** Resmi "Kurum Kimliği Rehberi"nde bulunmayan `danger` rengi (`#C81D1D`) Angular template'ine eklendi. Primary kırmızıdan (`#DA291C`) daha soğuk ve koyu bir ton seçildi.

**Gerekçe:** PrimeNG'nin `danger` severity, Aura'da `red` primitive'ini kullanır. Primary (`#DA291C`) ile aynı paletin kullanılması `primary` ve `danger` butonlarının görsel olarak özdeş görünmesine neden olurdu. `danger` semantik olarak "silme, iptal, kritik hata" anlamı taşıdığından biraz farklılaşması gerekir.

**Etki:** `design-tokens.ts`'te `danger` kaydı "Angular eki" notu ile işaretlendi. `mfa-tokens.scss`'te `--mfa-danger` ve 11-adımlı `--mfa-danger-{50..950}` paleti mevcut. Resmi kimlik rehberiyle çelişmiyor; sadece framework ihtiyacını karşılıyor.

---

### K-006 — Üç Kaynaklı Renk Yönetimi (20 Mayıs 2026)

**Karar:** Renkler üç dosyada tutulur; tüm üçü manuel senkronize edilir. React referansındaki iki kaynaklı yapı (index.css + design-tokens.ts) Angular'da üçe çıktı.

| Dosya | Amaç | Değişince |
|---|---|---|
| `mfa-tokens.scss` | CSS değişkenleri (layout, SCSS) | **HEP İLK GÜNCELLENEN** |
| `theme.config.ts` | PrimeNG semantic token'ları | mfa-tokens.scss'ten eşitlenir |
| `design-tokens.ts` | Kurumsal Kimlik sayfası (görsel rehber) | mfa-tokens.scss'ten eşitlenir |

**Gerekçe:** Angular/PrimeNG'de tema token'larını TypeScript sabitlerinden otomatik üretecek bir build pipeline yoktur (React Tailwind `@theme inline` gibi). Manuel senkronizasyon kabul edilebilir çünkü renk değişikliği sık değil, dosya sayısı üç ile sınırlı.

**Kural:** Renk değişikliği SADECE `mfa-tokens.scss`'te başlar, sonra diğer ikisi güncellenir.

---

### K-007 — Bileşen Kütüphanesi Governance Kaynağı Değişikliği (20 Mayıs 2026)

**Karar:** Tek yetkili bileşen referans kaynağı, özel oluşturulan `/pages/kutuphane` yerine Sakai'nin orijinal `/uikit/*` sayfaları oldu.

**Gerekçe:** `/pages/kutuphane` (Phase 4) yaklaşık 20 bileşeni gösteriyordu ve yeni bileşen ekledikçe büyümesi gerekirdi. Sakai'nin `/uikit/*` sayfaları Phase 1'de temizlik kapsamında route'dan kaldırılmıştı ancak dosyalar diskte duruyordu; bu sayfalar zaten tüm temel PrimeNG bileşenlerini 16 kategoride kapsıyor. Restore edip MFA uyumlu hâle getirmek, sıfırdan büyütmekten çok daha az efor gerektirdi.

**Etki:** 16 `/uikit/*` sayfası MFA paletine uyarlandı (CDN bağımlılıkları kaldırıldı, renkler `--mfa-*` token'larına çevrildi, içerikler Türkçeleştirildi); `p-editor` sayfası eklendi; `/pages/kutuphane` route'dan çıkarıldı (dosya diskte, henüz silinmedi — onay bekleniyor). Governance kuralı değişmedi: modüller `/uikit/*`'te gösterilmeyen bileşeni kullanamaz; yeni bileşen önce oraya eklenir.

---

### K-008 — Auth Sayfaları MFA Palet Zorunluluğu (20 Mayıs 2026)

**Karar:** `access.ts` ve `error.ts` sayfalarındaki Sakai default renkleri (`rgba(247,149,48)`, `--p-orange-400`, `--p-pink-400`, Tailwind `border-orange-500` / `text-pink-500`) tamamen kaldırıldı; `var(--mfa-gold)` ve `var(--mfa-red)` ile değiştirildi.

**Gerekçe:** CLAUDE.md §4 — hardcoded renk yasağı; §14 — `style="color:#xxx"` ve Tailwind arbitrary renk yasağı. CDN görsellerinin yerine PrimeIcons kullanılmasıyla birlikte bu sayfalar artık offline çalışabilir, renk değişikliği tek noktadan (`mfa-tokens.scss`) yönetilebilir.

**Etki:** `access.ts` → altın (`--mfa-gold`) tonu: uyarı/erişim engeli anlamı; `error.ts` → kırmızı (`--mfa-red`) tonu: tehlike/hata anlamı. `color-mix(in srgb, <token> 40%, transparent)` ile yarı saydam gradient arka plan.

---

### K-003 — CDN Font Yasağı (20 Mayıs 2026)

**Karar:** `index.html`'deki `fonts.cdnfonts.com/css/lato` satırı kaldırılacak; font stack `Helvetica, Arial, sans-serif` olacak.

**Gerekçe:** CLAUDE.md Kural 5 — kurumsal güvenlik ve offline kullanım gereksinimi. Sakai default'u Lato kullanıyor; biz Helvetica system stack'e geçiyoruz.

**Etki:** Görsel fark minimal — Lato ile Helvetica/Arial benzer sans-serif fontlar.

---

## Oturum 3 — 20 Mayıs 2026 (devam, akşam)

### Planlama: Phase 7B — Runtime Ayar Sistemi

Kullanıcı isteği: "Bütün componentler ve sayfalar kurumsal kimlik paletinden beslenmeli. Dark mode + dil + font scale destekleri kurumsal kimlikle bağlantılı, dinamik olmalı. Palet dışı kullanım varsa görüntülenmeli. Kütüphane component'leri kod olarak görüntülenip kopyalanabilmeli. Geliştirici kütüphane dışına component ekleyemez. Responsive olmalı."

- [x] Kapsam decomposition yapıldı (9 alt-sistem: S1-S9) — bkz. spec
- [x] Brainstorming skill ile clarifying questions tamamlandı (persistence, dark stratejisi, font preset, panel UI, dil paketi, palet runtime değişimi)
- [x] Tasarım sunuldu (Bölüm A-F), onaylandı
- [x] **Spec yazıldı:** [`superpowers/specs/2026-05-20-phase-7b-runtime-settings-design.md`](superpowers/specs/2026-05-20-phase-7b-runtime-settings-design.md)
- [x] **Faz tanımları sade ve net:**
  - Phase 7B = Runtime Ayar Sistemi (S1+S2+S3-min+S4+S5)
  - Phase 7C = Tam i18n
  - Phase 8 = Palet ihlali tarayıcı + governance otomasyonu (S6+S9)
  - Phase 9 = Component kod görüntüleme/kopyalama (S7)
  - Phase 10 = Responsive audit (S8)

### Dokümentasyon Temizliği

- [x] `.reference-react/` klasörü silindi (1.5MB) — kullanıcı kararı: "ihtiyacımız kalmadı"
- [x] `docs/angular-migration-plan.md` silindi (24KB) — zaten "geçersiz, tarihsel" işaretliydi
- [x] `CLAUDE.md` baştan aşağı güncellendi:
  - React referansları (4 yer) kaldırıldı
  - §9 "Sakai Upstream Sync Stratejisi" silindi
  - §3'e i18n politikası eklendi (`ngx-translate` / `@angular/localize` yasaklı; custom + PrimeNG built-in)
  - §4'e alias token açıklaması eklendi (`--mfa-bg`, `--mfa-text`, vb.)
  - §5'e font scale açıklaması eklendi
  - §6'dan React auth referansı kaldırıldı; geliştirici modu notu eklendi
  - §8 proxy referansı `proxy.conf.json` → `proxy.conf.js`
  - §9 "Klasör Sorumluluğu" olarak yeniden adlandırıldı
  - §10 klasör yapısı `core/settings/`, `core/i18n/`, `assets/i18n/` ile güncellendi
  - §13 yasaklar listesi genişletildi (ngx-translate, doğrudan dark class, hardcoded px font-size)
  - §14 governance'a i18n key kuralı + alias token tercih kuralı eklendi
  - **YENİ §15 — Runtime Ayar Sistemi** eklendi
  - Eski §15 "Bir Şeyden Emin Değilsen" → §16'ya kaydırıldı
- [x] `docs/sakai-mfa-uyarlama-plani.md` güncellendi:
  - §0 upstream sync risk satırı güncellendi (iptal notu)
  - §4'e "4B. Yeni Yol Haritası" bölümü eklendi — Phase 7A/7B/7C/8/9/10/11
  - §5 risk tablosundan Sakai upstream satırı silindi
  - §7 "Sakai Upstream Sync Stratejisi" tamamen silindi
  - §8 → §7 ("Sonraki Adım") — aktif faz Phase 7B olarak işaretlendi

---

## Alınan Kararlar (devam)

### K-009 — LayoutService Bölünmesi (20 Mayıs 2026)

**Karar:** Sakai default'undaki `LayoutService` üç sorumluluk taşıyordu (sidebar/menu state + tema yönetimi + ölü kod). Yeniden tasarımda sorumluluk ayrımı (SRP) uygulanır:
- `LayoutService` (mevcut): SADECE sidebar/menu state (`overlayMenuActive`, `mobileMenuActive`, `staticMenuDesktopInactive`, `onMenuToggle`, `isDesktop()`). Ölü alanlar (`preset`, `primary`, `surface`, `menuMode`, `darkTheme`, `theme` computed) silinir.
- `SettingsService` (yeni, `core/settings/`): Tema, font scale, dil, persistence, View Transition.

**Gerekçe:** Kullanıcı "sade ve tek yerden yönetim; ölü kod kalmasın" istedi. Tek-servis seçeneği (tüm sorumluluklar `LayoutService`'te) SRP ihlali yaratıyor ve isim yanıltıcı oluyordu. İki servis ayrımı isim/sorumluluk netliği veriyor; aynı işi yapan iki yer YOK çünkü tema kontrolü tek bir yerde (`SettingsService`).

**Etki:** `LayoutService.toggleDarkMode` ve `darkTheme` artık çağrılmaz. `app.floatingconfigurator.ts` silinir (Phase 7B implementasyonunda). `<app-settings-drawer>` ve `/pages/ayarlar` `SettingsService` ile bağlanır.

---

### K-010 — Upstream Sync Sonlandırıldı (20 Mayıs 2026)

**Karar:** PrimeFaces `sakai-ng` ile upstream sync stratejisi terk edildi. Kod tabanı tek seferlik baseline olarak çekildi, bundan sonra MFA template'i olarak ileri gidiyor.

**Gerekçe:** Kullanıcı kararı: "upstream artık yapmayacağız. Sakai kodları çektik. Artık template'i kendimize göre değiştiriyoruz." Sakai'nin patch'lerini sıkı şekilde minimum diff'le almak, MFA özelleştirmesini (özellikle Phase 7B+ runtime ayar sistemi, palet ihlali, governance) ciddi şekilde kısıtlıyordu. Pratikte upstream sync hiç yapılmamıştı; karar resmileşmesi.

**Etki:**
- CLAUDE.md §9 başlığı "Sakai'ye Müdahale Kuralı" → "Klasör Sorumluluğu" (upstream-sync komutu silindi)
- `sakai-mfa-uyarlama-plani.md` §7 "Sakai Upstream Sync Stratejisi" silindi
- "Sakai dosyalarına minimum diff" kuralı artık merge çakışması için değil, dosya temizliği için tavsiye
- Layout/menü/topbar dosyaları MFA'ya göre özgürce refaktör edilebilir (kullanıcıya plan göstererek)

---

### K-011 — i18n 0-Paket Politikası (20 Mayıs 2026)

**Karar:** Uluslararasılaştırma için yeni paket eklenmez. Hibrit yaklaşım uygulanır:
- **PrimeNG component metinleri** (table/calendar/fileupload empty mesajları, ay/gün isimleri, vb.) için PrimeNG built-in `PrimeNG.setTranslation()` API'si (paket yok)
- **Uygulama metinleri** (menü, topbar, butonlar, sayfa içerikleri) için custom mini `TranslateService` (~50 satır) + `| t` pipe + `tr.json`/`en.json` (paket yok)
- **Angular `date`/`currency`/`number` pipe'ları** için `LOCALE_ID` runtime provider (paket yok, sınırlama: runtime değişmez)

**Gerekçe:** Kullanıcı sordu: "Dil paketi gerekiyorsa kuralım; PrimeNG'de var ve yeterliyse kalsın." Custom çözüm Phase 7B kapsamı için yeterli — sözlük yapısı `ngx-translate` ile uyumlu, ileride geçiş kolay (search-replace). Şu an paket eklemek CLAUDE.md kuralının istisna alanını açıyor; bunun bedeli faydaya değmez. `@angular/localize` build-time i18n, runtime dil değişimi yok — kabul edilemez.

**Etki:**
- `package.json` dokunulmuyor (paket eklenmiyor)
- `src/app/core/i18n/translate.service.ts` + `translate.pipe.ts` yazılır (Phase 7B implementasyon)
- CLAUDE.md §3 yasaklar listesi: `@ngx-translate/core`, `@angular/localize`
- `LOCALE_ID` runtime sınırlaması Phase 7C'de çözülür (manuel `formatDate`/`formatCurrency` sarmalama)

---

### Phase 7B — Runtime Ayar Sistemi (TAMAMLANDI — 21 Mayıs 2026)

Implementation `superpowers:subagent-driven-development` skill ile, 12 task'lık plan üzerinden yürütüldü. Her task'ta: fresh implementer subagent → spec compliance reviewer → code quality reviewer döngüsü uygulandı.

- [x] Task 1: `SettingsService` + types (signal+effect+localStorage, SSR-safe) — commit `add6d45`
- [x] Task 2: `mfa-tokens.scss` alias token'lar + `.app-dark` + `html[data-font-scale]` — commit `b179ec1`
- [x] Task 3: `theme.config.ts` `colorScheme.dark.surface` ters çevrilmiş (önceki bug fix) — commit `34c7e4c`
- [x] Task 4: `index.html` baseline + `provideEnvironmentInitializer` (ENVIRONMENT_INITIALIZER yerine Angular 19+ idiom) — commit `60b1562`
- [x] Task 5: `TranslateService` + `\| t` pipe + `tr.json`/`en.json` (63 key) — commit `2514c88`
- [x] Task 6: `LOCALE_ID` runtime factory + `registerLocaleData(tr, en)` — commit `1f324b6`
- [x] Task 7: `navigation.config.ts` `label` → `labelKey` migration + Ayarlar menü öğesi — commit `c773fed`
- [x] Task 8: `app.menu.ts` runtime `t()` render — commit `7ebffa2`
- [x] Task 9: `AppSettingsForm` paylaşılan component — commit `f8a10ac`
- [x] Task 10: `/pages/ayarlar` tam sayfa + route — commit `9657211`
- [x] Task 11: Topbar drawer + cog button + `AppFloatingConfigurator` silindi (login/access/error/notfound temizliği dahil, atomic commit) — commit `a05af68`
- [x] Task 12: `LayoutService` refactor (sadece menu state) + alias/cleanup + final build — commit `cb42b17`
- [x] Production build: BAŞARILI
- [x] Tüm subagent review döngüleri APPROVED

### Phase 7B — Kullanıcı Kabul Sonrası Düzeltmeler (21 Mayıs 2026)

Browser smoke test sonrası 7 bug, 3 atomic commit ile çözüldü:

- [x] **Fix 1 (commit `e238b17`):** JSON 404 + drawer iptal + light/dark only
  - `src/assets/i18n/*.json` → `public/i18n/*.json` (`angular.json` assets glob sadece `public/` kapsıyordu, src/assets bundle'a girmiyordu)
  - `TranslateService.load()` fetch path `/i18n/${lang}.json`
  - `ThemeMode = 'light' | 'dark'` (system kaldırıldı), default `'light'`
  - `_systemPrefersDark` ve matchMedia listener silindi, `resolveDark()` sadeleşti
  - Topbar drawer + `AppSettingsForm` import kaldırıldı (drawer içinde tıklama drawer'ı kapatıyordu)
- [x] **Fix 2 (commit `032db68`):** Topbar icon group + tooltip i18n
  - Drawer → 3'lü icon group (tek border'lı container, dikey divider)
  - Dil: `pi-language` + TR/EN kodu, tek tıkla toggle (kocaman `<p-select>` kaldırıldı)
  - Font: HTML `Aa` metafor (`pi-text-height` PrimeIcons 7'de gözükmüyordu), tıkla → `<p-popover>` XS-XL
  - Tema: `pi-sun`/`pi-moon` toggle, group içine alındı
  - Tooltip text'leri `computed()` signal'a bağlandı (`pTooltip` directive `| t` pipe değişimini algılamıyordu)
  - CSS scoped component styles, `--mfa-*` alias token'lar (dark mode uyumlu)
- [x] **Fix 3 (commit `8324e3d`):** Dark mode görsel değişim — Task 3 invert revert
  - **Kök neden:** Task 3'te `colorScheme.dark.surface` invert (`0:#0d0e10 ... 950:#ffffff`) Sakai pattern'iyle uyumsuzdu. Sayfalar `bg-surface-50 dark:bg-surface-950` derken `--p-surface-950` invert ile `#ffffff` döndürüyor → dark mode'da BEYAZ zemin
  - **Çözüm:** Dark surface = Light surface (aynı değerler). Aura konvansiyonu surface scale'i tema-bağımsız tutar; `dark:bg-surface-950` light'taki index'ten dark zemin değeri okur
  - Aura'nın kendi `content`/`text`/`mute` semantic token'ları tema-bağımlı dark variant'ı uygular
- [x] **Format commit `3eb53e1`:** Prettier multi-line → single-line (semantik değişiklik yok)
- [x] **Push:** 15 commit `origin/main`'e push edildi (`add6d45..3eb53e1`)

### Kullanıcı Kabul Testi — PASS (21 Mayıs 2026)

Browser smoke test maddeleri geçildi:
- ✅ Translation çalışıyor (menu.home → "Ana Sayfa" / "Home")
- ✅ Dark mode görsel değişim (commit `8324e3d` sonrası)
- ✅ Header icon group düzgün (dil + font + tema)
- ✅ Tooltip dil desteği (TR/EN switch'inde tooltip değişiyor)
- ✅ Font scale popover + XS-XL seçimleri
- ✅ Persistence (localStorage `mfa.settings.v1`)
- ✅ Responsive (mobile 375px viewport)
- ✅ Reset "Varsayılana Dön" çalışıyor

Bilinen sınırlama (Phase 7C'ye taşındı): `LOCALE_ID` runtime'da değişmez — `date`/`currency` pipe'ları dil değişince güncellenmez (sayfa reload gerekir).

---

## Oturum 4 — 22 Mayıs 2026

### Phase 7C — Template-Düzeyi i18n + Foundation Pipe'lar (Tamamlandı)

**Bağlam değişikliği:** Phase 7C'nin orijinal kapsamı "tüm sayfalar TR/EN çevrilsin" şeklindeydi. Bu oturumda kullanıcı sorusuyla yapısal sadeleştirme yapıldı (bkz. K-012): template demo sayfaları (/uikit/*, kurumsal kimlik, CRUD) çevrilmez; sadece modüllerin shipping yapacağı template chrome ve foundation altyapı çevrilir.

- [x] **7C-1 — Foundation pipe'lar**
  - `src/app/core/i18n/mfa-date.pipe.ts` — `pure: false`, `SettingsService.language()` signal'ı her transform'da okur, Angular `formatDate` sarmalar
  - `src/app/core/i18n/mfa-currency.pipe.ts` — aynı pattern, `formatCurrency` + `getCurrencySymbol` sarmalar (ISO 4217 currency code, display modu, digitsInfo)
  - `LOCALE_ID` runtime sınırlaması artık modüller için sorun değil — bu pipe'lar tek satır API'yi kapatır
- [x] **7C-2 — Auth sayfaları + notfound**
  - `auth/login.ts` — 8 key (`auth.login.title/subtitle/sso.description/sso.button/dev.badge/dev.note/dev.placeholder/dev.button`); `devName` signal başlangıç değeri `''`, `onDevLogin` boşsa Türkçe fallback
  - `auth/access.ts` — 2 key (`auth.access.title/description`) + `common.home`
  - `auth/error.ts` — 2 key (`auth.error.title/description`) + `common.home`
  - `notfound/notfound.ts` — `notfound.title/description` + 3 link açıklaması (`.link.home.description/library.description/corporate.description`); link başlıkları mevcut `menu.home/menu.library/menu.pages.corporate-identity` key'lerini reuse eder
- [x] **7C-3 — Empty + Dashboard**
  - `empty/empty.ts` — `empty.title/description`
  - `dashboard/dashboard.ts` — `QuickLink` interface'i yeniden yapılandırıldı (`label/description` → `labelKey/descriptionKey`); 4 kart açıklaması + "İncele" buton metni + karşılama (parametreli `dashboard.welcome.title.named: "Hoş geldiniz, {name}"`)
- [x] **7C-4 — Sözlük denetimi**
  - `public/i18n/tr.json` + `en.json` — toplam 30+ yeni key eklendi; `settings.theme.system` ölü key'i temizlendi (Phase 7B Fix 1'de `ThemeMode = 'light' | 'dark'` olmuştu)
- [x] **7C-5 — Modül rehberi**
  - `docs/i18n-rehber.md` — modül takımları için namespace pattern'i, pipe kullanımı, programatik çeviri, doğrulama checklist'i, yasaklar
  - `CLAUDE.md` §16'ya rehber referansı eklendi
- [x] **7C-3.5 — Build doğrulaması:** `npx ng build --configuration development` — BAŞARILI (24.2 sn, 1 minor uyarı çözüldü: `displayName() ?? ''` → `displayName()`)

### Alınan Kararlar

#### K-012 — Phase 7C Kapsam Daraltma (22 Mayıs 2026)

**Karar:** Phase 7C'nin orijinal "tüm sayfaları çevir" kapsamı reddedildi. Sadece **modüllerin shipping yapacağı template chrome** çevrildi: auth shell (login/access/error/notfound), empty, dashboard, settings drawer (Phase 7B'de zaten çevrildi). Demo/iç dokümantasyon sayfaları (`/uikit/*` 16 sayfa, `/pages/kurumsal-kimlik`, `/pages/crud` örnek veri) TR olarak bırakıldı.

**Gerekçe:** Bu repo bir **template**. Modül takımları (vize, pasaport, personel, konsolosluk) fork'layıp kendi modüllerini geliştirecek; `/uikit/*` onlar için **referans**, `/pages/kurumsal-kimlik` **iç dokümantasyon**, `/pages/crud` **örnek**. Hiçbiri son kullanıcıya shipping yapılmaz. Bu sayfaların çevirisi 200+ key ekler, sözlük şişer, modüllerin lazy-load gerekliliğini öne çeker; faydası şüpheli.

**Etki:**
- Phase 7C ~6 task'ta bitti (orijinal plan ~16 task)
- Modül takımları artık `docs/i18n-rehber.md` üzerinden kendi namespace'lerinde key ekleyebilir
- Phase 8+ scope'u hızlandı (Phase 8: palet ihlali tarayıcı + governance otomasyonu)

#### K-013 — Foundation Pipe Yaklaşımı (22 Mayıs 2026)

**Karar:** `LOCALE_ID` runtime sınırlamasını çözmek için Angular built-in `formatDate`/`formatCurrency` fonksiyonlarını saran `MfaDatePipe`/`MfaCurrencyPipe` yazıldı (`pure: false`, signal okur).

**Gerekçe:** Phase 7B'de `LOCALE_ID` factory provider eklendi ama Angular factory'i bir kez okuyor. Üç alternatif değerlendirildi:
1. Angular'ın yeni `signal-aware pipe` API'sini beklemek — v22 stable'da olabilir, şu an yok
2. `provideAppInitializer` ile dil değişince app restart — UX kötü
3. **Seçilen:** Custom pipe + `pure: false` + `SettingsService.language()` signal okuma — dil signal'ı değişince Angular zaten change detection yapar; pipe transform tekrar çağırılır; yeni locale ile re-format

**Etki:**
- Modüller `| date`/`| currency` yerine `| mfaDate`/`| mfaCurrency` kullanır
- `docs/i18n-rehber.md` §4'te kural belirtildi
- Mevcut `/uikit/*` demo'larındaki `| currency` ve `| date` çağrıları template-only kaldığı için dokunulmadı

---

## Sırada — Sonraki Oturum

**Tamamlanan:** Phase 7B (Runtime Ayar Sistemi) + Phase 7C (Template i18n + Foundation Pipe'lar)

**Aktif aday:** Phase 8 — Palet İhlali Tarayıcı + Governance Otomasyonu

Phase 8 scope (`sakai-mfa-uyarlama-plani.md` §4B):
- Hardcoded hex / Tailwind sabit renk sınıfı tarayıcı script (`scripts/check-palette.js`)
- npm `lint:palette` komutu, CI/pre-commit hook'u (opsiyonel)
- `/uikit/*`'te olmayan PrimeNG component kullanımı tarama
- Governance kuralları test edilebilir hâle getirme (CLAUDE.md §14'ün enforcement'ı)

**Alternatif sıralama:**
- Phase 9 — Component kod görüntüleme/kopyalama (`/uikit/*` "Kodu Göster" toggle)
- Phase 10 — Responsive audit (mobile-first denetim, tablet breakpoint testleri)
- Phase 11 — İlk modül iskeleti (örnek `features/vize/`)

**Git durumu:** Phase 7C commit edilecek (~12 dosya). `main` branch.
