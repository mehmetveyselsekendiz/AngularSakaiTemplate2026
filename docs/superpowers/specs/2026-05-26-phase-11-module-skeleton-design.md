# Phase 11 — İlk Modül İskeleti + Dağıtım (Tasarım)

**Tarih:** 2026-05-26
**Durum:** Onaylandı (kullanıcı), uygulama başlıyor
**Önkoşul:** Phase 1–10 tamam (tema, auth, i18n, governance, bileşen vitrini, responsive audit)

---

## 1. Amaç

Template'in son boşluğunu kapatmak: **modül takımları için işlenmiş, fork'lanabilir bir örnek modül** + dağıtım altyapısı. Bu fazdan sonra vize/pasaport/personel/konsolosluk takımları template'i fork'layıp kendi modüllerini sıfır soru sormadan ekleyebilmeli.

Dört teslimat:
1. **`features/vize/`** — tam CRUD örnek modül (üretim desenleri)
2. **`docs/MODULE-DEV-GUIDE.md`** — modül fork/geliştirme rehberi
3. **OpenShift Docker** — Dockerfile + nginx + ConfigMap runtime env
4. **README** — kurulum/geliştirme/build/deploy

---

## 2. Vize modülü — anatomi

Örnek varlık: **Vize Başvurusu** (gerçek MFA iş alanına yakın, CRUD'a uygun).

```
src/app/features/vize/
├── vize.routes.ts          # lazy child routes
├── vize.models.ts          # VizeBasvurusu + tipler + PaginatedResponse<T>
├── vize.service.ts         # httpResource (list) + http.post/put/delete (mutation)
├── list/vize-list.ts       # p-table + httpResource + signal pagination/filtre + toolbar
├── detail/vize-detail.ts   # p-panel alan-değer + p-fieldset durum geçmişi
└── form/vize-form.ts       # Reactive Forms (FormBuilder/Validators) oluştur/düzenle
```

### Route deseni (lazy + rol-gating)
- `app.routes.ts` ana layout children'ına: `{ path: 'vize', loadChildren: () => import('./app/features/vize/vize.routes') }`
- `vize.routes.ts`: `'' → liste`, `'yeni' → form (oluştur)`, `':id' → detay`, `':id/duzenle' → form (düzenle)`
- Menü: `navigation.config.ts`'e **"Modüller"** grubu + `requiredRoles: ['VIZE_OKUMA']`

### Veri deseni (CLAUDE.md §8 üretim deseni)
```ts
// vize.service.ts
list = (q: Signal<VizeQuery>) => httpResource<PaginatedResponse<VizeBasvurusu>>(() => ({
  url: '/api/vize-basvurulari',
  params: { page: q().page, pageSize: q().pageSize, durum: q().durum ?? '', arama: q().arama ?? '' }
}));
create(dto)  { return this.http.post<VizeBasvurusu>('/api/vize-basvurulari', dto); }
update(id,d) { return this.http.put<VizeBasvurusu>(`/api/vize-basvurulari/${id}`, d); }
remove(id)   { return this.http.delete<void>(`/api/vize-basvurulari/${id}`); }
```
- Liste: `httpResource` otomatik loading/error; template `@if (res.isLoading()) / .error() / .hasValue()`.
- Mutation sonrası `res.reload()` ile listeyi tazele.

### Form deseni (CLAUDE.md §7 — Reactive Forms)
- `FormBuilder` + `Validators.required/email/maxLength`; hata mesajı `var(--mfa-danger)`.
- Oluştur/düzenle aynı component, route param `:id` ile mod ayrımı.

### i18n (CLAUDE.md §14 — modül kodu shipping → `| t` zorunlu)
- `vize.*` namespace key'leri `public/i18n/tr.json` + `en.json`'a (düz dot-key).
- Menü etiketi `navigation.config.ts` `labelKey`.

### Governance
- Sadece `/uikit/*`'te gösterilen PrimeNG bileşenleri (p-table, p-toolbar, p-button, p-tag, p-select, p-datepicker, p-inputtext, p-textarea, p-panel, p-fieldset, p-confirmdialog, p-iconfield, p-inputicon) — hepsi mevcut.
- Hardcoded hex/CDN yok; `lint:palette` temiz olmalı.

---

## 3. Yerel veri stratejisi — Dev-Data Interceptor (K-021)

**Karar:** Yerelde işlevsel CRUD için, sıfır-paket **dev-only `HttpInterceptorFn`** kullanılır.

- `src/app/core/http/dev-data.interceptor.ts` — yalnızca **geliştirici modunda** (`!appEnv.ssoUrl()`) `/api/vize-basvurulari*` isteklerini yakalar, modül-kapsamlı bellek-içi diziden GET/POST/PUT/DELETE yanıtı üretir (`HttpResponse`, gerçek ağ çağrısı yok).
- Staging bağlanınca (SSO_URL dolu) **otomatik devre dışı** → gerçek `/api` proxy.
- Interceptor zinciri: `[devDataInterceptor, authInterceptor, errorInterceptor]` (dev-data başta short-circuit eder).

**Neden bu yaklaşım:**
- **İşlevsel:** Yerelde dolu liste + ekle/düzenle/sil çalışır (en iyi referans deneyimi).
- **Sadık:** Component/service **gerçek üretim desenini** kullanır (`httpResource('/api/...')`) — fixture sadece transport katmanında.
- **Sıfır-paket:** Saf Angular `HttpInterceptorFn`; MSW/json-server YOK (CLAUDE.md §3/§13 paket yasağı korunur).
- **Kaldırılabilir:** Fork eden takım **tek dosyayı silip** `app.config.ts`'ten satırı kaldırarak gerçek staging'e geçer. MODULE-DEV-GUIDE.md bunu adım adım anlatır.

**Kuralla ilişki:** CLAUDE.md §8/§13 "mock backend yok" kuralının bilinçli, dar bir istisnası. §8/§13 bu dev-only fixture istisnasını yansıtacak şekilde güncellenir; istisna **yalnızca dev modu + tek kaldırılabilir dosya** ile sınırlıdır (kalıcı mock altyapısı değil).

---

## 4. OpenShift Docker

- **`Dockerfile`** — multi-stage: `node:22-alpine` build (`npm ci` + `npm run build`) → `nginxinc/nginx-unprivileged:1.27-alpine` runtime. Build çıktısı `dist/sakai-ng/browser/` → `/usr/share/nginx/html/`.
- **`nginx.conf`** — port **8080** (unprivileged), `/health` → 200, SPA fallback (`try_files ... /index.html`), `config.js` no-cache.
- **`docker-entrypoint.sh`** — konteyner açılışında ConfigMap env değişkenlerini `config.js`'e (`window.__ENV__`) yazar; sonra nginx başlar.
- **`.dockerignore`** — `node_modules`, `.angular`, `dist`, `.git`, docs vb.

---

## 5. README

Sakai boilerplate'i MFA'ya göre yeniden yaz (TR): proje tanımı + stack, kurulum (`npm install`), geliştirme (`npm run start` + dev modu), build, governance komutları (`lint:palette`, `snippets`), Docker/OpenShift deploy, klasör yapısı, modül geliştirme → `MODULE-DEV-GUIDE.md` linki.

---

## 6. Fazlama + doğrulama

| Alt-faz | Çıktı | Doğrulama |
|---|---|---|
| 11.0 | Bu spec | — |
| 11A | vize modülü + dev-data interceptor + route/menü/i18n bağlama | `npm run build` + `lint:palette` temiz; tarayıcıda CRUD uçtan uca |
| 11B | MODULE-DEV-GUIDE.md | — |
| 11C | Dockerfile + nginx.conf + entrypoint + dockerignore | `docker build` (kullanıcı onayıyla) |
| 11D | README + ilerleme-ve-kararlar (K-021) | — |

Her alt-faz sonunda commit; push kullanıcı onayıyla.

---

## 7. Sıfır-paket teyidi

Yeni runtime paketi **YOK**. Vize modülü Angular built-in (`httpResource`, Reactive Forms, Router, Signals) + PrimeNG (mevcut) + dev-data interceptor (saf Angular) ile yazılır. Docker araçları runtime dependency değil.
