# Yeni Claude Code Oturumu — Açılış Prompt'u

Bu dosya, **`AngularSakaiTemplate2026`** dizininde **yeni bir Claude Code oturumu** başlattığında ilk mesaj olarak göndereceğin prompt'u içerir.

> **Son güncelleme:** 20 Mayıs 2026 — Phase 1–6 tamamlandı, Phase 7 devam ediyor.

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

Phase 1–6 tamamlandı, Phase 7 devam ediyor. Sıfırdan başlama; kurulum
adımlarını tekrar yapma.

Oturumu anlamak için sırasıyla şunları oku:

1. CLAUDE.md — kritik kurallar ve yasaklar (zaten otomatik yükleniyor)
2. docs/ilerleme-ve-kararlar.md — tamamlanan TÜM adımlar, alınan kararlar
3. docs/sakai-mfa-uyarlama-plani.md — genel yol haritası

Özet:
- Phase 1 ✓  Sakai demo temizliği (CDN font, landing, demo servisler)
- Phase 2 ✓  MFA tema entegrasyonu (mfa-tokens.scss, MfaPreset, theme.config.ts)
- Phase 3 ✓  Kurumsal Kimlik sayfası (/pages/kurumsal-kimlik)
- Phase 4 ✓  Bileşen Kütüphanesi (/uikit/* restore, governance kuralı)
- Phase 5 ✓  Manuel OIDC Auth (PKCE, AuthService, authGuard, interceptors)
- Phase 6 ✓  uikit sayfaları MFA uyumlu (CDN kaldırıldı, MFA token, Türkçe)
- Phase 7 ▶  navigation.config.ts, menü computed() signal, auth alt-grup ✓
             Devam eden: palet ihlalleri temizliği (CDN görseller + hardcoded
             renkler — miscdemo, timelinedemo, tabledemo, crud, mediademo)

---

## STACK — KESİN (Sakai'den miras)

- Angular 21 stable (^21) — Sakai upstream'iyle aynı
- TypeScript ~5.9.3
- PrimeNG 21.x Aura (^21.0.2) + @primeuix/themes ^2.0.0
- primeicons ^7.0.0
- Tailwind v4 (^4.1.11) + @tailwindcss/postcss + tailwindcss-primeui
- quill ^2.0.3 (PrimeNG <p-editor> peer dep)
- chart.js 4.4.2 (PrimeNG <p-chart> peer dep)
- Zoneless change detection (provideZonelessChangeDetection) — Zone.js YOK
- Standalone components — @NgModule YOK
- SCSS

Angular 22 stable çıkıp Sakai geçince biz de geçeriz (Signal Forms o zaman).

---

## TEMEL FELSEFE — MİNİMUM BAĞIMLILIK

"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?" — evet ise paket EKLENMEZ.

- Form / Validasyon  → Reactive Forms + Angular Validators (built-in)
- HTTP / Server state → HttpClient + httpResource() (built-in)
- Client state       → Angular Signals
- Tablo / Grafik     → PrimeNG <p-table> / <p-chart>
- Toast / Dialog     → PrimeNG MessageService / <p-dialog>
- İkon              → PrimeIcons (Lucide/Font Awesome YOK)
- Auth              → Manuel OIDC — Keycloak lib / angular-oauth2-oidc YOK

Kabul edilen external paketler (yalnızca Sakai'de var olanlar):
primeng, @primeuix/themes, primeicons, quill, chart.js,
tailwindcss, @tailwindcss/postcss, tailwindcss-primeui

---

## MFA PALETİ — TEK KAYNAK

src/assets/mfa-tokens.scss → CSS değişkenleri.
Component'lerde hardcoded hex, Tailwind sabit renk sınıfı YASAK.

Tokenlar: --mfa-red, --mfa-gold, --mfa-gray, --mfa-navy, --mfa-navy-dark
+ 11-adımlı paletler (--mfa-red-{50..950}, --mfa-surface-{0..950}, vs.)

PrimeNG bağlama: src/app/core/config/theme.config.ts → MfaPreset

---

## AUTH — MANUEL OIDC (HAZIR)

src/app/core/auth/ altında tam PKCE akışı mevcut. Dokunma.
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
| `docs/sakai-mfa-uyarlama-plani.md` | Genel yol haritası |
| `src/assets/mfa-tokens.scss` | MFA renk token'ları — TEK PALET KAYNAĞI |
| `src/app/core/config/theme.config.ts` | PrimeNG MfaPreset tanımı |
| `src/app/core/config/navigation.config.ts` | Menü yapısı + breadcrumb map |
| `src/app/core/auth/` | OIDC auth altyapısı (5 dosya) |
| `public/config.js` | Runtime env config (window.__ENV__) şablonu |
| `.reference-react/` | Eski React template (gitignore'lu, referans) |

---

## Yeni Oturum İçin Ek Not

Eğer bu oturuma **yeni bir özellik isteğiyle** başlıyorsan, promptun başına
şu bağlam bloğunu ekle:

```
--- OTURUM BAĞLAMI ---
[isteğini buraya yaz]

Not: Phase 1-6 tamamlandı, Phase 7 devam ediyor.
Detay için docs/ilerleme-ve-kararlar.md'yi oku.
--- OTURUM BAĞLAMI SONU ---
```

---

## Hatırlatmalar

- Sakai upstream sync: `git remote add upstream https://github.com/primefaces/sakai-ng.git`
- Bu repo'yu GitHub'a push etmeden önce uzak repo URL'sini ekle.
- `.reference-react/` gitignore'lu — commitleme, sadece lokal referans.
