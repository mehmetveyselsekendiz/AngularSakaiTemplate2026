# Navigasyon Yeniden Yapılandırma — Tasarım

**Tarih:** 2026-06-02
**Durum:** Onaylandı (uygulama planı bekliyor)
**Kapsam:** Sidebar navigasyonu, dashboard kaldırma, modül-fork yönetim modeli

---

## 1. Problem

Mevcut sidebar (`navigation.config.ts` → `NAV_GROUPS`) tek bir dizide üç farklı "kitleyi" karıştırıyor:

1. **Gerçek modül içeriği** (Ana Sayfa, Modüller > Vize) — son kullanıcı için.
2. **Geliştirici vitrini/referansı** (Bileşen Kütüphanesi — 18 madde).
3. **Karışık "Sayfalar"** (Kurumsal Kimlik, Palet Denetimi, Ayarlar, CRUD Örneği, Boş Sayfa, Auth demo, Sayfa Bulunamadı).

Sonuçlar:
- **"Sayfalar" grubu dağınık:** 4 ayrı tür düz listede; Auth tek başına alt-menü açtığı için tırtıklı görünüyor.
- **Fork yönetimi zor:** Modül ekibi fork'ladığında "kendi kısmını" bulup gerisini elle silmek zorunda — çünkü modül nav'ı ile template nav'ı aynı array'de.
- **Dashboard sahte:** "/" sayfası gerçek modül içeriği değil; "Hoş geldiniz" + template referans kartları (Bileşen Kütüphanesi/Kurumsal Kimlik/CRUD/Boş Sayfa).
- **Bileşen Kütüphanesi 18 maddeyle** dev sidebar'ında çok yer kaplıyor (kapanmıyor).

## 2. Doğru zihinsel model

**Her fork = TEK bir modül.** Bu template'ten Vize uygulaması, Pasaport uygulaması, Personel uygulaması gibi **ayrı ayrı uygulamalar** doğar. "Modüller" diye bir üst sekme YOK; sidebar doğrudan o modülün kendi sayfalarını gösterir. Template'teki Vize sadece örnektir; fork ekibi onu kendi modülüyle değiştirir.

## 3. Kararlar (kullanıcı onaylı)

| # | Karar |
|---|---|
| K1 | Navigasyon iki dosyaya bölünür: `module-nav.config.ts` (modülün kendi nav'ı) + `template-nav.config.ts` (dev-only referans). |
| K2 | Template/vitrin nav'ı **sadece dev modda** görünür. Tetikleyici: mevcut "SSO boş → dev modu" sinyali (`appEnv.ssoUrl()` boş). Üretimde (SSO dolu) otomatik gizlenir. Sıfır yeni config. |
| K3 | "Ana Sayfa" ve "Modüller" sarmalayıcıları kalkar. Modül grubunun başlığı modülün adıdır (örnek: **"Vize İşlemleri"**). |
| K4 | Dashboard sayfası **silinir**. "/" → modülün ana sayfasına yönlenir (örnek: `/vize`). |
| K5 | Dev template nav'ında tüm gruplar **açılır-kapanır** (collapsible), varsayılan kapalı. |
| K6 | Dağınık "Sayfalar" → iki temiz gruba ayrılır: **Kurumsal Kimlik** + **Örnek Sayfalar**. |
| K7 | **Ayarlar sayfası KORUNUR** (`/pages/ayarlar`). **Düzeltme:** Mevcut topbar'da ayrı bir ⚙️ "ayarlar sayfası açan" ikon YOK; topbar'daki 3'lü grup (dil/font/tema) ayarları **doğrudan** değiştirir ve hızlı-ayar görevi görür. Tam Ayarlar sayfası (reset + hakkında) **dev sidebar'da Kurumsal Kimlik grubu altından** erişilir. Üretimde modül kendi `MODULE_NAV`'ına eklemedikçe sidebar'da görünmez; hızlı ayarlar topbar grubundadır. Topbar'a dokunulmaz. |

## 4. Hedef yapı

### 4.1 `module-nav.config.ts` — `MODULE_NAV` (fork ekibi SADECE burayı düzenler; üretimde de görünür)

```
VİZE İŞLEMLERİ              ← grup başlığı = modülün adı (fork değiştirir)
  └ Vize Başvuruları → /vize   (requiredRoles: VIZE_OKUMA)
  └ (modülün diğer sayfaları buraya)
```

Dosya başına büyük yönerge yorumu: *"Bu, bu modülün menüsüdür. Kendi sayfalarınızı buraya ekleyin/değiştirin. `template-nav.config.ts`'e dokunmayın — o dev referansıdır."*

### 4.2 `template-nav.config.ts` — `TEMPLATE_NAV` (dev-only; fork dokunmaz; hepsi collapsible)

```
GELİŞTİRİCİ                       ← root grup başlığı
  ▸ Bileşen Kütüphanesi (path:'uikit')   → 18 uikit maddesi (mevcut)
  ▸ Kurumsal Kimlik (path:'kk')          → Kurumsal Kimlik · Palet Denetimi · Ayarlar
  ▸ Örnek Sayfalar (path:'ornek')        → CRUD Örneği · Boş Sayfa · Auth ▸ (Giriş/Erişim/Hata) · Sayfa Bulunamadı
```

Collapsible mekaniği mevcut `AppMenuitem` davranışına dayanır: nested (root olmayan) `items` içeren maddeler `path` + `activePath` ile açılır-kapanır; ilgili route'a gidince otomatik açılır (`updateActiveStateFromRoute`). Root grup başlıkları her zaman görünür ama altındaki açılır maddeler varsayılan kapalıdır.

### 4.3 `app.menu.ts` — birleştirme

`filteredModel` şu mantıkla kurulur:
- `groups = [...MODULE_NAV]`
- dev mod ise (`appEnv.ssoUrl()` boş) → `groups.push(...TEMPLATE_NAV)`
- Sonra mevcut rol + i18n filtrelemesi aynen uygulanır.

Geriye uyumluluk: `navigation.config.ts` korunur ve `NAV_GROUPS = [...MODULE_NAV, ...TEMPLATE_NAV]` ile `ROUTE_LABEL_KEY_MAP` / `ROUTE_LABEL_MAP` re-export edilir → breadcrumb bozulmaz.

### 4.4 `app.routes.ts`

- Kaldır: `{ path: '', component: Dashboard }` ve `Dashboard` import'u.
- Ekle: `{ path: '', redirectTo: 'vize', pathMatch: 'full' }`. Fork `'vize'`'yi kendi ana route'una çevirir.
- `src/app/pages/dashboard/` klasörü **silinir** (ölü kod).

### 4.5 i18n (`tr.json` / `en.json`)

- **Eklenecek:** `menu.dev` (Geliştirici / Developer), `menu.corporate` (Kurumsal Kimlik / Corporate Identity — grup başlığı), `menu.examples` (Örnek Sayfalar / Example Pages), modül grubu başlığı için key (örn. `menu.module.vize` = "Vize İşlemleri").
- **Kaldırılacak (gereksiz):** `menu.home`, `menu.modules`, `menu.modules.vize` (yerini modül key'i alır), `menu.dashboard`, `menu.pages`, dashboard'a özgü `dashboard.*` ve `dashboard.link.*` key'leri.
- **Korunacak:** `menu.library`, tüm `menu.uikit.*`, `menu.pages.corporate-identity`, `menu.pages.audit`, `menu.pages.settings`, `menu.pages.crud`, `menu.pages.empty`, `menu.pages.auth*`, `menu.pages.notfound`.

### 4.6 Dokümantasyon güncellemeleri (uygulama bitince)

Yapı template'te "tanınmalı" — kod değişince dokümanlar da güncellenir:
- **`CLAUDE.md`** — §9 (Klasör Sorumluluğu), §10 (Klasör Yapısı), §15 (Runtime Ayar Sistemi → topbar'da pi-cog yok, 3'lü grup gerçeği) güncellenir. Yeni navigasyon modeli (module-nav vs template-nav, dev-only görünürlük, tek-modül felsefesi) açıkça anlatılır.
- **`README.md`** — varsa navigasyon/başlangıç bölümü güncellenir.
- **`docs/MODULE-DEV-GUIDE.md`** — modül ekibinin SADECE `module-nav.config.ts`'i düzenleyeceği, "/" redirect'ini kendi ana route'una çevireceği, template nav'ına dokunmayacağı anlatılır.
- **`docs/ilerleme-ve-kararlar.md`** — yeni karar kaydı (K-NNN) eklenir.

### 4.7 Migration rehberi (mevcut türev modül için) — **YENİ DOSYA**

Kullanıcı bu template'in eski bir sürümünden zaten **1 modül** geliştirmiş. Aynı navigasyon değişikliklerini o projede de uygulayabilmesi için bir taşıma rehberi hazırlanır:

- **Dosya:** `docs/navigasyon-migrasyon-rehberi.md`
- **İçerik:**
  1. Değişikliklerin özeti (ne, neden) — bu spec'in damıtılmış hali.
  2. Adım adım uygulanacak değişiklikler (dosya dosya: hangi dosya eklenir/değişir/silinir).
  3. **Hazır prompt** — türev projede Claude Code oturumuna yapıştırılacak, kendi içinde bağlam taşıyan bir komut. Prompt, bu template projesinin **dosya yolunu referans olarak** alır (kullanıcı yolu girer) → oradaki nihai `module-nav.config.ts` / `template-nav.config.ts` / `app.menu.ts` / `app.routes.ts` dosyalarını okuyup aynısını türev projeye uyarlar.
  4. Dikkat notları: türev modülün kendi sayfa/route adları korunur; sadece navigasyon iskeleti uyarlanır.

Bu rehber bu turun (navigasyon) son çıktısıdır.

## 5. Üretim vs Dev sonucu

- **Üretim (SSO dolu):** sidebar'da yalnızca `VİZE İŞLEMLERİ` (modülün kendi nav'ı). Tek modüllük temiz uygulama. Hızlı ayarlar (dil/font/tema) topbar 3'lü grubundan; tam Ayarlar sayfası üretim sidebar'ında yok (modül isterse `MODULE_NAV`'a ekler).
- **Dev (SSO boş):** modül nav'ı + altında collapsible `GELİŞTİRİCİ` referansı (Bileşen Kütüphanesi / Kurumsal Kimlik+Ayarlar / Örnek Sayfalar), hepsi varsayılan kapalı.

## 6. Governance / kısıtlar

- Sıfır yeni paket. Mevcut PrimeNG menü + signals.
- Sabit Türkçe metin yok — tüm yeni etiketler i18n key + `labelKey`.
- Zoneless uyumu korunur (`computed` tabanlı `filteredModel`).
- `npm run lint:palette` / `lint:tokens` etkilenmez (renk/token değişmez).

## 7. Test etkisi

- `app.menu` için (varsa) birim testi: dev modda template grupları eklenir, üretimde eklenmez (SSO sinyali mock'lanır).
- Route testi: "/" → `/vize` redirect.
- Dashboard sileceği için ona ait spec varsa kaldırılır.

## 8. Kapsam dışı (YAGNI)

- İstatistik/widget dashboard'u **yapılmaz** (template için gereksiz — kullanıcı kararı).
- Sidebar sürükle-bırak/özelleştirme yok.
- Çoklu-modül sekme yapısı yok (model tek-modül).

## 9. Dokunulacak dosyalar (özet)

| Dosya | İşlem |
|---|---|
| `src/app/core/config/module-nav.config.ts` | **Yeni** — `MODULE_NAV` + `NavItem`/`NavGroup` tipleri (buraya taşınır) |
| `src/app/core/config/template-nav.config.ts` | **Yeni** — `TEMPLATE_NAV` (collapsible dev gruplar) |
| `src/app/core/config/navigation.config.ts` | Sadeleşir → iki dosyadan birleştirip `NAV_GROUPS` + `ROUTE_LABEL_*` re-export |
| `src/app/layout/component/app.menu.ts` | Dev mod kontrolüyle birleştirme |
| `src/app.routes.ts` | Dashboard route → redirect; import temizliği |
| `src/app/pages/dashboard/**` | **Silinir** |
| `public/i18n/tr.json`, `en.json` | Key ekle/temizle |
| `CLAUDE.md` | §9/§10/§15 güncellenir (yeni nav modeli + topbar gerçeği) |
| `README.md` | Navigasyon bölümü güncellenir (varsa) |
| `docs/MODULE-DEV-GUIDE.md` | Fork ekibi yönergesi güncellenir |
| `docs/ilerleme-ve-kararlar.md` | Yeni karar kaydı |
| `docs/navigasyon-migrasyon-rehberi.md` | **Yeni** — türev modül için adımlar + hazır prompt |
