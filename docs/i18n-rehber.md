# MFA Template — i18n Rehberi (Modül Takımları İçin)

> Bu rehber **modül takımlarına** (vize, pasaport, personel, konsolosluk) yönelik. Template'i fork'layıp kendi modülünüzü geliştirirken hangi metinleri çevirmeniz gerektiğini ve nasıl yapılacağını anlatır.

---

## 1. Politika — Ne Çevrilir, Ne Çevrilmez?

Bu template'te tüm metinler çevrilmemiştir. Politika:

| Kategori | i18n? | Sebep |
|---|---|---|
| **Modül UI metinleri** (form etiketleri, butonlar, mesajlar) | ✅ EVET | Modül son kullanıcıya gösterilir |
| **Auth shell** (login, access, error, notfound, empty) | ✅ EVET (template yapar) | Modül de bu sayfaları shipping yapar |
| **Topbar / Sidebar / Settings drawer** | ✅ EVET (template yapar) | Tüm modüllerde görünür |
| **Menü etiketleri** | ✅ EVET (template yapar) | `navigation.config.ts`'de `labelKey` |
| `/uikit/*` demo sayfaları | ❌ HAYIR | Geliştirici referansı; üretime gitmez |
| `/pages/kurumsal-kimlik` | ❌ HAYIR | İç dokümantasyon |
| `/pages/dashboard` template demosu | ✅ Karşılama + kartlar | Modül kendi dashboard'ını yazar; ama bu sayfa örnek |

**Kural:** Modülünüzün son kullanıcıya gösterilen TÜM metinleri i18n key olmalı. Demo veya iç dokümantasyon TR kalabilir.

---

## 2. Altyapı — Ne Kullanıyoruz?

**0 paket politikası.** `ngx-translate` / `@angular/localize` YASAK. Onun yerine:

- **`TranslateService`** (`src/app/core/i18n/translate.service.ts`)
  Signal-based; `SettingsService.language()` değişince otomatik yeniden yükler.
- **`TranslatePipe`** (`| t`)
  Template'te `{{ 'menu.home' | t }}` veya `{{ 'foo.bar' | t: { name: 'Ahmet' } }}`.
- **`MfaDatePipe`** (`| mfaDate`)
  Runtime locale-aware tarih (Angular built-in `date` pipe LOCALE_ID'i sonradan okumadığı için bunu kullanın).
- **`MfaCurrencyPipe`** (`| mfaCurrency`)
  Runtime locale-aware para birimi.
- **`PrimeNG.setTranslation()`**
  PrimeNG component'lerinin built-in metinleri (table empty message, calendar ay/gün isimleri vb.) `tr.json`/`en.json` içindeki `primeng.*` key'lerinden beslenir — siz dokunmazsınız.

Sözlükler: `public/i18n/tr.json`, `public/i18n/en.json` — düz JSON, `Record<string, string>`. Eager-load (uygulama başlatılırken bir HTTP isteği).

---

## 3. Modül i18n Pattern'i

### Adım 1 — Modül namespace'i seç

Modülünüze özel key'leri kendi namespace'i altında topla. Örnek:

```json
// public/i18n/tr.json
{
  "vize.list.title": "Vize Başvuruları",
  "vize.list.column.applicant": "Başvuran",
  "vize.list.column.country": "Ülke",
  "vize.list.action.detail": "Detay",
  "vize.form.applicant.required": "Başvuran adı zorunludur",
  "vize.form.country.placeholder": "Ülke seçiniz"
}
```

**Namespace kuralı:**
- `<modul>.<sayfa-veya-bilesen>.<alan>` formatı tercih edilir
- Çakışmayı önlemek için tek kelimelik modül namespace'i (`vize.`, `pasaport.`, `personel.`, `konsolosluk.`)
- `common.*` — tüm modüllere açık ortak metinler (`common.home`, ileride `common.save`, `common.cancel`)
- `menu.*` — sadece template-level menü etiketleri (siz dokunmayın; `navigation.config.ts` yönetir)

### Adım 2 — Component'te kullan

```typescript
import { Component } from '@angular/core';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';
import { MfaDatePipe } from '@/app/core/i18n/mfa-date.pipe';
import { MfaCurrencyPipe } from '@/app/core/i18n/mfa-currency.pipe';

@Component({
    selector: 'vize-list',
    standalone: true,
    imports: [TranslatePipe, MfaDatePipe, MfaCurrencyPipe /* + diğerleri */],
    template: `
        <h1>{{ 'vize.list.title' | t }}</h1>
        <p-table [value]="rows">
            <ng-template pTemplate="header">
                <tr>
                    <th>{{ 'vize.list.column.applicant' | t }}</th>
                    <th>{{ 'vize.list.column.country' | t }}</th>
                    <th>{{ 'vize.list.column.date' | t }}</th>
                    <th>{{ 'vize.list.column.fee' | t }}</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
                <tr>
                    <td>{{ row.applicant }}</td>
                    <td>{{ row.country }}</td>
                    <td>{{ row.appliedAt | mfaDate:'shortDate' }}</td>
                    <td>{{ row.fee | mfaCurrency:'TRY' }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
export class VizeList { /* ... */ }
```

### Adım 3 — Parametreli metinler

```json
{
  "vize.notify.created": "{count} başvuru oluşturuldu",
  "vize.welcome": "Hoş geldiniz, {name}"
}
```

```html
{{ 'vize.notify.created' | t: { count: total } }}
{{ 'vize.welcome' | t: { name: displayName() } }}
```

### Adım 4 — TypeScript'te programatik çeviri (toast, dialog mesajları)

```typescript
import { inject } from '@angular/core';
import { TranslateService } from '@/app/core/i18n/translate.service';
import { MessageService } from 'primeng/api';

class VizeForm {
    private t = inject(TranslateService);
    private msg = inject(MessageService);

    onSaved(id: string) {
        this.msg.add({
            severity: 'success',
            summary: this.t.t('vize.toast.saved.title'),
            detail: this.t.t('vize.toast.saved.detail', { id })
        });
    }
}
```

---

## 4. Tarih ve Para Birimi

`LOCALE_ID` Angular provider'ı bir kez okunur — runtime'da dil değişince Angular'ın built-in `| date` ve `| currency` pipe'ları **güncellenmez**. Bu yüzden:

| Yerine | Kullan |
|---|---|
| `{{ tarih \| date }}` | `{{ tarih \| mfaDate }}` |
| `{{ tarih \| date:'shortDate' }}` | `{{ tarih \| mfaDate:'shortDate' }}` |
| `{{ tutar \| currency:'TRY' }}` | `{{ tutar \| mfaCurrency:'TRY' }}` |

Bu pipe'lar `SettingsService.language()` signal'ını her değişiklikte okur — kullanıcı sayfayı reload etmeden dil geçişi düzgün görünür.

Tarih formatları: Angular'ın standart token'ları (`shortDate`, `medium`, `dd MMMM yyyy`, `EEEE, d MMMM y` vb.). Para birimi: ISO 4217 kodu (`TRY`, `EUR`, `USD`).

---

## 5. Number Pipe için Geçici Çözüm

Şu an `mfaNumber` pipe yazılmadı. İhtiyaç olursa modülünüz iki seçenekten birini kullanabilir:

1. `Intl.NumberFormat` doğrudan TS'de:
   ```typescript
   formatted = computed(() =>
       new Intl.NumberFormat(this.settings.language(), { maximumFractionDigits: 2 }).format(this.value())
   );
   ```
2. `mfaCurrency:'':'code':'1.0-0'` — para sembolünü gizleyip sadece formatlı sayı (hacky, tavsiye edilmez).

İhtiyaç yaygınsa template'e `MfaNumberPipe` eklenir; takıma bildirin.

---

## 6. Sözlük Güncelleme

Modülünüz key ekleyince **her iki dosya** da güncellenmeli:
- `public/i18n/tr.json` — Türkçe karşılık
- `public/i18n/en.json` — İngilizce karşılık

Eksik EN çevirisi varsa **key adını** EN değer olarak yaz (örn. `"vize.foo": "vize.foo"`); kullanıcı görür ki çeviri TBD. Boş string YAZMA (`""` değer döndürür, key fallback'i bozar).

### Lazy-load değerlendirmesi

Sözlük 500+ key'i geçince `TranslateService.load()` modül bazlı dilime ayrılabilir (örn. `/i18n/tr/vize.json`). Şu an template ~95 key civarı — eager-load yeterli. Modülünüz büyürse takıma bildirin.

---

## 7. Test ve Doğrulama Kontrol Listesi

Modülünüzü shipping etmeden önce:

- [ ] Tüm UI metinleri `| t` pipe veya `TranslateService.t()` ile geçer
- [ ] Hardcoded TR string YOK (`<th>Başvuran</th>` ❌ → `<th>{{ 'vize.column.applicant' | t }}</th>` ✅)
- [ ] Her TR key için EN karşılığı var
- [ ] Tarih: `| mfaDate`, Para: `| mfaCurrency` kullanılıyor (built-in `date`/`currency` değil)
- [ ] PrimeNG component'in özel metni varsa (örn. `<p-table emptyMessage="Veri yok">`) → key'le (`[emptyMessage]="'vize.list.empty' | t"`)
- [ ] Toast/dialog'larda mesajlar `TranslateService.t()` ile üretiliyor
- [ ] Browser'da TR ↔ EN switch'i tıklanınca sayfa reload olmadan tüm metinler değişiyor

---

## 8. Yasaklar Hatırlatması

CLAUDE.md §3 ve §13'ten:

- ❌ `@ngx-translate/core`, `@angular/localize` — yasaklı
- ❌ Component template'inde sabit Türkçe veya İngilizce metin — daima key kullan
- ❌ Built-in `| date` ve `| currency` pipe'ları — `| mfaDate` ve `| mfaCurrency` kullan
- ❌ Çeviri için yeni dependency

Sorularınız için: takım Slack kanalı veya `docs/sakai-mfa-uyarlama-plani.md` yol haritasına bakın.
