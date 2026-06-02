# Modül Geliştirme Rehberi

> T.C. Dışişleri Bakanlığı **MFA Frontend Template** üzerinde modül geliştiren takımlar (vize, pasaport, personel, konsolosluk) için.
> İşlenmiş örnek: **`src/app/features/vize/`** — bu rehber boyunca referans alınır.
> Kurallar ve yasaklar: [`CLAUDE.md`](../CLAUDE.md). i18n ayrıntısı: [`i18n-rehber.md`](i18n-rehber.md).

---

## 0. Felsefe — önce oku

Bu template **sıfır yeni paket** ilkesiyle gelir. Her ihtiyaç **Angular built-in + PrimeNG + Tailwind** ile karşılanır. Modül yazarken de aynı kural geçerli:

> Yeni bir paket eklemeden önce sor: **"Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?"** — cevap evet ise paket EKLENMEZ.

Yasaklı paketler ve karşılıkları için [`CLAUDE.md §3`](../CLAUDE.md). Özet: HTTP→`HttpClient`, server state→`httpResource()`, client state→`signal()`, form→Reactive Forms, tablo→`<p-table>`, toast→`MessageService`, i18n→custom `| t` pipe.

---

## 1. Template'i fork'lama

```bash
# 1. Template'i klonla, kendi modül reponuza dönüştürün
git clone <template-repo-url> mfa-vize-frontend
cd mfa-vize-frontend
git remote set-url origin <kendi-repo-url>   # upstream sync YOK — bu artık sizin kodunuz

# 2. Bağımlılıkları kur
npm install

# 3. Geliştirme sunucusu (SSO yapılandırılmamışken "Geliştirici Modu" açılır)
npm run start            # http://localhost:4200
```

`public/config.js` boş bırakıldığında (`SSO_URL: ''`) uygulama **geliştirici modunda** çalışır: login sayfasında "Geliştirici Olarak Devam Et" butonu + örnek modül rolleri otomatik atanır. Gerçek ortamda `config.js` (OpenShift'te ConfigMap → `window.__ENV__`) doldurulur.

---

## 2. Yeni modül iskeleti

MFA-spesifik kod **`src/app/features/<modul>/`** altına toplanır. Vize örneğinin yapısı:

```
src/app/features/vize/
├── vize.routes.ts          # lazy child rotalar (default export Routes)
├── vize.models.ts          # arayüzler, tip alias'ları, seçim listeleri, severity eşlemesi
├── vize.service.ts         # veri katmanı: httpResource (okuma) + HttpClient (yazma)
├── vize-dev-data.interceptor.ts   # GELİŞTİRME mock'u — prod'a gitmez, silinir
├── list/vize-list.ts       # p-table + httpResource + filtre + rol-gated aksiyon
├── detail/vize-detail.ts   # p-panel alan-değer + p-fieldset geçmiş
└── form/vize-form.ts       # Reactive Forms oluştur/düzenle
```

Kendi modülünüz için `vize` → `<modul>` ikamesiyle aynı iskeleti kopyalayın.

### Lazy route bağlama

`vize.routes.ts` **default export** eden bir `Routes` dizisidir:

```ts
export default [
  { path: '', loadComponent: () => import('./list/vize-list').then((m) => m.VizeList), data: { breadcrumb: 'menu.modules.vize' } },
  { path: 'yeni', loadComponent: () => import('./form/vize-form').then((m) => m.VizeForm) },
  { path: ':id/duzenle', loadComponent: () => import('./form/vize-form').then((m) => m.VizeForm) },
  { path: ':id', loadComponent: () => import('./detail/vize-detail').then((m) => m.VizeDetail) }
] as Routes;
```

`src/app.routes.ts` ana layout children'ına ekleyin (auth guard üst rotadan miras alınır):

```ts
{ path: 'vize', loadChildren: () => import('./app/features/vize/vize.routes') },
```

> **Sıra kuralı:** Statik segmentler (`yeni`) ve iki-segmentli rotalar (`:id/duzenle`), tek-segmentli `:id`'den ÖNCE gelmeli.

---

## 3. Veri katmanı — `httpResource()` + `HttpClient`

**Okuma (GET):** `httpResource()` otomatik loading/error/cache verir, signal'a tepki verir.

```ts
// vize.service.ts
list(query: Signal<VizeQuery>) {
  return httpResource<PaginatedResponse<VizeBasvurusu>>(() => ({
    url: '/api/vize-basvurulari',
    params: { page: query().page, pageSize: query().pageSize, durum: query().durum ?? '', arama: query().arama ?? '' }
  }));
}
```

> **Injection context:** `httpResource()` effect kullanır; `list()`/`get()` yalnızca component **alan başlatıcısında** veya **constructor'da** çağrılmalı (sonradan değil).

Component'te:

```ts
readonly query = signal<VizeQuery>({ page: 0, pageSize: 10, durum: '', arama: '' });
readonly res = this.vize.list(this.query);   // alan başlatıcı — OK
```

```html
@if (res.error()) { <p-message severity="error" [text]="'vize.error' | t" /> }
@else { <p-table [value]="res.value()?.items ?? []" [loading]="res.isLoading()"> ... </p-table> }
```

Filtre/sayfalama: `query.set(...)` çağırınca `httpResource` otomatik yeniden çeker.

**Yazma (POST/PUT/DELETE):** `HttpClient` — Observable döner, component subscribe eder; sonra `res.reload()` ile listeyi tazeleyin.

```ts
create(dto: VizeBasvurusuDto)        { return this.http.post<VizeBasvurusu>(this.base, dto); }
update(id: string, dto)              { return this.http.put<VizeBasvurusu>(`${this.base}/${id}`, dto); }
remove(id: string)                   { return this.http.delete<void>(`${this.base}/${id}`); }
```

Hata yönetimi merkezi: `core/http/error.interceptor.ts` 401→SSO redirect, 403/422/5xx/0→toast. Modülde tekrar yazmayın; 404/400/409 sessiz bırakılır (çağıran isterse ele alır).

---

## 4. Form — Reactive Forms (Signal Forms DEĞİL)

Angular 21'deyiz; Signal Forms v22'de stable olacak. Doğrulamalı formlar **Reactive Forms** ile:

```ts
readonly form = this.fb.group({
  adSoyad: ['', [Validators.required, Validators.maxLength(120)]],
  vizeTipi: [null as string | null, Validators.required],
  basvuruTarihi: [new Date() as Date | null, Validators.required],
  email: ['', Validators.email],
  // ...
});
```

- Oluştur/düzenle **tek component**; `ActivatedRoute` `:id` paramıyla mod ayrılır.
- Düzenle modunda kayıt `httpResource` ile gelir, `effect()` içinde `form.patchValue(...)`.
- Tarih: form control `Date` tutar; kaydederken ISO `YYYY-MM-DD`'ye çevrilir (UTC kaymasını önlemek için yerel `getFullYear/getMonth/getDate`).
- Hata mesajı rengi `var(--mfa-danger)` (hardcoded hex YOK).

---

## 5. Rol-bazlı yetki

İki katman:

**Menü görünürlüğü** — `core/config/module-nav.config.ts` `requiredRoles`:

```ts
{ labelKey: 'menu.module.vize', items: [
  { labelKey: 'menu.modules.vize', icon: 'pi pi-fw pi-id-card', routerLink: ['/vize'], requiredRoles: ['VIZE_OKUMA'] }
]},
```

Menü `authService.roles()` signal'ına bağlı `computed()` ile otomatik filtrelenir.

> **Navigasyonu uyarlama (tek-modül modeli).** Bu template her fork'ta TEK bir modüldür; "Modüller" üst sekmesi yoktur.
> 1. `core/config/module-nav.config.ts` → `MODULE_NAV` grubunun `labelKey`'ini ve item'larını **kendi modülünüze** göre değiştirin (örnek Vize'yi kendi sayfalarınızla değiştirin).
> 2. `src/app.routes.ts` → `{ path: '', redirectTo: 'vize', pathMatch: 'full' }` hedefini kendi **ana route'unuza** çevirin. (Ayrı dashboard sayfası yoktur; "/" modülün ana sayfasına gider.)
> 3. `core/config/template-nav.config.ts`'e **DOKUNMAYIN** — geliştirici referansıdır (Bileşen Kütüphanesi / Kurumsal Kimlik / Örnek Sayfalar), yalnızca SSO boşken görünür ve üretimde otomatik gizlenir.
> 4. Yeni grup/menü etiketleri için `tr.json`/`en.json`'a `menu.*` key ekleyin (sabit metin yazmayın), `ROUTE_LABEL_KEY_MAP`'i güncelleyin.

**Aksiyon görünürlüğü** — `PermissionService` (Signal):

```ts
private perm = inject(PermissionService);
readonly canYaz = this.perm.hasRole('VIZE_YAZMA');   // Signal<boolean>
readonly canSil = this.perm.hasRole('VIZE_SIL');
```

```html
@if (canYaz()) { <p-button [label]="'vize.list.new' | t" icon="pi pi-plus" [routerLink]="['yeni']" /> }
```

Gerçek roller SSO token claim'lerinden gelir (`core/config/app-env.ts` → `extractRoles()`). Geliştirici modunda `auth.service.ts` `devLogin()` örnek rolleri atar — kendi modül rollerinizi oraya ekleyebilirsiniz (yalnızca dev modunu etkiler).

---

## 6. i18n — modül metinleri çevrilir

Modül kodu son kullanıcıya **shipping** yapılır → tüm UI metni `| t` pipe ile çevrilmeli (sabit Türkçe metin YAZMA). Ayrıntı: [`i18n-rehber.md`](i18n-rehber.md).

- Kendi namespace'inizi kullanın: `vize.*`, `pasaport.*`, ...
- Key'leri **hem** `public/i18n/tr.json` **hem** `public/i18n/en.json`'a ekleyin (düz dot-key).
- Parametre: `{{ 'vize.delete.confirm.message' | t: { no: row.basvuruNo } }}` ↔ `"... {no} ..."`.
- Programatik (toast/confirm başlık): `inject(TranslateService).t('key', params)`.
- Tarih/para: `| mfaDate` ve `| mfaCurrency` (dil değişince güncellenir; ham `| date`/`| currency` değil).
- `<p-select>` etiketlerini dile bağlamak için `dict()` okuyan `computed()` kullanın (vize-list örneği).

---

## 7. Governance — kopyalamadan önce bilin

`/uikit/*` sayfaları **tek yetkili bileşen referansıdır**. Tarayıcı: `npm run lint:palette` (sıfır bağımlılık, ihlalde exit 1).

| Kural | Yasak | Doğrusu |
|---|---|---|
| HEX | `color:#DA291C` | `var(--mfa-red)` / `var(--mfa-danger)` |
| TAILWIND | `bg-red-500`, `text-[#...]` | `severity="primary"`, `var(--mfa-*)`, `surface-*` |
| CDN | `https://cdn.../img.png` | yerel asset / `svgPlaceholder()` data:URI |
| IMPORT | `/uikit/*`'te gösterilmeyen PrimeNG modülü | önce demoyu `/uikit/*`'e ekle, sonra kullan |

- Yeni bileşene ihtiyaç varsa **önce** ilgili `src/app/pages/uikit/*demo.ts`'e `<app-showcase>` örneği ekleyin (+`npm run snippets`), **sonra** modülde kullanın.
- Renk: yalnızca `var(--mfa-*)` alias token'ları veya PrimeNG `severity`. Tek palet kaynağı `src/assets/mfa-tokens.scss`.
- Font ölçeği bypass'ını önlemek için component SCSS'te `rem` kullanın (dokunma hedefi `min-height: 44px` px istisnası — bkz. CLAUDE.md K-019).
- Meşru istisna: satır sonuna `// mfa-ignore`.

---

## 8. Yerelde test → gerçek staging'e geçiş

Vize modülü, staging API olmadan da çalışsın diye **geliştirme-amaçlı bir mock interceptor** ile gelir: `vize-dev-data.interceptor.ts`.

- Yalnızca **geliştirici modunda** (`SSO_URL` boşken) `/api/vize-basvurulari` isteklerini bellek-içi diziyle karşılar.
- Component ve servis kodu **gerçek üretim desenini** kullanır (`httpResource('/api/...')`) — mock yalnızca transport katmanındadır.

**Gerçek API'ye geçiş (2 adım):**

1. `src/app/features/vize/vize-dev-data.interceptor.ts` dosyasını **silin**.
2. `src/app.config.ts` içindeki `vizeDevDataInterceptor` import + `withInterceptors([...])` kaydını **kaldırın**.

Bundan sonra `/api/**` istekleri `proxy.conf.js` (geliştirme) veya `window.__ENV__.API_URL` (runtime) üzerinden gerçek staging'e gider. **Component/servis koduna dokunmazsınız.**

> Kendi modülünüz aynı deseni izleyebilir: `<modul>-dev-data.interceptor.ts` yazıp app.config'e geçici kaydedin; production öncesi silin. Bu, "mock backend yok" kuralının dar, kaldırılabilir bir istisnasıdır (kalıcı mock altyapısı kurmayın — bkz. CLAUDE.md §8, K-021).

---

## 9. Komutlar

```bash
npm run start          # geliştirme sunucusu (http://localhost:4200)
npm run build          # production build
npm run watch          # dev build, watch
npm run lint:palette   # governance tarayıcı (hex/tailwind/cdn/import) — ihlalde exit 1
npm run snippets       # /uikit örnek snippet'lerini public/snippets/*.json'a çıkar
npm run format         # prettier
```

---

## 10. Yeni modül checklist

- [ ] `features/<modul>/` iskeleti oluşturuldu (models, service, routes, list/detail/form)
- [ ] Lazy route `app.routes.ts`'e eklendi; "/" redirect hedefi modülün ana route'una çevrildi
- [ ] Menü `core/config/module-nav.config.ts`'e `labelKey` + `requiredRoles` ile eklendi; `ROUTE_LABEL_KEY_MAP` güncellendi (`template-nav.config.ts`'e dokunulmadı)
- [ ] Veri: okuma `httpResource`, yazma `HttpClient`; `/api/...` uç noktaları
- [ ] Form: Reactive Forms + Angular `Validators`
- [ ] Tüm UI metni `| t`; key'ler `tr.json` + `en.json`'a eklendi (kendi namespace'iniz)
- [ ] Tarih/para `| mfaDate` / `| mfaCurrency`
- [ ] Yalnızca `/uikit/*`'te gösterilen PrimeNG bileşenleri; renkler `var(--mfa-*)` / severity
- [ ] (Gerekirse) dev-data interceptor yazıldı ve production öncesi kaldırma notu eklendi
- [ ] `npm run lint:palette` temiz
- [ ] `npm run build` temiz
- [ ] Tarayıcıda CRUD uçtan uca çalışıyor (light + dark, 320px reflow)
