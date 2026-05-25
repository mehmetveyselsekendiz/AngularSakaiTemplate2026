# Yeni Claude Code Oturumu — Açılış Prompt'u

Bu dosya, **`AngularSakaiTemplate2026`** dizininde **yeni bir Claude Code oturumu** başlattığında ilk mesaj olarak göndereceğin prompt'u içerir.

> **Son güncelleme:** 26 Mayıs 2026 — Phase 1–10 tamamlandı ve push edildi. **Aktif faz: Phase 11 — İlk modül iskeleti (`features/vize/`) + modül fork rehberi + OpenShift Docker + README.**

## Kullanım Adımları

1. PowerShell veya Terminal aç
2. `cd C:\Projects\AngularSakaiTemplate2026`
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

Phase 1–10 tamamlandı ve push edildi. Aktif faz: **Phase 11 — İlk modül
iskeleti (features/vize/) + modül fork rehberi + OpenShift Docker + README**.
Sıfırdan başlama; kurulum/önceki fazları tekrar yapma.

>>> BU OTURUMDA ÖNCE ŞUNLARI OKU:
>>>   1. CLAUDE.md (otomatik yüklenir) — kurallar, sıfır-paket, klasör sorumluluğu (§9-10)
>>>   2. docs/ilerleme-ve-kararlar.md — en alttaki "Sırada — Sonraki Oturum"
>>>   3. docs/sakai-mfa-uyarlama-plani.md §4B (Phase 11) + §10 klasör yapısı
>>> Phase 11'in spec/plan'ı HENÜZ YOK — önce kapsamı netleştir, plan çıkar, BANA sun, onay al.

Oturumu anlamak için sırasıyla şunları oku:

1. CLAUDE.md — kritik kurallar ve yasaklar (otomatik yüklenir)
2. docs/ilerleme-ve-kararlar.md — tamamlanan TÜM adımlar + kararlar
   (en alttaki "Sırada — Sonraki Oturum" bölümünden başla)
3. docs/sakai-mfa-uyarlama-plani.md §4B — Yol haritası (Phase 7A-11)
4. docs/i18n-rehber.md — modül takımları için i18n rehberi (modül kodu bunu kullanır)

Faz özeti:
- Phase 1–6 ✓ Sakai temizliği, MFA tema, kurumsal kimlik, OIDC auth, uikit MFA uyumu
- Phase 7A ✓ navigation.config.ts, menü computed() signal, palet ihlal temizliği
- Phase 7B ✓ Runtime Ayar Sistemi (SettingsService + tema/font/dil + topbar)
- Phase 7C ✓ Template i18n + mfaDate/mfaCurrency pipe'lar + docs/i18n-rehber.md
             (K-012: /uikit/*, kurumsal-kimlik, crud template-only)
- Phase 8  ✓ Palet İhlali Tarayıcı (check-palette.mjs + lint:palette) +
             /pages/kurumsal-kimlik/denetim sayfası (K-014, K-015)
- Phase 9  ✓ Bileşen Vitrini (ComponentShowcase: kart + p-tabs Önizleme/Kod) +
             14 eksik PrimeNG bileşeni + "Kurumsal Desenler" sayfası
             (/uikit/patterns) — 125 snippet, 18 uikit sayfası (K-016, K-017, K-018)
- Phase 10 ✓ Responsive Audit — 320px'te 24/24 sayfa yatay taşmasız;
             chrome/navigasyon dokunma hedefleri 44px (K-019, K-020).
             Reflow stratejisi: geniş içerik kart-içi overflow-x:auto.
- Phase 11 ▶ İlk modül iskeleti (features/vize/) + modül fork rehberi +
             OpenShift Docker + README. ÖNCE plan çıkar, sun, onay al.

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
| `scripts/check-palette.mjs` | Governance tarayıcı (Phase 8) — `npm run lint:palette` |
| `src/app/core/util/svg-placeholder.ts` | CDN görsel yerine data:URI üretici (Phase 8) |
| `src/app/pages/kurumsal-kimlik/denetim.ts` | Runtime palet denetim sayfası (Phase 8) |
| `scripts/extract-snippets.mjs` | Snippet üretici (Phase 9) — `npm run snippets` |
| `src/app/pages/uikit/code-block.ts` | "Kodu Göster/Kopyala" component (Phase 9) |
| `src/app/pages/uikit/snippet.service.ts` | Snippet JSON yükleyici (Phase 9) |
| `docs/superpowers/specs/2026-05-25-phase-9-component-library-design.md` | **Phase 9 (Yeniden) TASARIM — önce bunu oku** |
| `docs/superpowers/plans/2026-05-25-phase-9-component-library.md` | **Phase 9 (Yeniden) GÖREV PLANI — 9A→9D** |
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

Not: Phase 1-10 tamamlandı, Phase 11 sırada.
Detay için docs/ilerleme-ve-kararlar.md'nin son bölümünü oku.
--- OTURUM BAĞLAMI SONU ---
```

---

## Hatırlatmalar

- `git push` her zaman kullanıcı onayıyla.
- Üretim build doğrulamadan commit atma (`npx ng build`).
- Phase 8 tamamlandı: `npm run lint:palette` governance gate (HEX/TAILWIND/CDN/IMPORT,
  ihlalde exit 1). Yeni component yazarken kullan; CDN görsel yerine
  `src/app/core/util/svg-placeholder.ts`.
- Phase 9 YENİDEN tasarlandı (K-017): `ComponentShowcase` (kart + `p-tabs`
  Önizleme/Kod) + HER örnek + eksik PrimeNG bileşenleri + "Kurumsal Desenler" sayfası.
  9.0 altyapısı (extractor/SnippetService/CodeBlock) korunur. ÖNCE spec+plan oku:
  docs/superpowers/specs+plans/2026-05-25-phase-9-component-library*.
- Yeni uikit örneği = `<app-showcase>` + `<!-- snippet:ID -->` + `snippet()` + `npm run snippets`.
- Skill/subagent serbest (ecc:angular-developer, gap analizi için subagent) — ama
  SIFIR PAKET kuralı geçerli (CLAUDE.md §3), dependency eklenmez.
