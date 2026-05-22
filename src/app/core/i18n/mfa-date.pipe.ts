import { Pipe, PipeTransform, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { SettingsService } from '@/app/core/settings/settings.service';

/**
 * Runtime locale-aware tarih pipe'ı.
 *
 * Angular built-in `date` pipe'ı `LOCALE_ID`'i kurulum anında okur ve sonradan
 * değişmez. Bu pipe `SettingsService.language()` signal'ını her transform
 * çağrısında okur → kullanıcı dil değiştirince sayfa reload olmadan günceller.
 *
 * Kullanım:
 *   {{ tarih | mfaDate }}                  // medium format
 *   {{ tarih | mfaDate:'shortDate' }}
 *   {{ tarih | mfaDate:'dd MMMM yyyy' }}
 */
@Pipe({
    name: 'mfaDate',
    standalone: true,
    pure: false
})
export class MfaDatePipe implements PipeTransform {
    private readonly settings = inject(SettingsService);

    transform(value: Date | string | number | null | undefined, format: string = 'medium', timezone?: string): string {
        if (value == null || value === '') return '';
        const locale = this.settings.language();
        try {
            return formatDate(value, format, locale, timezone);
        } catch {
            return String(value);
        }
    }
}
