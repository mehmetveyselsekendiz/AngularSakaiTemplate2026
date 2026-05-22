import { Pipe, PipeTransform, inject } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { SettingsService } from '@/app/core/settings/settings.service';

/**
 * Runtime locale-aware para birimi pipe'ı.
 *
 * Angular built-in `currency` pipe'ı `LOCALE_ID`'i kurulum anında okur ve
 * sonradan değişmez. Bu pipe `SettingsService.language()` signal'ını her
 * transform çağrısında okur → kullanıcı dil değiştirince sayfa reload
 * olmadan günceller (binlik/ondalık ayırıcı + sembol konumu).
 *
 * Kullanım:
 *   {{ tutar | mfaCurrency }}                       // TRY varsayılan
 *   {{ tutar | mfaCurrency:'EUR' }}
 *   {{ tutar | mfaCurrency:'USD':'symbol':'1.2-2' }}
 */
@Pipe({
    name: 'mfaCurrency',
    standalone: true,
    pure: false
})
export class MfaCurrencyPipe implements PipeTransform {
    private readonly settings = inject(SettingsService);

    transform(
        value: number | string | null | undefined,
        currencyCode: string = 'TRY',
        display: 'symbol' | 'code' | 'symbol-narrow' = 'symbol',
        digitsInfo: string = '1.2-2'
    ): string {
        if (value == null || value === '') return '';
        const numeric = typeof value === 'string' ? Number(value) : value;
        if (!Number.isFinite(numeric)) return '';
        const locale = this.settings.language();
        const symbol =
            display === 'code'
                ? currencyCode
                : getCurrencySymbol(currencyCode, display === 'symbol-narrow' ? 'narrow' : 'wide', locale);
        try {
            return formatCurrency(numeric, locale, symbol, currencyCode, digitsInfo);
        } catch {
            return String(value);
        }
    }
}
