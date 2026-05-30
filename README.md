# MFA Frontend Template

T.C. Dışişleri Bakanlığı kurumsal **Angular frontend template**'i. Modül takımları (vize, pasaport, personel, konsolosluk) bu template'i fork'layıp kendi modüllerini geliştirir.

**Felsefe:** Minimum bağımlılık — her ihtiyaç **Angular built-in + PrimeNG + Tailwind** ile karşılanır. **Sıfır yeni external paket.**

**Durum:** `v1.0.0` — production-ready template baseline. Kurumsal kimlik (renk + font + amblem) tek kaynaktan yönetilir; runtime ayarları (tema/dil/font ölçeği) tek servisten. Modül takımları bunu fork'layıp geliştirir.

> Kurallar ve yasaklar: [`CLAUDE.md`](CLAUDE.md) · Modül geliştirme: [`docs/MODULE-DEV-GUIDE.md`](docs/MODULE-DEV-GUIDE.md)

---

## Stack

| Katman | Sürüm |
|---|---|
| Angular | `^21` (stable, zoneless, standalone) |
| TypeScript | `~5.9.3` |
| PrimeNG | `^21` Aura + `@primeuix/themes` |
| Tailwind | `^4` (CSS-first) + `tailwindcss-primeui` |
| PrimeIcons | `^7` |
| Change detection | `provideZonelessChangeDetection()` (Zone.js YOK) |
| Form | Reactive Forms · Veri | `httpResource()` / `HttpClient` |
| Auth | Manuel OIDC (PKCE) · i18n | custom `TranslateService` + `| t` |

Node 22 LTS veya 24 önerilir.

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run start          # http://localhost:4200
```

`public/config.js` boşken (`SSO_URL: ''`) uygulama **geliştirici modunda** çalışır: login sayfasında "Geliştirici Olarak Devam Et" butonu + örnek modül rolleri otomatik atanır. Vize modülü (`/vize`) staging API olmadan bellek-içi veriyle uçtan uca çalışır (bkz. dev-data interceptor).

API istekleri `/api/**` → `proxy.conf.js` üzerinden staging'e yönlenir (`API_URL` env).

## Build

```bash
npm run build          # production → dist/sakai-ng/browser/
npm run watch          # dev build, watch
```

## Governance & araçlar

```bash
npm run lint:palette   # palet/governance tarayıcı (hex/tailwind/cdn/import) — ihlalde exit 1
npm run lint:tokens    # 3 palet dosyası (scss/preset/design-tokens) senkron mu — drift'te exit 1
npm run snippets       # /uikit örnek snippet'lerini public/snippets/*.json'a çıkar
npm run format         # prettier
```

**CI:** `.github/workflows/ci.yml` her push/PR'da `lint:palette` → `lint:tokens` → snippet tazeliği → `build` kapısını çalıştırır (Node 22). Bu kapı yeşil olmadan merge edilmez.

---

## Klasör yapısı

```
src/
├── app/
│   ├── layout/          # topbar, sidebar, menü, footer
│   ├── core/            # MFA runtime: auth/ settings/ i18n/ http/ config/
│   ├── pages/           # uikit/ (bileşen vitrini), dashboard, ayarlar, kurumsal-kimlik, auth
│   └── features/        # MODÜL KODU — vize/ (örnek tam CRUD modül)
└── assets/
    ├── mfa-tokens.scss  # TEK PALET KAYNAĞI (kurumsal renkler)
    ├── styles.scss · tailwind.css
public/
├── config.js            # window.__ENV__ runtime config (prod'da ConfigMap doldurur)
└── i18n/                # tr.json · en.json
```

- **`/uikit/*`** — modül takımları için tek yetkili bileşen referansı: 18 sayfa, 131 kopyalanabilir snippet (Önizleme/Kod) + **"Kurumsal Desenler"** sayfası (14 kompozit kalıp: sayfa başlığı, tablo+toolbar, form kartı, durum rozeti kataloğu, marka aksanlı kartlar, stepper, atama şeridi, bölümlenmiş form, ilerleme paneli, …).
- **`/pages/kurumsal-kimlik`** — renk paleti, tipografi, logo rehberi + canlı palet denetimi.
- **`features/vize/`** — işlenmiş örnek modül (lazy route + httpResource + Reactive Forms + rol-gating + i18n).

---

## Modül geliştirme

Yeni modül eklemek için **[`docs/MODULE-DEV-GUIDE.md`](docs/MODULE-DEV-GUIDE.md)** rehberini izleyin. Vize modülü (`src/app/features/vize/`) tüm desenleri gösteren işlenmiş örnektir.

Kısaca: `features/<modul>/` iskeleti → lazy route (`app.routes.ts`) → menü (`navigation.config.ts` `requiredRoles`) → veri (`httpResource`/`HttpClient`) → Reactive Forms → i18n key'leri (`tr.json`/`en.json`) → `npm run lint:palette` temiz.

---

## Docker / OpenShift dağıtımı

Multi-stage imaj: `node:22` build → `nginx-unprivileged:1.27` runtime (port 8080, root değil — OpenShift uyumlu). İmaj ~84.5 MB; `docker build` + runtime (`/health` 200, config.js env enjeksiyonu) doğrulandı.

```bash
docker build -t mfa-frontend .
docker run --rm -p 8080:8080 \
  -e SSO_URL="https://sso.mfa.gov.tr/realms/mfa" \
  -e CLIENT_ID="mfa-vize" \
  -e API_URL="https://api.mfa.gov.tr" \
  mfa-frontend
# → http://localhost:8080  ·  sağlık: http://localhost:8080/health
```

Runtime env değişkenleri konteyner açılışında `docker-entrypoint.sh` ile `window.__ENV__`'e (config.js) yazılır — imaj yeniden build edilmeden ortam değiştirilebilir. OpenShift'te bu değişkenler ConfigMap'ten gelir.

Desteklenen env: `SSO_URL`, `CLIENT_ID`, `REDIRECT_URI`, `POST_LOGOUT_URI`, `API_URL`, `PORTAL_URL`.

---

## Dokümanlar

| Doküman | İçerik |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Kurallar, yasaklar, stack, governance |
| [`docs/MODULE-DEV-GUIDE.md`](docs/MODULE-DEV-GUIDE.md) | Modül fork/geliştirme rehberi |
| [`docs/i18n-rehber.md`](docs/i18n-rehber.md) | i18n namespace + pipe stratejisi |
| [`docs/sakai-mfa-uyarlama-plani.md`](docs/sakai-mfa-uyarlama-plani.md) | Yol haritası, faz durumları |
| [`docs/ilerleme-ve-kararlar.md`](docs/ilerleme-ve-kararlar.md) | Tamamlanan adımlar + kararlar (K-001…) |
