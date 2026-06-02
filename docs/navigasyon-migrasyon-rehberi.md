# Navigasyon Migrasyon Rehberi — Türev Modüller

Bu rehber, MFA template'inin **eski bir sürümünden** geliştirilmiş bir modüle, yeni
navigasyon yapısını (tek-modül modeli) uygulamak içindir. Hazırlayan: template ekibi
(2 Haziran 2026, K-026).

## Ne değişiyor (özet)

1. Sidebar ikiye bölünür: `core/config/module-nav.config.ts` (modülün kendi menüsü) +
   `core/config/template-nav.config.ts` (dev-only geliştirici referansı).
2. `app.menu.ts` ikisini `buildNavGroups(!appEnv.ssoUrl())` ile birleştirir;
   SSO doluysa (üretim) template referansı gizlenir.
3. Dashboard kaldırılır; `/` modülün ana route'una redirect olur.
4. Dağınık "Sayfalar" grubu temizlenir; dev referans grupları collapsible olur.
5. "Modüller" üst sekmesi kalkar — her uygulama TEK bir modüldür.

## Adım adım

1. **Referans template'i aç.** Bu template projesinin nihai dosyalarını oku:
   - `src/app/core/config/module-nav.config.ts`
   - `src/app/core/config/template-nav.config.ts`
   - `src/app/core/config/navigation.config.ts`
   - `src/app/layout/component/app.menu.ts`
   - `src/app.routes.ts`
2. **module-nav.config.ts** oluştur; `MODULE_NAV` grubunu KENDİ modülünün
   sayfalarıyla doldur (grup `labelKey` = modül adı; item'lar kendi route'ların +
   `requiredRoles`). `NavItem`/`NavGroup` tiplerini bu dosyaya koy.
3. **template-nav.config.ts** oluştur; referans template'tekiyle **birebir** kopyala
   (dev referansı modüle özgü değildir).
4. **navigation.config.ts**'i `buildNavGroups(isDevMode)` saf fonksiyonu +
   geriye-uyumlu `NAV_GROUPS` / `ROUTE_LABEL_KEY_MAP` / `ROUTE_LABEL_MAP` re-export
   olacak şekilde uyarla.
5. **app.menu.ts**'i `buildNavGroups(!appEnv.ssoUrl())` kullanacak şekilde güncelle
   (import: `buildNavGroups`, `appEnv`).
6. **app.routes.ts**: dashboard route'unu kaldır,
   `{ path: '', redirectTo: '<senin-ana-route>', pathMatch: 'full' }` ekle.
   Varsa dashboard sayfasını sil ve kalan referansları temizle.
7. **i18n**: kendi `menu.*` grup key'lerini ekle; kullanılmayan `menu.dashboard`,
   `menu.modules`, `menu.pages`, `dashboard.*` key'lerini temizle.
   (Not: `notfound` sayfası `menu.home` kullanıyorsa o key KALMALI.)
8. Doğrula: `npm run lint:palette`, `npm test`, `npm run build`, görsel kontrol.

## Hazır Prompt (türev projede Claude Code'a yapıştır)

> Bu projede sidebar navigasyonunu MFA template'inin yeni "tek-modül" modeline
> taşımanı istiyorum. Referans template şu yolda:
> **`<BURAYA TEMPLATE PROJESİNİN TAM YOLUNU YAZ>`**
> (ör. `C:\Users\<kullanıcı>\Desktop\AngularSakaiTemplate2026`).
>
> Önce bu projenin `CLAUDE.md`'sini ve mevcut navigasyon dosyalarını oku, sonra
> şu adımları izle:
>
> 1. Referans template'teki şu dosyaları OKU ve deseni anla:
>    `src/app/core/config/module-nav.config.ts`, `template-nav.config.ts`,
>    `navigation.config.ts`, `src/app/layout/component/app.menu.ts`,
>    `src/app.routes.ts`. Ayrıca referans `docs/superpowers/specs/2026-06-02-navigation-restructure-design.md`'i de oku.
> 2. Bu projede `core/config/template-nav.config.ts`'i referanstakiyle **BİREBİR**
>    oluştur (geliştirici referansı modüle özgü değildir).
> 3. `core/config/module-nav.config.ts`'i oluştur ama `MODULE_NAV`'ı **BU PROJENİN**
>    kendi sayfalarıyla doldur — referanstaki Vize örneğini KOPYALAMA; bu projedeki
>    mevcut menü maddelerini (route + roller + i18n key) koru. `NavItem`/`NavGroup`
>    tiplerini bu dosyaya taşı.
> 4. `navigation.config.ts`'i `buildNavGroups(isDevMode)` + geriye-uyumlu re-export
>    (`NAV_GROUPS`, `ROUTE_LABEL_KEY_MAP`, `ROUTE_LABEL_MAP`) olacak şekilde uyarla;
>    `app.menu.ts`'i `buildNavGroups(!appEnv.ssoUrl())` kullanacak şekilde güncelle.
> 5. `app.routes.ts`'te dashboard route'unu kaldır ve
>    `{ path: '', redirectTo: '<bu projenin ana route'u>', pathMatch: 'full' }` ekle;
>    varsa dashboard sayfasını sil ve kalan referansları temizle.
> 6. i18n dosyalarında kendi grup key'lerini ekle (`menu.dev`, `menu.dev.corporate`,
>    `menu.dev.examples`, modül grubu için bir `menu.*` key), kullanılmayan eski
>    key'leri (`menu.dashboard`/`menu.modules`/`menu.pages`/`dashboard.*`) sil.
>    `notfound` sayfası `menu.home` kullanıyorsa o key'i KORU.
> 7. Her mantıklı adımdan sonra `npm run build` ve `npm test` ile doğrula; bitince
>    `npm run lint:palette` ve (varsa) `npm run lint:tokens` çalıştır. Kuralları
>    MUTLAKA koru: sıfır yeni paket, sabit Türkçe metin yok (i18n key), hardcoded
>    renk yok, standalone + zoneless.
> 8. Bu projedeki modül adlarını/route'larını DEĞİŞTİRME — sadece navigasyon
>    iskeletini yeni modele uyarla. Büyük/yıkıcı işlemden (dosya silme) önce bana sor.

## Dikkat

- Bu projenin mevcut modül sayfaları/route'ları korunur; sadece navigasyon
  iskeleti değişir.
- `template-nav.config.ts` üretimde otomatik gizlidir (SSO dolu) — silmene gerek yok.
- Bu projede dosya/route adları template'ten farklıysa, prompt'taki `<...>`
  yer tutucularını ona göre doldur.
- Türev projeye bu template'in yolunu verirsen, Claude oradaki nihai dosyaları
  okuyup deseni birebir uygular — kopyalama hatası riskini azaltır.
