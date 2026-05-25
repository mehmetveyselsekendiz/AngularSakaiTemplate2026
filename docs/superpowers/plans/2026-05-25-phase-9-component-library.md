# Phase 9 (Yeniden) — Görev Planı

> **Tasarım:** [`../specs/2026-05-25-phase-9-component-library-design.md`](../specs/2026-05-25-phase-9-component-library-design.md)
> **Hedef:** Kurumsal tab'lı bileşen vitrini + her örnek + zengin kütüphane.
> Bu plan, **yeni bir oturumda sıfırdan** yürütülebilecek şekilde yazıldı. Her görev kendi içinde bağlam taşır.

---

## Ön Koşullar (yeni oturum açılışında)

1. `CLAUDE.md` + `docs/ilerleme-ve-kararlar.md` (son bölüm) + bu spec'i oku.
2. `npm run build` ve `npm run lint:palette` yeşil mi doğrula (baseline).
3. PrimeNG Tabs kullanımını `src/app/pages/uikit/panelsdemo.ts` ve `menudemo.ts`'ten referans al (`p-tabs/p-tablist/p-tab/p-tabpanels/p-tabpanel`).
4. (Öneri) `ecc:angular-developer` skill'ini yükle.

---

## 9A — ComponentShowcase + Pilot (1. öncelik)

**Amaç:** Tab'lı vitrin bileşenini kur, en yoğun 2 sayfada (buttondemo, inputdemo) kanıtla.

- [ ] **9A-1** `src/app/pages/uikit/component-showcase.ts` oluştur (spec §2):
  - `input.required<string>() title, snippetId`; `input<string>() description, code`.
  - PrimeNG `p-tabs` (Önizleme=`<ng-content>`, Kod=`<pre><code>{{ code() }}</code></pre>`).
  - Header: başlık + "Kopyala" butonu (clipboard + `kopyalandi` signal, 2sn reset, zarif catch).
  - Stil: `var(--mfa-bg-elevated/border/bg-muted/text/brand)`, `rem`, dark-aware. Hardcoded hex/px YOK.
  - `code-block.ts`'i ya iç parça olarak kullan ya da kod sekmesini showcase'e göm (kararı implementasyonda ver).
- [ ] **9A-2** `buttondemo.ts`: mevcut 2 `<app-code-block>` kullanımını `<app-showcase>`'e taşı + **kalan ~12 örneği** showcase'e sar (Default, Severities, Text, Outlined, Group, SplitButton, Templating, Icons, Raised, Rounded, Rounded Icons, Rounded Text, Rounded Outlined, Loading). Her birine `<!-- snippet:button-* -->` + ID.
- [ ] **9A-3** `inputdemo.ts`: ~21 bölümü showcase'e sar (mantıklı gruplama serbest).
- [ ] **9A-4** `npm run snippets` → build → `lint:palette`.
- [ ] **9A-5** Tarayıcı doğrulama (preview/playwright): tab geçişi, kopyala, light/dark, responsive (375px). buttondemo + inputdemo.
- [ ] **9A-6** Commit: `feat(phase-9a): ComponentShowcase + buttondemo/inputdemo tam kapsam`. Kullanıcıya pilot göster, onay al.

**Kabul:** Showcase tab'lı çalışıyor; 2 pilot sayfanın HER örneği showcase'te; build+lint yeşil; tarayıcı PASS.

---

## 9B — Kalan 15 Sayfa (batch)

**Amaç:** Diğer tüm uikit sayfalarındaki her örneği showcase'e dönüştür.

Batch'ler (her batch sonunda snippets + build + lint; batch sonunda commit):
- [ ] **9B-1** form/container: formlayoutdemo (~6), panelsdemo (~7), overlaydemo (~6)
- [ ] **9B-2** veri: tabledemo (~4), listdemo (~3), treedemo (~2), hierarchydemo (~2)
- [ ] **9B-3** etkileşim: messagesdemo (~3), filedemo (~2), mediademo (~3), menudemo (~11)
- [ ] **9B-4** kalan: chartdemo (~6), timelinedemo (~6), miscdemo (~6), editordemo (~3)
- [ ] **9B-5** Tüm sayfalar: `npm run snippets` → build → lint → tarayıcı spot-check (3-4 sayfa) → commit `feat(phase-9b): kalan uikit sayfaları tam kapsam`.

**Not:** Her sayfada `inject(SnippetService).forPage('<sayfa>')` + `snippet(id)` deseni (9.0'dan). Mevcut tek `<app-code-block>` kullanımları showcase'e taşınır.

**Kabul:** 17 sayfanın tamamında her örnek showcase'te; ~100 snippet; build+lint yeşil.

---

## 9C — Gap Analizi + Eksik Bileşenler

**Amaç:** Modüllerin ihtiyaç duyacağı ama demolanmamış PrimeNG bileşenlerini ekle.

- [ ] **9C-1** **Gap analizi** (Explore/general-purpose subagent — salt okuma): `/uikit/*`'teki `primeng/*` import setini PrimeNG 21 tam bileşen listesiyle karşılaştır; eksikleri öncelik (form/tablo/overlay/feedback) ile raporla. (Aday liste: spec §5a.)
- [ ] **9C-2** Kullanıcıya eksik liste + öncelik sun, onay al (hangileri eklenecek).
- [ ] **9C-3** Onaylananları ilgili mevcut sayfaya yeni `<app-showcase>` olarak ekle (gerekirse yeni demo dosyası + route + menü + i18n etiketi).
- [ ] **9C-4** snippets + build + lint + commit `feat(phase-9c): eksik PrimeNG bileşen demoları`.

**Kabul:** Öncelikli eksik bileşenler kütüphanede; governance temiz.

---

## 9D — Kurumsal Desenler Sayfası

**Amaç:** Modüllerin kopyala-yapıştır kullanacağı kompozit kalıplar (spec §5b).

- [ ] **9D-1** `src/app/pages/uikit/patternsdemo.ts` (veya uygun ad) — 8 kompozit kalıp, her biri `<app-showcase>` içinde: Page Header, Tablo+Toolbar, Form Kartı (Reactive Forms), Empty State, Stat Cards, Filtre Çubuğu, Onay Akışı, Detay Paneli.
- [ ] **9D-2** Route (`uikit.routes.ts`) + `navigation.config.ts` ("Kurumsal Desenler", `labelKey`) + `tr.json`/`en.json` (`menu.uikit.patterns`).
- [ ] **9D-3** Tüm kalıplar MFA kimliğinde (severity/alias token), responsive, sıfır dış paket.
- [ ] **9D-4** snippets + build + lint + tarayıcı + commit `feat(phase-9d): Kurumsal Desenler sayfası`.

**Kabul:** Sayfa menüde, ≥8 kalıp showcase'te, kopyalanabilir, MFA kimliğinde.

---

## Kapanış

- [ ] `ilerleme-ve-kararlar.md` Phase 9 (yeniden) tamamlandı olarak güncelle.
- [ ] `sakai-mfa-uyarlama-plani.md` §4B Phase 9 → TAMAMLANDI.
- [ ] `yeni-sakai-session-prompt.md` → Phase 10 sırada.
- [ ] Kullanıcı onayıyla push.
- [ ] Phase 10 (Responsive Audit) — sıradaki faz.

---

## Çalışma Kuralları (hatırlatma)

- **Sıfır paket** (CLAUDE.md §3) — skill/subagent araçtır, dependency eklemez. Syntax highlight yok.
- **Her örnek** showcase + snippet (CLAUDE.md §14 güncellendi).
- `lint:palette` her commit öncesi yeşil; hardcoded hex/Tailwind sabit renk yok; CDN görsel yerine `svgPlaceholder`.
- Küçük diff'ler, sayfa-sayfa; her batch'te build + lint.
- Büyük komut (build/start) öncesi kullanıcı onayı; push kullanıcı onayıyla.
- `npm run format` repo-geneli EOL/format gürültüsü yaratıyor — sadece dokunulan dosyalara prettier uygula veya format'ı atla (bkz. Phase 8/9 notları).
