// Kurumsal kimlik — TEK KAYNAK
// Renk değişikliği SADECE mfa-tokens.scss + burası güncellenir.
// Bu dosya Kurumsal Kimlik sayfası ve Kütüphane sayfası tarafından tüketilir.

export interface BrandColor {
    readonly name: string;
    readonly nameEn: string;
    readonly role: string;
    readonly hex: string;
    readonly rgb: readonly [number, number, number];
    readonly pantone?: string;
    readonly cmyk: string;
    readonly usage: string;
    readonly cssVar: string;
    readonly semanticRole: 'primary' | 'info' | 'warn' | 'danger' | 'surface' | 'contrast';
}

export const brandColors = {
    red: {
        name: 'Kırmızı',
        nameEn: 'Red',
        role: 'Ana renk (Primary)',
        hex: '#DA291C',
        rgb: [218, 41, 28] as const,
        pantone: 'Pantone 199 C',
        cmyk: 'C0 M81 Y87 K15',
        usage: 'Başlık, CTA buton, aktif navigasyon, birincil eleman',
        cssVar: '--mfa-red',
        semanticRole: 'primary',
    },
    navy: {
        name: 'Lacivert',
        nameEn: 'Navy',
        role: 'Bilgi (Info)',
        hex: '#003773',
        rgb: [0, 55, 115] as const,
        pantone: 'Pantone 287 C',
        cmyk: 'C100 M52 Y0 K55',
        usage: 'Bilgi mesajları, ikincil eylem, bağlantı rengi',
        cssVar: '--mfa-navy',
        semanticRole: 'info',
    },
    navyDark: {
        name: 'Koyu Lacivert',
        nameEn: 'Navy Dark',
        role: 'Kontrast / Kenar Çubuğu',
        hex: '#00235A',
        rgb: [0, 35, 90] as const,
        pantone: 'Pantone 288 C',
        cmyk: 'C100 M61 Y0 K65',
        usage: 'Kenar çubuğu arka planı, yüksek kontrast başlık',
        cssVar: '--mfa-navy-dark',
        semanticRole: 'contrast',
    },
    gold: {
        name: 'Altın Varak',
        nameEn: 'Gold',
        role: 'Uyarı (Warn) / Törensel',
        hex: '#D7AD4D',
        rgb: [215, 173, 77] as const,
        cmyk: 'C0 M19 Y64 K16',
        usage: 'Uyarı mesajları, sertifika ve tören materyalleri',
        cssVar: '--mfa-gold',
        semanticRole: 'warn',
    },
    danger: {
        name: 'Tehlike Kırmızısı',
        nameEn: 'Danger Red',
        role: 'Tehlike (Danger)',
        hex: '#C81D1D',
        rgb: [200, 29, 29] as const,
        cmyk: 'C0 M85 Y85 K22',
        usage: 'Hata mesajları, silme/iptal işlemleri, kritik uyarı',
        cssVar: '--mfa-danger',
        semanticRole: 'danger',
    },
    gray: {
        name: 'Gri',
        nameEn: 'Gray',
        role: 'Yüzey Tabanı (Surface)',
        hex: '#53565A',
        rgb: [83, 86, 90] as const,
        pantone: 'Pantone Cool Gray 10 C',
        cmyk: 'C0 M0 Y0 K65',
        usage: 'Nötr metin, kenarlık, devre dışı durum',
        cssVar: '--mfa-gray',
        semanticRole: 'surface',
    },
} as const satisfies Record<string, BrandColor>;

export type BrandColorKey = keyof typeof brandColors;

export const brandTypography = {
    fontFamily: 'Helvetica, Arial, sans-serif',
    rationale: 'Kurumsal güvenlik ve offline kullanım — CDN font yasak',
    weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const;

export const logoBackgroundRules = [
    { background: 'Beyaz (#FFFFFF)', allowed: true },
    { background: 'Lacivert (#003773)', allowed: true },
    { background: 'Koyu Lacivert (#00235A)', allowed: true },
    { background: 'Diğer renkli arka planlar', allowed: false },
] as const;

export const corporateIdentity = {
    colors: brandColors,
    typography: brandTypography,
    logoRules: logoBackgroundRules,
    lastUpdated: '2026-05-20',
    authority: 'T.C. Dışişleri Bakanlığı Kurumsal Kimlik Kılavuzu',
} as const;
