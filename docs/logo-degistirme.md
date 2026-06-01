# Logo / Amblem Değiştirme Rehberi

> Kurumsal amblemi (topbar + Kurumsal Kimlik sayfası) değiştirmek için tek-kaynak süreç.
> Tek bileşen değişir: [`src/app/core/util/mfa-logo.ts`](../src/app/core/util/mfa-logo.ts). Onu kullanan
> yerler (topbar, kurumsal kimlik) **hiç değişmez** — hepsi `<app-mfa-logo />` çağırır.

## Önce karar: inline SVG mi, asset dosyası mı?

| Durum | Yöntem |
|---|---|
| **1–2 renkli, sade amblem** (marka renginde) | **Inline SVG** — `<svg>` markup'ını bileşene göm, `fill`'leri `var(--mfa-brand)` / `var(--mfa-brand-fg)` token'larına çevir. Dark mode'da otomatik kayar, governance-temiz. |
| **Çok-renkli / detaylı / büyük resmi amblem** (yüzlerce `<path>`, sabit hex) | **Asset dosyası + `<img>`** — aşağıdaki adımlar. Inline gömmek bileşeni şişirir ve `lint:palette`'i sabit hex'lerle patlatır. |

Resmi T.C. Dışişleri Bakanlığı amblemi **ikinci kategoridedir** → asset + `<img>` yolu kullanılır.

## Asset + `<img>` adımları (resmi amblem)

1. **Dosyayı `public/`'e koy.** Angular yalnızca `public/` klasörünü statik servis eder
   ([`angular.json`](../angular.json) → `assets: [{ glob: "**/*", input: "public" }]`).
   `src/assets/` web URL'ine karşılık **gelmez** → oradan `<img src>` 404 verir.
   ```
   public/mfa-icon.svg          # ← amblem buraya
   ```

2. **Bileşende `src`'yi göster.** [`mfa-logo.ts`](../src/app/core/util/mfa-logo.ts) içinde amblem `<img>`'inin
   `src`'i **göreli** yoldur (`src="mfa-icon.svg"`) — `index.html`'deki `<base href="/" />` ile uyumlu,
   `config.js` / `favicon.ico` ile aynı konvansiyon. OpenShift alt-yol dağıtımında da göreli yol doğru çözülür.

3. **Boyut.** Amblem boyutu **kullanıldığı bağlamda** `--mfa-logo-size` token'ıyla ayarlanır:
   - Topbar: [`src/assets/layout/_topbar.scss`](../src/assets/layout/_topbar.scss) → `.layout-topbar-logo { --mfa-logo-size: 3rem; }`
   - Kurumsal Kimlik sayfası: kendi bağlamındaki değeri kullanır.
   Bileşen içinde varsayılan `2rem`'dir. Amblemde iç boşluk varsa görsel olarak küçük durabilir → bağlamda büyüt.

4. **Erişilebilirlik.** `variant="full"` (amblem + yazı markası) → amblem dekoratiftir
   (`alt=""` + `aria-hidden`), isim yazı markasından okunur. `variant="mark"` (sadece amblem) →
   `alt="T.C. Dışişleri Bakanlığı"`. Bu mantık bileşende hazırdır; değiştirmen gerekmez.

5. **Dark mode.** `<img>` amblem kendi sabit kurumsal renklerini her temada korur (resmi amblem için
   doğru davranış). Yazı markası palet token'larından beslenir → dark uyumludur.

6. **Eski kopyayı temizle.** Dosyayı yanlışlıkla `src/assets/`'e koyduysan, `public/`'e taşıdıktan
   sonra `src/assets/` kopyasını sil (iki kopya tutma).

7. **Doğrula.**
   ```bash
   npm run lint:palette                 # governance temiz mi (sabit hex/CDN yok)
   curl --noproxy '*' -I http://localhost:<port>/mfa-icon.svg   # HTTP 200 + image/svg+xml mı
   ```
   Kurumsal proxy'li Windows ortamında `localhost` istekleri için `--noproxy '*'` şart (yoksa 502).

## Amblemi tekrar değiştirmek

Yeni SVG/PNG'yi `public/`'e koy, `mfa-logo.ts`'teki `<img src>` adını güncelle. Başka yer değişmez.

## Governance notları

- Amblem `public/` altında, `.svg` dosyası olarak durur → `lint:palette` (`src/app/**/*.ts` tarar) ona dokunmaz.
- Bileşendeki `<img src="...">` satırında sabit hex **yoktur** → governance-temiz.
- Göreli yerel yol CDN kuralını tetiklemez (yalnız harici `http(s)` URL'ler işaretlenir).
