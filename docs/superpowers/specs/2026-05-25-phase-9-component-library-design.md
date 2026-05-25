# Phase 9 (Yeniden) — Bileşen Vitrini + Kütüphane Zenginleştirme — Tasarım

> **Tarih:** 25 Mayıs 2026
> **Durum:** Tasarım onaylandı (kullanıcı 3 soruyu yanıtladı) — implementasyon yeni oturumda
> **İlgili karar:** K-017 (bkz. `docs/ilerleme-ve-kararlar.md`)
> **Görev planı:** [`../plans/2026-05-25-phase-9-component-library.md`](../plans/2026-05-25-phase-9-component-library.md)

---

## 0. Neden Yeniden?

Phase 9.0 (pilot + rollout, commit `e8891d7` + `d2e0569`) çalışıyor ama **yetersiz**:

- **Kapsam eksik:** uikit sayfalarında **105 örnek bölümü** (`font-semibold text-xl`) var; 9.0 yalnızca **18'ini** kapsadı (sayfa başına ~1 ana örnek). ~87 bölümde "Kodu Göster" yok.
- **UI zayıf:** `CodeBlock` örneğin altına eklenen sade bir "Kodu Göster" toggle'ı — dikkat çekmiyor, kurumsal değil, tab yok.
- **Çeşitlilik az:** Sadece Sakai default demoları var; modüllerin tamamını geliştirmeye yetecek zenginlik/kompozit kalıp yok.

**Hedef:** Kurumsal standartta, **tab'lı bileşen vitrini**; **her örnek** kapsanır; **eksik PrimeNG bileşenleri** eklenir; **Kurumsal Desenler** (kompozit kalıplar) sayfası eklenir. Böylece modül takımları (vize, pasaport, personel, konsolosluk) **dışarıdan paket almadan** template'ten geliştirebilir.

**Korunan altyapı (9.0'dan evrim, çöp değil):**
- `scripts/extract-snippets.mjs` + `npm run snippets` — KORUNUR, marker konvansiyonu aynı.
- `src/app/pages/uikit/snippet.service.ts` — KORUNUR.
- `src/app/pages/uikit/code-block.ts` — `ComponentShowcase`'in "Kod" sekmesinde **iç parça** olarak yeniden kullanılır (veya showcase'e gömülür).

---

## 1. Kapsam (Alt Sistemler)

| # | Alt sistem | Özet |
|---|---|---|
| **S1** | `ComponentShowcase` bileşeni | Kurumsal kart + header (başlık + kopyala) + `p-tabs` (Önizleme / Kod). `ng-content` ile tek-kaynak. |
| **S2** | Tam kapsam | 17 uikit sayfasındaki **her** örnek bölümü showcase'e dönüşür (~100). |
| **S3** | Snippet altyapısı | Mevcut extractor; ID konvansiyonu + çoklu snippet/sayfa (zaten destekli). |
| **S4** | Gap analizi + eksik bileşenler | `/uikit/*`'te demolanmamış PrimeNG bileşenleri tespit + ekle. |
| **S5** | Kurumsal Desenler sayfası | `/uikit/patterns` — kompozit, kopyalanabilir kalıplar (MFA kimliğinde). |
| **S6** | Governance + dark + i18n | `lint:palette` temiz; alias token dark-aware; showcase etiketleri (template-only TR). |

---

## 2. `ComponentShowcase` Tasarımı

### 2.1 Konum & seçici
- Dosya: `src/app/pages/uikit/component-showcase.ts`
- Seçici: `app-showcase`
- Standalone, zoneless uyumlu (signal `input`).

### 2.2 API
```ts
@Component({ selector: 'app-showcase', ... })
export class ComponentShowcase {
  readonly title = input.required<string>();      // kart başlığı (örn. "Severities")
  readonly snippetId = input.required<string>();  // public/snippets/<sayfa>.json anahtarı
  readonly description = input<string>('');         // opsiyonel açıklama
  readonly code = input<string>('');                // sayfa snippet(snippetId) sonucunu geçirir
  // iç durum: aktif sekme, kopyalandı signal'ı
}
```

### 2.3 Tek-Kaynak İlkesi (kritik)
Örnek markup **showcase'in içine** `ng-content` olarak konur **ve** `<!-- snippet:ID -->` ile sarılır. Aynı markup:
- **Önizleme sekmesi** → `<ng-content>` ile canlı render.
- **Kod sekmesi** → build script `.ts` kaynağından çıkarıp `public/snippets/<sayfa>.json`'a yazar; sayfa `[code]` ile geçirir.

Kopya yok; demo ile kod tek yerden beslenir.

### 2.4 Şablon iskeleti
```html
<div class="mfa-showcase card">
  <!-- Header: başlık solda, kopyala sağda -->
  <div class="mfa-showcase__header flex items-center justify-between gap-2">
    <span class="font-semibold text-lg">{{ title() }}</span>
    <p-button [icon]="kopyalandi() ? 'pi pi-check' : 'pi pi-copy'"
              [label]="kopyalandi() ? 'Kopyalandı' : 'Kopyala'"
              size="small" severity="secondary" [text]="true"
              (onClick)="kopyala()" />
  </div>
  @if (description()) { <p class="text-sm text-muted-color mt-1">{{ description() }}</p> }

  <!-- Gövde: p-tabs -->
  <p-tabs [value]="0" class="mt-3">
    <p-tablist>
      <p-tab [value]="0"><i class="pi pi-eye mr-2"></i>Önizleme</p-tab>
      <p-tab [value]="1"><i class="pi pi-code mr-2"></i>Kod</p-tab>
    </p-tablist>
    <p-tabpanels>
      <p-tabpanel [value]="0">
        <div class="mfa-showcase__preview"><ng-content /></div>
      </p-tabpanel>
      <p-tabpanel [value]="1">
        <pre class="..."><code>{{ code() }}</code></pre>
      </p-tabpanel>
    </p-tabpanels>
  </p-tabs>
</div>
```
> Not: PrimeNG 21 Tabs API'si `p-tabs/p-tablist/p-tab/p-tabpanels/p-tabpanel` (panelsdemo + menudemo'da kullanılıyor — referans al). Kopyala butonu header'da, her iki sekmede de erişilebilir.

### 2.5 Kurumsal stil
- Kart: `var(--mfa-bg-elevated)` zemin, `var(--mfa-border)` kenar, `border-radius`.
- Header altı ince ayraç (`var(--mfa-border)`); başlıkta sol kenarda `var(--mfa-brand)` 3px accent şeridi (kurumsal vurgu) — opsiyonel.
- Kod bloğu: `var(--mfa-bg-muted)` zemin, `var(--mfa-text)` metin (9.0 CodeBlock ile aynı, dark-aware).
- `rem` font-size (font-scale uyumlu). Hardcoded hex/px YOK → `lint:palette` temiz.
- Sekme aktif rengi PrimeNG semantic (primary) → otomatik MFA kırmızısı.

### 2.6 Kullanım deseni (sayfa içinde)
```html
<app-showcase title="Severities" snippetId="button-severities" [code]="snippet('button-severities')">
  <!-- snippet:button-severities -->
  <div class="flex flex-wrap gap-2">
    <p-button label="Primary" />
    <p-button label="Secondary" severity="secondary" />
  </div>
  <!-- /snippet -->
</app-showcase>
```
Sayfa class'ında (9.0'daki gibi): `private snippets = inject(SnippetService).forPage('buttondemo'); snippet(id){...}`.

---

## 3. Snippet Extractor

- **Değişiklik gerekmez** — `<!-- snippet:ID -->...<!-- /snippet -->` konvansiyonu aynı; çoklu snippet/sayfa zaten destekli.
- **ID konvansiyonu:** `<sayfa-kısa>-<bileşen>-<varyant>` (örn. `button-severities`, `input-text-icons`, `panel-accordion`). Sayfa JSON'u içinde benzersiz olması yeter.
- Demo düzenlenince `npm run snippets` yeniden çalışır. **Öneri (9 sonrası):** `prebuild`/`prestart` script'ine bağla ki unutulmasın.

---

## 4. Kapsam Matrisi (sayfa → örnek bölümü)

`font-semibold text-xl` sayımına göre (kesin sayı implementasyonda netleşir; bazı başlıklar alt-etiket olabilir):

| Sayfa | Bölüm | Sayfa | Bölüm |
|---|---|---|---|
| inputdemo | ~21 | overlaydemo | ~6 |
| buttondemo | ~14 | timelinedemo | ~6 |
| menudemo | ~11 | tabledemo | ~4 |
| panelsdemo | ~7 | messagesdemo | ~3 |
| chartdemo | ~6 | listdemo | ~3 |
| formlayoutdemo | ~6 | mediademo | ~3 |
| miscdemo | ~6 | editordemo | ~3 |
| | | hierarchy/tree/file | ~2'şer |

**Toplam ~105 bölüm.** Her biri bir `<app-showcase>` olur. (Çok yoğun sayfalarda mantıklı gruplama yapılabilir — örn. inputdemo'da "Icons"/"Float Label" tek showcase'te birleşebilir; karar implementasyonda örnek-örnek verilir.)

---

## 5. Kütüphane Zenginleştirme

### 5a. Gap Analizi (eksik PrimeNG bileşenleri)
Yeni oturumda **audit görevi** (Explore/general-purpose subagent uygun): `/uikit/*`'te import edilen `primeng/*` setini PrimeNG 21'in tam bileşen listesiyle karşılaştır → eksikleri çıkar.

**İlk bakışta demolanan** (özet): button, splitbutton, buttongroup, inputtext/number, checkbox, radio, select, multiselect, listbox, datepicker, slider, rating, colorpicker, knob, togglebutton/switch, treeselect, autocomplete, textarea, table, treetable, tree, dataview, picklist, orderlist, organizationchart, accordion, fieldset, panel, splitter, tabs, toolbar, card, divider, dialog, drawer, popover, confirmpopup, tooltip, toast, message, fileupload, editor, carousel, galleria, image, chart, avatar, badge, chip, skeleton, progressbar, scrollpanel, scrolltop, tag, timeline, menu/menubar/tieredmenu/contextmenu/megamenu/panelmenu/breadcrumb/stepper.

**Aday eksikler** (doğrulanacak): `inplace`, `metergroup`, `progressspinner`, `blockui`, `speeddial`, `keyfilter`, `inputotp`, `inputgroup` varyantları, `virtualscroller`, `paginator` (standalone), `confirmdialog`, `inputmask`, `cascadeselect`, `selectbutton` varyantları, `tabmenu`/`steps`. Modül ihtiyacına göre öncelik: **form + tablo + overlay + feedback** bileşenleri.

> Karar: Eksik bileşen ilgili mevcut sayfaya yeni `<app-showcase>` olarak eklenir; gerekiyorsa yeni demo sayfası açılır.

### 5b. Kurumsal Desenler Sayfası (yeni)
**Rota:** `/uikit/patterns` (menüde "Kurumsal Desenler"). Modüllerin **kopyala-yapıştır** kullanacağı kompozit kalıplar — her biri `<app-showcase>` içinde:

1. **Sayfa Başlığı (Page Header)** — başlık + breadcrumb + sağda aksiyon butonları.
2. **Tablo + Araç Çubuğu** — başlık, arama (`iconfield`), filtre, "Yeni" butonu, `p-table` (sayfalama + seçim).
3. **Form Kartı** — `p-fluid` reactive form düzeni + kaydet/iptal (Reactive Forms; CLAUDE.md §7).
4. **Boş Durum (Empty State)** — ikon + mesaj + birincil aksiyon.
5. **İstatistik Kartları (Stat Cards)** — 4'lü `p-card` grid, ikon + sayı + trend (MFA palet varyasyonları).
6. **Filtre Çubuğu** — select + datepicker + multiselect + temizle.
7. **Onay Akışı** — `confirmdialog`/`confirmpopup` ile sil onayı + toast.
8. **Detay/Özet Paneli** — `p-panel`/`p-fieldset` ile alan-değer listesi.

Hepsi: MFA paleti (severity/alias token), Helvetica, responsive, sıfır dış paket.

### 5c. Kurumsal Kimlik Çeşitliliği
- Showcase'lerde MFA palet varyasyonları belirgin gösterilsin (red=primary, navy=info, gold=warn/tören, gray=surface, danger).
- `/pages/kurumsal-kimlik` ile çapraz bağ: "bu paletin bileşenlerde kullanımı" → uikit örneklerine link.

---

## 6. Governance / Kurallar

- **CLAUDE.md §14 güncellemesi:** Yeni uikit örneği eklerken **zorunlu** desen: `<app-showcase>` + `<!-- snippet:ID -->` + `snippet()`. "Kodu Göster" artık her örnekte standart.
- **lint:palette:** Showcase ve tüm yeni demolar hardcoded hex/Tailwind sabit renk içermez (`var(--mfa-*)` / severity). Yeni görseller `svgPlaceholder`.
- **i18n:** `ComponentShowcase` etiketleri (Önizleme/Kod/Kopyala/Kopyalandı) `/uikit` template-only kapsamında (K-012) → **TR sabit kabul**. Showcase modül kodunda kullanılmaz (yalnız kütüphane-dokümantasyon aracı). İleride shipping gerekirse i18n'lenir.
- **Sıfır paket:** Syntax highlight yok (paket gerektirir). Tüm yeni ihtiyaçlar PrimeNG + Angular built-in.

---

## 7. Fazlama (yeni oturum → sonraki oturumlar)

| Alt-faz | İçerik | Doğrulama |
|---|---|---|
| **9A** | `ComponentShowcase` bileşeni + extractor doğrulama + **pilot 2 sayfa** (buttondemo + inputdemo — en yoğun) | build + lint + tarayıcı (tab geçişi, kopyala, dark) + commit |
| **9B** | Kalan 15 uikit sayfası showcase'e (batch'ler: form/container, veri, etkileşim, kalan) | her batch: snippets + build + lint; sonda tarayıcı spot-check + commit |
| **9C** | Gap analizi (subagent) + eksik PrimeNG bileşen demoları | build + lint + commit |
| **9D** | "Kurumsal Desenler" sayfası (8 kompozit kalıp) + rota + menü + i18n menü etiketi | build + lint + tarayıcı + commit |

Her alt-faz sonunda `ilerleme-ve-kararlar.md` güncellenir; kullanıcı onayıyla push.

---

## 8. Yarınki Oturum İçin Araç/Skill/Subagent Önerileri

- **`ecc:angular-developer` skill** — Angular 21 signal/standalone/PrimeNG kod üretimi ve mimari kontrol (showcase + demolar).
- **`ecc:frontend-design-direction` / `ecc:design-system` skill** — kurumsal görsel yön, tutarlılık denetimi (opsiyonel).
- **Explore / general-purpose subagent** — 9C gap analizi (PrimeNG bileşen envanteri çıkar; salt-okuma).
- **Playwright / Preview MCP** — tab geçişi + kopyala + light/dark görsel doğrulama (bugün kullanıldı, çalışıyor).
- **`ecc:plan` / blueprint** — gerekiyorsa alt-fazları taskify; ama bu spec + plan dosyası zaten yol gösteriyor.
- **Önemli:** Skill'ler/subagent'lar **araçtır**, runtime paketi değil — CLAUDE.md §3 sıfır-paket kuralı aynen geçerli. Hiçbir skill `package.json`'a dependency eklemez.

---

## 9. Riskler & Azaltma

| Risk | Etki | Azaltma |
|---|---|---|
| `ng-content` + snippet senkronu kayar (markup değişir, `npm run snippets` unutulur) | Kod sekmesi eski snippet'i gösterir | `prebuild`/`prestart`'a `snippets` ekle; CI'da çalıştır |
| ~100 showcase tek sayfada render maliyeti | Yavaş sayfa, çok DOM | Kod sekmesi tıklanana kadar `<pre>` render edilmez (tab lazy); sayfa zaten lazy-route |
| PrimeNG Tabs API sürüm farkı | Şablon kırılır | panelsdemo/menudemo'daki çalışan `p-tabs` kullanımını referans al |
| Çok sayıda dosya düzenleme hatası | Build kırılır | Sayfa-sayfa, her batch'te build+lint; küçük diff'ler |
| Kurumsal Desenler kapsamı şişer | Süre artar | 8 kalıpla sınırla; fazlası sonraki faza |

---

## 10. Tamamlanma Kriterleri (Definition of Done)

- [ ] `ComponentShowcase` — tab'lı (Önizleme/Kod), header'da kopyala, MFA kimliği, dark-aware.
- [ ] 17 uikit sayfasının **her** örnek bölümü showcase'e dönüştü (~100), `npm run snippets` tüm JSON'ları üretti.
- [ ] Gap analizi yapıldı; öncelikli eksik PrimeNG bileşenleri eklendi.
- [ ] "Kurumsal Desenler" sayfası (≥8 kompozit kalıp) yayında, menüde, MFA kimliğinde.
- [ ] `npm run build` temiz, `npm run lint:palette` temiz.
- [ ] Tarayıcıda doğrulandı (tab + kopyala + light/dark + responsive).
- [ ] Dokümanlar güncel (ilerleme, plan, session-prompt).
