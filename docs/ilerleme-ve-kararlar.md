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

### K-003 — CDN Font Yasağı (20 Mayıs 2026)

**Karar:** `index.html`'deki `fonts.cdnfonts.com/css/lato` satırı kaldırılacak; font stack `Helvetica, Arial, sans-serif` olacak.

**Gerekçe:** CLAUDE.md Kural 5 — kurumsal güvenlik ve offline kullanım gereksinimi. Sakai default'u Lato kullanıyor; biz Helvetica system stack'e geçiyoruz.

**Etki:** Görsel fark minimal — Lato ile Helvetica/Arial benzer sans-serif fontlar.
