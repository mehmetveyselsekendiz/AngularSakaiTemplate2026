# Yeni Claude Code Oturumu — Açılış Prompt'u

Bu dosya, **`AngularSakaiTemplate2026`** dizininde **yeni bir Claude Code oturumu** başlattığında ilk mesaj olarak göndereceğin prompt'u içerir.

## Kullanım Adımları

1. PowerShell veya Terminal aç
2. `cd C:\Users\t1.veysel.sekendiz\Desktop\AngularSakaiTemplate2026`
3. **React kaynağını referans olarak clone'la (henüz yapmadıysan):**
   ```bash
   git clone https://github.com/mehmetveyselsekendiz/ReactTemplate2026.git .reference-react
   echo .reference-react/ >> .gitignore
   ```
4. **Eski plan dokümanı:** `docs/angular-migration-plan.md` (Sakai öncesi sıfırdan v22 yaklaşımı — tarihsel referans, artık geçersiz). Kopyalanmadıysa eski repodan kopyala.
5. **Yeni yol haritası:** `docs/sakai-mfa-uyarlama-plani.md` (Sakai + MFA özelleştirme planı — **takip edeceğin doküman bu**)
6. Bu dizinde Claude Code oturumu aç (`claude`)
7. Aşağıdaki **"PROMPT — BURADAN KOPYALA"** bölümündeki metni komple kopyala ve ilk mesaj olarak yapıştır

---

## PROMPT — BURADAN KOPYALA

```
Merhaba. Bu repo T.C. Dışişleri Bakanlığı için Angular kurumsal frontend
template'i. Tüm MFA modül takımları (vize, pasaport, personel, konsolosluk)
bu template'i fork'layıp kendi modüllerini geliştirecek.

Daha önce React ile yapılmıştı (ReactTemplate2026). Mevcut React kodu
.reference-react/ klasörüne clone'lanmıştır (gitignore'lu, repo'ya commit
edilmez).

## DURUM

Bu repo PrimeFaces sakai-ng (Angular 21 stable + PrimeNG 21 Aura + Tailwind v4)
template'inin fork'udur. Sakai bize layout, sidebar, topbar, UIKit demoları
ve CRUD iskeleti hazır verdi. Bizim işimiz Sakai'nin demo içeriğini
temizleyip MFA paleti, manuel OIDC auth, MFA modül yapısı ve OpenShift
Docker config'i eklemek.

## İLK İŞ

1. docs/sakai-mfa-uyarlama-plani.md dosyasını oku ve 5-10 cümlelik
   özet ver. Bu dokümanı (yol haritası) takip edeceksin.
2. docs/angular-migration-plan.md dosyası TARİHSEL referanstır
   (Sakai öncesi sıfırdan v22 yaklaşımı). Sadece eski karar gerekçelerini
   öğrenmek için okuyabilirsin; uygulama yapma.
3. .reference-react/ klasörü React template'in tamamı — Angular'a port
   ederken referans olarak kullan.

## STACK — KESİN (Sakai'den miras)

- Angular 21 stable (^21) — Sakai upstream'iyle aynı. Angular 22 stable
  çıkıp Sakai geçince biz de geçeriz.
- TypeScript ~5.9.3 (Sakai default)
- PrimeNG 21.x Aura (^21.0.2)
- @primeuix/themes ^2.0.0 (PrimeNG'nin tema paketi — eski @primeng/themes)
- primeicons ^7.0.0
- Tailwind v4 (^4.1.11) + @tailwindcss/postcss + tailwindcss-primeui
- quill ^2.0.3 (PrimeNG <p-editor> peer dep — rich text editör)
- chart.js 4.4.2 (PrimeNG <p-chart> peer dep)
- Zoneless change detection (provideZonelessChangeDetection)
- Standalone components — modules YOK
- SCSS (Sakai default — inlineStyleLanguage: scss)
- Node 22 LTS veya 24

## TEMEL FELSEFE — MİNİMUM BAĞIMLILIK

Angular + PrimeNG'nin kendi içinde olan her şey kullanılır. Asla
"popüler" diye dışarıdan paket ekleme.

- Form              → Reactive Forms (built-in). Signal Forms v22'de
                      stable, biz v21'deyiz. Karmaşıklaşırsa Reactive
                      Forms zaten yeterli. NgRx/TanStack Form YOK.
- Validasyon        → Angular Validators (built-in). Zod YOK.
- API sorgu         → Angular HttpClient. Axios YOK.
- Server state      → Angular httpResource() / resource() (v21'de var).
                      TanStack Query YOK.
- Cache             → httpResource zaten cache yapar. Ek lib YOK.
- Client state      → Angular Signals (Sakai LayoutService gibi).
                      Zustand/NgRx YOK.
- Tablo             → PrimeNG <p-table>. TanStack Table YOK.
- Grafik            → PrimeNG <p-chart> (chart.js peer dep). ngx-echarts
                      veya Recharts YOK.
- Rich Text Editör  → PrimeNG <p-editor> (quill peer dep). TinyMCE,
                      CKEditor, slate, lexical YOK.
- Toast/Mesaj       → PrimeNG MessageService + <p-toast>. Sonner YOK.
- Icons             → PrimeIcons (Sakai zaten kullanıyor). Lucide YOK.
- Dialog/Drawer     → PrimeNG <p-dialog>, <p-drawer>.
- Tarih seçici      → PrimeNG <p-datepicker>.
- Tüm form input    → PrimeNG <p-select>, <p-checkbox>, <p-radiobutton>,
                      <p-toggleswitch>, <p-textarea>, <p-inputtext>.
- Change detection  → ZONELESS (Sakai zaten kullanıyor).
- Routing           → Angular Router (functional guards, loadComponent
                      lazy — Sakai zaten kullanıyor).

External paket olarak SADECE şunlar kabul (zaten Sakai'de var):
- primeng + @primeuix/themes + primeicons
- quill (PrimeNG <p-editor> peer dep)
- chart.js (PrimeNG <p-chart> peer dep)
- tailwindcss + @tailwindcss/postcss + tailwindcss-primeui

Sakai'nin defaultunda olan ama BİZE GEREKSİZ paketler (Phase 1'de
silinecek):
- primeclt (Sakai CLI tool)

## AUTH — KEYCLOAK LIB KULLANMA

MFA SSO ile bağlanılacak. keycloak-angular EKLEME, angular-oauth2-oidc
EKLEME. Kullanılacak yöntem:

- Mevcut React projesinin auth akışını referans al:
  .reference-react/src/auth/AuthSync.tsx +
  .reference-react/src/auth/auth.store.ts +
  .reference-react/src/config/auth.config.ts +
  .reference-react/src/lib/api-client.ts (interceptor)
- Aynı pattern'i Angular ile, sadece HttpClient + Router + Signals
  kullanarak kur:
  - AuthService (signal'da user + roller + token)
  - Functional CanActivateFn (login değilse SSO URL'sine redirect)
  - HttpInterceptorFn (Bearer token ekler, 401'de SSO'ya redirect)
  - Callback route (SSO'dan dönüşte token'ı parse eder)
- Sakai'nin pages/auth/login.ts dosyası sadece UI — submit'i
  hardcoded olarak '/'a yönlendiriyor. Biz bunu auth.loginRedirect()
  ile değiştireceğiz.
- Token endpoint'leri, SSO URL'leri, client ID — hepsi
  window.__ENV__ üzerinden runtime'da gelir (React template ile
  aynı pattern).

## MOCK BACKEND YOK

Backend gerçek endpoint sunacak; geliştirme sırasında staging API'ye
proxy.conf.json ile bağlanılacak (CORS bypass). json-server YOK, MSW
YOK, in-memory mock service YOK. Kütüphane sayfasında preview için
statik demo verisi inline kullanılabilir (sadece görsel örnek).

## SAKAİ'YE NE KADAR MÜDAHALE?

Hedef: MFA özelleştirmesini kendi klasörlerimize (src/app/core/,
src/app/features/, src/assets/mfa-tokens.scss) yığ. Sakai dosyalarına
minimal dokun. Bu sayede Sakai upstream'den patch çekersek çakışma
minimum olur.

Sakai dosyaları (DİKKATLİ DEĞİŞTİR — değişikliği commit mesajında
"Sakai default'tan farklılık: X" diye not düş):
- src/app/layout/component/* (özellikle app.menu.ts, app.configurator.ts,
  app.topbar.ts)
- src/app/pages/auth/login.ts (OIDC bağlama)
- src/app/pages/dashboard/ (MFA dashboard'a uyarla)
- src/app.config.ts (MfaPreset + interceptors)
- src/app.routes.ts (auth callback + guards)
- src/assets/styles.scss (mfa-tokens import)
- package.json (paket silme)

## SABİT KARARLAR — DİĞER

1. MFA paleti src/assets/mfa-tokens.scss'te CSS değişkeni
   (detay: docs/sakai-mfa-uyarlama-plani.md Bölüm 3)
2. Klasör yapısı: docs/sakai-mfa-uyarlama-plani.md Bölüm 2'de tanımlı
3. TypeScript strict — Sakai default
4. UI Türkçe, kod TR/EN serbest
5. Renk paleti:
   - Kırmızı: #DA291C (Pantone 199 C, ana renk)
   - Altın Varak: #D7AD4D (sadece tören/sertifika)
   - Gri: #53565A
   - Lacivert: #003773 (Pantone 287)
   - Koyu Lacivert: #00235A (Pantone 288)
6. Font: Helvetica system stack (Inter/Roboto/CDN font YASAK)
7. OpenShift + Docker: nginx-unprivileged port 8080, ConfigMap →
   window.__ENV__ pattern (React template'ten aynen taşınır)
8. Rich text editör için <p-editor> (Quill) kullanılır — Kütüphane
   sayfasında örneği var. MFA modüllerinde duyuru, vize başvuru notu,
   raporlama gibi yerlerde işe yarar.

## ÇALIŞMA TARZI

- Türkçe konuş. Ben Angular'ı bilmiyorum.
- Her yeni terim için (signal, inject, FormBuilder, httpResource,
  computed, definePreset, providePrimeNG, vs.) ilk kullandığında 1
  cümlelik açıklama ver.
- Kod yazmadan önce ne yapacağını kısa cümleyle söyle.
- npm install / npm run build / npm run start gibi büyük komutları
  çalıştırmadan ÖNCE bana göster, onay al.
- Eğer "şu paketi ekleyelim mi?" diye düşünüyorsan, ÖNCE şunu sor:
  "Bunu Angular veya PrimeNG'nin kendisi yapabiliyor mu?" Cevap evet
  ise ek paket EKLENMEYECEK.
- Hata aldığında çözmeden önce hatayı bana göster.
- Her phase sonunda commit at, ama ben söylemeden PUSH ETME.
- Sakai'nin bir dosyasını değiştireceksen önce mevcut halini Read'le
  oku, sonra Edit ile minimum değişiklik yap.

## İLK YAPILACAKLAR (Sırayla)

1. docs/sakai-mfa-uyarlama-plani.md dosyasını oku, 5-10 cümlelik
   özet ver.
2. Sakai durumunu doğrula:
   - package.json'a bak (gerçek versiyonlar Sakai'nin kullandığı)
   - .reference-react/ var mı kontrol et; yoksa kullanıcıya clone
     komutunu hatırlat
   - node_modules var mı? (yoksa "npm install çalıştırmamı ister
     misin?" diye sor — onay al)
3. Phase 0'ı başlat:
   - Onay alarak npm install çalıştır
   - Onay alarak npm run start çalıştır
   - Default Sakai dashboard'ı tarayıcıda doğrula (kullanıcıdan
     "evet açıldı" teyidi al)
   - Git'e "chore: initial sakai-ng baseline + docs" commit at
     (push etme)
4. Phase 1'e geçiş için onay iste; her phase sonunda
   docs/sakai-mfa-uyarlama-plani.md Bölüm 6'daki doğrulama
   listesinden ilgili maddeleri işaretle, bana raporla.

Hazırsan başla. İlk adım docs/sakai-mfa-uyarlama-plani.md'yi okumak
ve özetlemek.
```

---

## Bu Prompt'u Yapıştırdıktan Sonra Ne Olur?

Yeni Claude sırasıyla şunları yapacak:

1. **`docs/sakai-mfa-uyarlama-plani.md`'i okur** ve sana 5-10 cümlelik özet verir
2. **Sakai durumunu doğrular** — package.json, .reference-react/, node_modules kontrolü
3. **Phase 0'ı başlatır:** `npm install` için onay ister, sonra `npm run start`
4. **Default Sakai'yi tarayıcıda gör** — sen "açıldı" deyince Phase 1'e geçer
5. Adım adım ilerler; her büyük komutta onay alır

Sen sadece Türkçe cevap verirsin, Angular bilmen gerekmez.

---

## Hatırlatmalar

- Bu repo'yu (`AngularSakaiTemplate2026`) GitHub'a push etmeden önce uygun bir isim ver (örn. `frontend-starter-angular` veya `mfa-frontend-template`).
- Sakai upstream sync için: `git remote add upstream https://github.com/primefaces/sakai-ng.git`
- Eski `AngularTemplate2026` dizini artık geçersiz — silebilir veya arşivleyebilirsin (sadece `docs/` ve `.reference-react/` içeriyordu).
