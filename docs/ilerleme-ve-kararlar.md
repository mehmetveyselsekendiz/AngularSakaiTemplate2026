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

### K-003 — CDN Font Yasağı (20 Mayıs 2026)

**Karar:** `index.html`'deki `fonts.cdnfonts.com/css/lato` satırı kaldırılacak; font stack `Helvetica, Arial, sans-serif` olacak.

**Gerekçe:** CLAUDE.md Kural 5 — kurumsal güvenlik ve offline kullanım gereksinimi. Sakai default'u Lato kullanıyor; biz Helvetica system stack'e geçiyoruz.

**Etki:** Görsel fark minimal — Lato ile Helvetica/Arial benzer sans-serif fontlar.
