// Vize modülü — alan modeli. Modül takımları kendi modüllerinde bu deseni izler:
// arayüz + tip alias'ları + sayfalı yanıt sarmalayıcısı + sorgu/DTO tipleri.

/** Vize başvuru türü */
export type VizeTipi = 'turistik' | 'ticari' | 'ogrenci' | 'calisma' | 'transit';

/** Başvuru durumu (iş akışı) */
export type VizeDurum = 'beklemede' | 'inceleniyor' | 'onaylandi' | 'reddedildi';

/** Durum geçmişi kaydı (detay panelinde gösterilir) */
export interface DurumGecmisiKaydi {
    durum: VizeDurum;
    /** ISO tarih: YYYY-MM-DD */
    tarih: string;
    aciklama?: string;
}

/** Vize başvurusu — ana varlık */
export interface VizeBasvurusu {
    id: string;
    /** Otomatik üretilen başvuru numarası (ör. VZ-2026-0001) */
    basvuruNo: string;
    adSoyad: string;
    uyruk: string;
    vizeTipi: VizeTipi;
    /** ISO tarih: YYYY-MM-DD */
    basvuruTarihi: string;
    durum: VizeDurum;
    konsolosluk: string;
    email?: string;
    not?: string;
    durumGecmisi?: DurumGecmisiKaydi[];
}

/** Oluştur/düzenle formunun gönderdiği gövde (sunucu id/basvuruNo/geçmiş üretir) */
export type VizeBasvurusuDto = Omit<VizeBasvurusu, 'id' | 'basvuruNo' | 'durumGecmisi'>;

/** Sunucu tarafı sayfalama yanıtı — tüm liste uç noktaları bu şekli döner */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

/** Liste sorgu durumu — signal olarak tutulur, httpResource buna tepki verir */
export interface VizeQuery {
    page: number;
    pageSize: number;
    durum?: VizeDurum | '';
    arama?: string;
}

// ── Seçim listeleri (form + filtre p-select kaynakları) ──────────────────────

export const VIZE_TIPI_SECENEKLERI: { label: string; value: VizeTipi }[] = [
    { label: 'Turistik', value: 'turistik' },
    { label: 'Ticari', value: 'ticari' },
    { label: 'Öğrenci', value: 'ogrenci' },
    { label: 'Çalışma', value: 'calisma' },
    { label: 'Transit', value: 'transit' }
];

export const VIZE_DURUM_SECENEKLERI: { label: string; value: VizeDurum }[] = [
    { label: 'Beklemede', value: 'beklemede' },
    { label: 'İnceleniyor', value: 'inceleniyor' },
    { label: 'Onaylandı', value: 'onaylandi' },
    { label: 'Reddedildi', value: 'reddedildi' }
];

/** Durum → PrimeNG p-tag severity eşlemesi (MFA preset renkleri okur, hardcoded hex yok) */
export function vizeDurumSeverity(durum: VizeDurum): 'warn' | 'info' | 'success' | 'danger' {
    switch (durum) {
        case 'beklemede':
            return 'warn';
        case 'inceleniyor':
            return 'info';
        case 'onaylandi':
            return 'success';
        case 'reddedildi':
            return 'danger';
    }
}
