// ─────────────────────────────────────────────────────────────────────────────
// GELİŞTİRME-AMAÇLI MOCK — PRODUCTION'A GİTMEZ
//
// Bu interceptor YALNIZCA geliştirici modunda (SSO yapılandırılmamışken) çalışır.
// `/api/vize-basvurulari` isteklerini bellek-içi bir diziyle karşılar; böylece
// staging API olmadan da liste/ekle/düzenle/sil uçtan uca denenebilir.
//
// GERÇEK STAGING'E GEÇİŞ (modül takımları için):
//   1. Bu dosyayı silin.
//   2. app.config.ts içindeki `vizeDevDataInterceptor` kaydını kaldırın.
// Component ve servis kodu DEĞİŞMEZ — `httpResource('/api/...')` üretim deseni
// gerçek API'ye olduğu gibi bağlanır. (bkz. docs/MODULE-DEV-GUIDE.md)
// ─────────────────────────────────────────────────────────────────────────────
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { appEnv } from '@/app/core/config/app-env';
import type { PaginatedResponse, VizeBasvurusu, VizeBasvurusuDto, VizeDurum } from './vize.models';

const BASE = '/api/vize-basvurulari';
const GECIKME_MS = 350; // ağ gecikmesi taklidi — loading state görünür olsun

// Bellek-içi sentetik veri (her sayfa yenilemede sıfırlanır)
let sayac = 12;
const bugun = new Date().toISOString().slice(0, 10);

const store: VizeBasvurusu[] = [
    { id: '1', basvuruNo: 'VZ-2026-0001', adSoyad: 'Ahmet Yılmaz', uyruk: 'Almanya', vizeTipi: 'turistik', basvuruTarihi: '2026-04-02', durum: 'onaylandi', konsolosluk: 'Berlin', email: 'ahmet.yilmaz@example.com' },
    { id: '2', basvuruNo: 'VZ-2026-0002', adSoyad: 'Elena Petrova', uyruk: 'Rusya', vizeTipi: 'ticari', basvuruTarihi: '2026-04-05', durum: 'inceleniyor', konsolosluk: 'Moskova', email: 'elena.petrova@example.com' },
    { id: '3', basvuruNo: 'VZ-2026-0003', adSoyad: 'John Smith', uyruk: 'ABD', vizeTipi: 'turistik', basvuruTarihi: '2026-04-08', durum: 'beklemede', konsolosluk: 'New York' },
    { id: '4', basvuruNo: 'VZ-2026-0004', adSoyad: 'Maria Garcia', uyruk: 'İspanya', vizeTipi: 'ogrenci', basvuruTarihi: '2026-04-10', durum: 'onaylandi', konsolosluk: 'Madrid', email: 'maria.garcia@example.com' },
    { id: '5', basvuruNo: 'VZ-2026-0005', adSoyad: 'Yuki Tanaka', uyruk: 'Japonya', vizeTipi: 'calisma', basvuruTarihi: '2026-04-12', durum: 'reddedildi', konsolosluk: 'Tokyo' },
    { id: '6', basvuruNo: 'VZ-2026-0006', adSoyad: 'Liu Wei', uyruk: 'Çin', vizeTipi: 'ticari', basvuruTarihi: '2026-04-15', durum: 'inceleniyor', konsolosluk: 'Pekin', email: 'liu.wei@example.com' },
    { id: '7', basvuruNo: 'VZ-2026-0007', adSoyad: 'Fatima Al-Sayed', uyruk: 'Mısır', vizeTipi: 'turistik', basvuruTarihi: '2026-04-18', durum: 'beklemede', konsolosluk: 'Kahire' },
    { id: '8', basvuruNo: 'VZ-2026-0008', adSoyad: 'Pierre Dubois', uyruk: 'Fransa', vizeTipi: 'transit', basvuruTarihi: '2026-04-20', durum: 'onaylandi', konsolosluk: 'Paris', email: 'pierre.dubois@example.com' },
    { id: '9', basvuruNo: 'VZ-2026-0009', adSoyad: 'Anna Kowalski', uyruk: 'Polonya', vizeTipi: 'ogrenci', basvuruTarihi: '2026-04-22', durum: 'inceleniyor', konsolosluk: 'Varşova' },
    { id: '10', basvuruNo: 'VZ-2026-0010', adSoyad: 'Carlos Mendez', uyruk: 'Meksika', vizeTipi: 'ticari', basvuruTarihi: '2026-04-25', durum: 'beklemede', konsolosluk: 'Meksiko' },
    { id: '11', basvuruNo: 'VZ-2026-0011', adSoyad: 'Sofia Rossi', uyruk: 'İtalya', vizeTipi: 'turistik', basvuruTarihi: '2026-04-28', durum: 'onaylandi', konsolosluk: 'Roma', email: 'sofia.rossi@example.com' }
];

function yanit<T>(body: T, status = 200): Observable<HttpResponse<T>> {
    return of(new HttpResponse({ status, body })).pipe(delay(GECIKME_MS));
}

function hata(status: number, message: string): Observable<never> {
    return throwError(() => new HttpErrorResponse({ status, error: { message } })).pipe(delay(GECIKME_MS)) as Observable<never>;
}

function gecmisEkle(durum: VizeDurum, aciklama: string) {
    return [{ durum, tarih: bugun, aciklama }];
}

export const vizeDevDataInterceptor: HttpInterceptorFn = (req, next) => {
    // Production / staging: SSO yapılandırılmışsa hiç devreye girme
    if (appEnv.ssoUrl() || !req.url.startsWith(BASE)) {
        return next(req);
    }

    const rest = req.url.slice(BASE.length); // '' (koleksiyon) ya da '/{id}'
    const id = rest.startsWith('/') ? rest.slice(1) : '';

    // ── Koleksiyon: liste + oluştur ─────────────────────────────────────────
    if (!id) {
        if (req.method === 'GET') {
            const page = Number(req.params.get('page') ?? 0);
            const pageSize = Number(req.params.get('pageSize') ?? 10);
            const durum = (req.params.get('durum') ?? '') as VizeDurum | '';
            const arama = (req.params.get('arama') ?? '').toLocaleLowerCase('tr');

            let kayitlar = store;
            if (durum) kayitlar = kayitlar.filter((k) => k.durum === durum);
            if (arama) {
                kayitlar = kayitlar.filter((k) => [k.adSoyad, k.basvuruNo, k.uyruk, k.konsolosluk].some((alan) => alan.toLocaleLowerCase('tr').includes(arama)));
            }

            const total = kayitlar.length;
            const baslangic = page * pageSize;
            const items = kayitlar.slice(baslangic, baslangic + pageSize);
            const body: PaginatedResponse<VizeBasvurusu> = { items, total, page, pageSize };
            return yanit(body);
        }

        if (req.method === 'POST') {
            const dto = req.body as VizeBasvurusuDto;
            sayac += 1;
            const yeni: VizeBasvurusu = {
                ...dto,
                id: String(sayac),
                basvuruNo: `VZ-2026-${String(sayac).padStart(4, '0')}`,
                durumGecmisi: gecmisEkle(dto.durum, 'Başvuru oluşturuldu')
            };
            store.unshift(yeni);
            return yanit(yeni, 201);
        }
    }

    // ── Tekil kayıt: getir + güncelle + sil ─────────────────────────────────
    if (id) {
        const index = store.findIndex((k) => k.id === id);
        if (index === -1) return hata(404, 'Başvuru bulunamadı.');

        if (req.method === 'GET') {
            return yanit(store[index]);
        }

        if (req.method === 'PUT') {
            const dto = req.body as VizeBasvurusuDto;
            const mevcut = store[index];
            const durumDegisti = mevcut.durum !== dto.durum;
            const guncel: VizeBasvurusu = {
                ...mevcut,
                ...dto,
                durumGecmisi: durumDegisti ? [...(mevcut.durumGecmisi ?? []), ...gecmisEkle(dto.durum, 'Durum güncellendi')] : mevcut.durumGecmisi
            };
            store[index] = guncel;
            return yanit(guncel);
        }

        if (req.method === 'DELETE') {
            store.splice(index, 1);
            return yanit<null>(null, 204);
        }
    }

    // Eşleşmeyen method — gerçek zincire bırak (normalde olmaz)
    return next(req);
};
