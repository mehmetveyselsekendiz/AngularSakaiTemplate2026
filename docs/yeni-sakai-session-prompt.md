# Yeni Claude Code Oturumu — Açılış Prompt'u

Bu dosya, **`AngularSakaiTemplate2026`** dizininde **yeni bir Claude Code oturumu** başlattığında ilk mesaj olarak göndereceğin prompt'u içerir.

> **Son güncelleme:** 22 Mayıs 2026 — Phase 1–7C tamamlandı, Phase 8 sırada.

## Kullanım Adımları

1. PowerShell veya Terminal aç
2. `cd C:\Users\t1.veysel.sekendiz\Desktop\AngularSakaiTemplate2026`
3. Bu dizinde Claude Code oturumu aç (`claude`)
4. Aşağıdaki **"PROMPT — BURADAN KOPYALA"** bölümündeki metni komple kopyala ve ilk mesaj olarak yapıştır

---

## PROMPT — BURADAN KOPYALA

```
Merhaba. Bu repo T.C. Dışişleri Bakanlığı için Angular kurumsal frontend
template'i. Tüm MFA modül takımları (vize, pasaport, personel, konsolosluk)
bu template'i fork'layıp kendi modüllerini geliştirecek.

---

## MEVCUT DURUM — ÖNCE BUNU OKU

Phase 1–7C tamamlandı, Phase 8 sırada. Sıfırdan başlama; kurulum
adımlarını tekrar yapma.

Oturumu anlamak için sırasıyla şunları oku:

1. CLAUDE.md — kritik kurallar ve yasaklar (otomatik yüklenir)
2. docs/ilerleme-ve-kararlar.md — tamamlanan TÜM adımlar + kararlar
   (en alttaki "Sırada — Sonraki Oturum" bölümünden başla)
3. docs/sakai-mfa-uyarlama-plani.md §4B — Yeni yol haritası (Phase 7A-11)
4. docs/i18n-rehber.md — modül takımları için i18n rehberi (Phase 7C ekledi)

Faz özeti:
- Phase 1  ✓  Sakai demo temizliği (CDN font, landing, demo servisler)
- Phase 2  ✓  MFA tema (mfa-tokens.scss, MfaPreset, theme.config.ts)
- Phase 3  ✓  Kurumsal Kimlik sayfası (/pages/kurumsal-kimlik)
- Phase 4  ✓  Bileşen Kütüphanesi governance (/uikit/* tek yetkili kaynak)
- Phase 5  ✓  Manuel OIDC Auth (PKCE, AuthService, guard, interceptor)
- Phase 6  ✓  uikit sayfaları MFA uyumlu (CDN kaldırıldı, MFA token, Türkçe)
- Phase 7A ✓  navigation.config.ts, menü computed() signal, auth alt-grup,
              eksik sayfa tespiti, palet ihlal temizliği
- Phase 7B ✓  Runtime Ayar Sistemi (SettingsService + tema/font/dil +
              localStorage + topbar icon group + /pages/ayarlar)
- Phase 7C ✓  Template-düzeyi i18n (auth/empty/dashboard) + foundation
              pipe'lar (mfaDate/mfaCurrency, runtime locale) + modül
              rehberi (docs/i18n-rehber.md). K-012 ile kapsam daraltıldı:
              /uikit/*, kurumsal-kimlik, crud template-only kabul edildi.
- Phase 8  ▶  Palet İhlali Tarayıcı + Governance Otomasyonu

---

## PHASE 7B + 7C ÖZETİ

Çalışan özellikler (7B):
- Topbar'da 3'lü icon group: [🌐 TR/EN] [Aa font] [🌙/☀️ tema]
- /pages/ayarlar tam sayfa (drawer YOK, paylaşılan AppSettingsForm)
- Light/dark theme toggle (system kaldırıldı, default light)
- Font scale 5 preset (XS/S/M/L/XL) — kök html font-size
- TR/EN dil değişimi (PrimeNG + uygulama metinleri)
- localStorage persistence (mfa.settings.v1)
- Tüm runtime kontrol SettingsService (core/settings/) üzerinden
- LayoutService sadece sidebar/menu state

Yeni (7C):
- auth/login, access, error, notfound, empty, dashboard → tamamen i18n
- MfaDatePipe / MfaCurrencyPipe (src/app/core/i18n/) — pure:false + signal
  okur → kullanıcı dil değiştirince sayfa reload OLMADAN re-format eder
  (LOCALE_ID runtime sınırlaması K-013 ile çözüldü)
- /uikit/*, /pages/kurumsal-kimlik, /pages/crud demo'ları TR'de bırakıldı
  (K-012: template-only sayfalar shipping yapılmaz)
- docs/i18n-rehber.md — modül takımları için namespace + pipe pattern'i

Modüller artık `| date` / `| currency` yerine `| mfaDate` / `| mfaCurrency`
kullanmalı. Rehber: docs/i18n-rehber.md.

---

## STACK — KESİN

- Angular 21 stable (^21)
- TypeScript ~5.9.3
- PrimeNG 21.x Aura (^21.0.2) + @primeuix/themes ^2.0.0
- primeicons ^7.0.0
- Tailwind v4 (^4.1.11) + @tailwindcss/postcss + tailwindcss-primeui
- quill ^2.0.3 (PrimeNG <p-editor> peer dep)
- chart.js 4.4.2 (PrimeNG <p-chart> peer dep)
- Zoneless change detection — Zone.js YOK
- Standalone components — @NgModule YOK
- SCSS

Angular 22 stable çıktığında planlı migration (Signal Forms o zaman).
Upstream sync iptal (K-010): Sakai-ng artık baseline değil, MFA template'i.

---

## TEMEL FELSEFE — MİNİMUM BAĞIMLILIK

"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?" — evet ise paket EKLENMEZ.

- Form / Validasyon  → Reactive Forms + Angular Validators (built-in)
- HTTP / Server state → HttpClient + httpResource() (built-in)
- Client state       → Angular Signals
- Tablo / Grafik     → PrimeNG <p-table> / <p-chart>
- Toast / Dialog     → PrimeNG MessageService / <p-dialog>
- İkon              → PrimeIcons (Lucide / Font Awesome YOK)
- Auth              → Manuel OIDC (Keycloak lib / oauth2-oidc YOK)
- i18n              → Custom TranslateService + PrimeNG setTranslation()
                      (ngx-translate / @angular/localize YOK)
- Theme             → MFA SettingsService (next-themes benzeri YOK)

Kabul edilen external paketler:
primeng, @primeuix/themes, primeicons, quill, chart.js,
tailwindcss, @tailwindcss/postcss, tailwindcss-primeui

---

## MFA PALETİ — TEK KAYNAK

src/assets/mfa-tokens.scss → CSS değişkenleri.
Component'lerde hardcoded hex, Tailwind sabit renk sınıfı YASAK.

Base tokenlar: --mfa-red, --mfa-gold, --mfa-gray, --mfa-navy, --mfa-navy-dark
+ 11-adımlı paletler (--mfa-red-{50..950}, --mfa-surface-{0..950}, vs.)

Alias tokenlar (Phase 7B+, dark mode otomatik):
--mfa-bg, --mfa-bg-elevated, --mfa-bg-muted,
--mfa-text, --mfa-text-muted, --mfa-border, --mfa-brand, --mfa-brand-fg

Yeni component'lerde alias tercih edilir. Sakai default sayfalar
`bg-surface-X dark:bg-surface-Y` pattern'i kullanır (Aura semantic uyumlu).

PrimeNG bağlama: src/app/core/config/theme.config.ts → MfaPreset

---

## RUNTIME AYAR SİSTEMİ (Phase 7B)

Tek kaynak: src/app/core/settings/settings.service.ts
- themeMode: 'light' | 'dark'
- fontScale: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- language: 'tr' | 'en'
- localStorage key: 'mfa.settings.v1'

i18n altyapı:
- src/app/core/i18n/translate.service.ts
- src/app/core/i18n/translate.pipe.ts (| t pipe, pure:false)
- src/app/core/i18n/mfa-date.pipe.ts (| mfaDate, runtime locale)
- src/app/core/i18n/mfa-currency.pipe.ts (| mfaCurrency, runtime locale)
- public/i18n/tr.json + en.json (~95 key, eager-load)
- navigation.config.ts → labelKey ile çevrilir
- docs/i18n-rehber.md → modül takımları rehberi

---

## AUTH — MANUEL OIDC (HAZIR, DOKUNMA)

src/app/core/auth/ — tam PKCE akışı mevcut.
Geliştirme girişi: /auth/login → "GELİŞTİRİCİ MODU" (SSO_URL boşken görünür).
SSO config: window.__ENV__ (public/config.js şablonu).

---

## ÇALIŞMA TARZI

- Türkçe konuş.
- Yeni terim ilk kullanımda 1 cümlelik açıklama ver.
- Kod yazmadan önce ne yapacağını kısaca söyle.
- Büyük komutlardan önce onay al (npm install, build, start, dosya silme).
- Hata aldığında önce göster, sonra çöz.
- Her phase sonunda commit at, ben söylemeden PUSH ETME.
- docs/ilerleme-ve-kararlar.md'yi her önemli adımdan sonra güncelle.

---

## İLK YAPILACAKLAR

1. docs/ilerleme-ve-kararlar.md'yi oku — mevcut durumu anla.
2. Kısa özet ver: hangi phase, ne tamamlandı, sırada ne var.
3. Sonra bu oturumun isteğini ele al.

Hazırsan başla.
```

---

## Bu Prompt'u Yapıştırdıktan Sonra Ne Olur?

Yeni Claude sırasıyla şunları yapacak:

1. **CLAUDE.md'yi otomatik okur** — kuralları bilir
2. **`docs/ilerleme-ve-kararlar.md`'yi okur** — tam mevcut durumu anlar
3. **Kısa özet verir** — hangi phase, ne tamamlandı, sırada ne var
4. **Senin isteğine odaklanır** — Phase 0 kurulum adımlarını tekrar yapmaz

---

## Önemli Dosya Haritası

| Dosya | Ne İşe Yarar |
|---|---|
| `CLAUDE.md` | Kritik kurallar — her oturumda otomatik yüklenir |
| `docs/ilerleme-ve-kararlar.md` | Tamamlanan adımlar + kararlar — **KAYNAK BUDUR** |
| `docs/sakai-mfa-uyarlama-plani.md` | Genel yol haritası (§4B Phase 7A-11) |
| `docs/superpowers/specs/2026-05-20-phase-7b-runtime-settings-design.md` | Phase 7B tasarım (referans) |
| `docs/superpowers/plans/2026-05-20-phase-7b-runtime-settings.md` | Phase 7B 12-task plan (referans, implementasyon bitti) |
| `src/assets/mfa-tokens.scss` | MFA renk + alias + .app-dark — TEK PALET KAYNAĞI |
| `src/app/core/config/theme.config.ts` | PrimeNG MfaPreset tanımı |
| `src/app/core/config/navigation.config.ts` | Menü yapısı (labelKey) + breadcrumb map |
| `src/app/core/settings/` | SettingsService + types (Phase 7B) |
| `src/app/core/i18n/` | TranslateService + pipe (Phase 7B) |
| `src/app/core/auth/` | OIDC auth altyapısı (5 dosya) |
| `src/app/layout/component/app.topbar.ts` | Header icon group (dil/font/tema) |
| `src/app/layout/component/app.settings-form.ts` | Paylaşılan ayar formu |
| `src/app/pages/ayarlar/ayarlar.ts` | /pages/ayarlar tam sayfa |
| `public/config.js` | Runtime env (window.__ENV__) şablonu |
| `public/i18n/tr.json`, `en.json` | i18n sözlükleri |

---

## Yeni Oturum İçin Ek Not

Eğer bu oturuma **yeni bir özellik isteğiyle** başlıyorsan, promptun başına
şu bağlam bloğunu ekle:

```
--- OTURUM BAĞLAMI ---
[isteğini buraya yaz]

Not: Phase 1-7B tamamlandı, Phase 7C sırada.
Detay için docs/ilerleme-ve-kararlar.md'nin son bölümünü oku.
--- OTURUM BAĞLAMI SONU ---
```

---

## Hatırlatmalar

- `git push` her zaman kullanıcı onayıyla.
- Üretim build doğrulamadan commit atma (`npx ng build`).
- Phase 7C tamamlandı: `MfaDatePipe` / `MfaCurrencyPipe` modüllere foundation.
- Phase 8 başlamadan önce `docs/sakai-mfa-uyarlama-plani.md` §4B Phase 8
  maddesini oku (palet ihlali tarayıcı + governance otomasyonu).
