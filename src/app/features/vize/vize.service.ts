import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import type { PaginatedResponse, VizeBasvurusu, VizeBasvurusuDto, VizeQuery } from './vize.models';

// Vize veri katmanı.
//
// Okuma (GET): httpResource() — otomatik loading/error/cache, signal'a tepki verir.
//   httpResource bir injection context'i gerektirir; bu yüzden list()/get() metotları
//   yalnızca component alan başlatıcısında (field initializer) veya constructor'da çağrılmalı.
// Yazma (POST/PUT/DELETE): HttpClient — Observable döner, component subscribe eder.
@Injectable({ providedIn: 'root' })
export class VizeService {
    private http = inject(HttpClient);
    private readonly base = '/api/vize-basvurulari';

    /** Sayfalı + filtreli liste. query signal'ı değişince otomatik yeniden çeker. */
    list(query: Signal<VizeQuery>) {
        return httpResource<PaginatedResponse<VizeBasvurusu>>(() => ({
            url: this.base,
            params: {
                page: query().page,
                pageSize: query().pageSize,
                durum: query().durum ?? '',
                arama: query().arama ?? ''
            }
        }));
    }

    /** Tek başvuru. id signal'ı değişince yeniden çeker. */
    get(id: Signal<string>) {
        return httpResource<VizeBasvurusu>(() => ({ url: `${this.base}/${id()}` }));
    }

    create(dto: VizeBasvurusuDto) {
        return this.http.post<VizeBasvurusu>(this.base, dto);
    }

    update(id: string, dto: VizeBasvurusuDto) {
        return this.http.put<VizeBasvurusu>(`${this.base}/${id}`, dto);
    }

    remove(id: string) {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}
