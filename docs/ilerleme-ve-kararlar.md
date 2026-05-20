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

### Bekleyen Adımlar (Bu Oturum)

- [ ] `src/index.html` — CDN font (Lato) ve dış favicon satırları kaldırılacak
- [ ] `npm run start` → build başarılı mı doğrulanacak
- [ ] Phase 0 commit: `chore: initial sakai-ng baseline + docs`
- [ ] Phase 1'e geçiş için onay istenecek

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

### K-003 — CDN Font Yasağı (20 Mayıs 2026)

**Karar:** `index.html`'deki `fonts.cdnfonts.com/css/lato` satırı kaldırılacak; font stack `Helvetica, Arial, sans-serif` olacak.

**Gerekçe:** CLAUDE.md Kural 5 — kurumsal güvenlik ve offline kullanım gereksinimi. Sakai default'u Lato kullanıyor; biz Helvetica system stack'e geçiyoruz.

**Etki:** Görsel fark minimal — Lato ile Helvetica/Arial benzer sans-serif fontlar.
