/**
 * T.C. Dışişleri Bakanlığı — Kurumsal Kimlik Tasarım Token'ları
 *
 * Kaynak: "Kurum Kimliği Rehberi" — Bölüm 1 Temel Öğeler
 * Bu dosya TEK DOĞRU KAYNAKTIR. Renk değişikliğinde:
 *   1. Önce mfa-tokens.scss güncellenir (CSS değişkenleri)
 *   2. theme.config.ts güncellenir (PrimeNG semantic token'ları)
 *   3. Bu dosya güncellenir (Kurumsal Kimlik sayfası otomatik yansır)
 *
 * Angular'a özgü ek alanlar: semanticRole, cssVar
 *   - PrimeNG severity eşleşmesi için kullanılır
 *   - React referansında bulunmaz
 */

// ─── RENK PALETİ ─────────────────────────────────────────────────────────────

export interface BrandColor {
    readonly name: string;
    readonly role: string;
    readonly hex: `#${string}`;
    readonly rgb: readonly [number, number, number];
    /** Tailwind v4 oklch değeri */
    readonly oklch: string;
    readonly pantone?: string;
    readonly cmyk: string;
    readonly usage: string;
    /** Angular/PrimeNG severity eşleşmesi — React referansında yok */
    readonly cssVar: string;
    readonly semanticRole: 'primary' | 'info' | 'warn' | 'danger' | 'surface' | 'contrast';
}

export const brandColors = {
    red: {
        name: 'Kırmızı',
        role: 'Ana Renk (Primary)',
        hex: '#DA291C',
        rgb: [218, 41, 28] as const,
        oklch: 'oklch(0.585 0.204 27.3)',
        pantone: '199 C',
        cmyk: '5 / 100 / 100 / 0',
        usage: 'Bakanlık genel kullanım rengi. Tüm primary action buton, link, sekme ve vurgu öğelerinde kullanılır.',
        cssVar: '--mfa-red',
        semanticRole: 'primary',
    },
    gold: {
        name: 'Altın Varak',
        role: 'Özel / Tören (Warn)',
        hex: '#D7AD4D',
        rgb: [215, 173, 77] as const,
        oklch: 'oklch(0.756 0.124 84.5)',
        cmyk: '13 / 30 / 69 / 3',
        usage: 'Sadece Bakanlık Makamı ve özel/ayrıcalıklı temsil materyallerinde. Genel UI\'da kullanılmaz; tören/sertifika tipi sayfalarda izinlidir.',
        cssVar: '--mfa-gold',
        semanticRole: 'warn',
    },
    gray: {
        name: 'Gri',
        role: 'Kurumsal Metin (Surface)',
        hex: '#53565A',
        rgb: [83, 86, 90] as const,
        oklch: 'oklch(0.457 0.010 247.8)',
        pantone: 'Cool Gray 11 C',
        cmyk: '44 / 34 / 22 / 77',
        usage: 'Kurumsal kimlik materyallerinde metin rengi. Dijital UI\'da ikincil metin (muted-foreground) olarak kullanılır.',
        cssVar: '--mfa-gray',
        semanticRole: 'surface',
    },
    navy: {
        name: 'Lacivert',
        role: 'Yardımcı Vurgu (Info)',
        hex: '#003773',
        rgb: [0, 55, 115] as const,
        oklch: 'oklch(0.332 0.119 257.9)',
        pantone: '287 C',
        cmyk: '100 / 80 / 0 / 25',
        usage: 'Yardımcı renk. Bilgi/info bileşenleri, ikincil rozetler, alternatif vurgu zeminleri.',
        cssVar: '--mfa-navy',
        semanticRole: 'info',
    },
    navyDark: {
        name: 'Koyu Lacivert',
        role: 'Yardımcı Vurgu (Kontrast)',
        hex: '#00235A',
        rgb: [0, 35, 90] as const,
        oklch: 'oklch(0.262 0.103 263.9)',
        pantone: '288 C',
        cmyk: '100 / 80 / 0 / 50',
        usage: 'Yardımcı renk. Farklılaşma gerektiren zeminler, başlık vurguları, kenar çubuğu arka planı.',
        cssVar: '--mfa-navy-dark',
        semanticRole: 'contrast',
    },
    /**
     * Angular/PrimeNG'ye özgü — resmi kimlik rehberinde BULUNMAZ.
     * Primary kırmızıdan daha soğuk/koyu bir tehlike tonu.
     * Aura tema motorunun `red` primitive paletini override etmek için gerekli.
     */
    danger: {
        name: 'Tehlike Kırmızısı',
        role: 'Tehlike (Danger) — Angular eki',
        hex: '#C81D1D',
        rgb: [200, 29, 29] as const,
        oklch: 'oklch(0.493 0.193 27.3)',
        cmyk: '0 / 85 / 85 / 22',
        usage: 'Hata mesajları, silme/iptal işlemleri, kritik uyarı. PrimeNG danger severity için tanımlanmıştır.',
        cssVar: '--mfa-danger',
        semanticRole: 'danger',
    },
} as const satisfies Record<string, BrandColor>;

export type BrandColorKey = keyof typeof brandColors;

// ─── TİPOGRAFİ ────────────────────────────────────────────────────────────────

export interface BrandTypeface {
    readonly name: string;
    readonly stack: string;
    readonly role: string;
    readonly usage: string;
    readonly medium: 'digital' | 'print';
}

export const brandTypography = {
    sans: {
        name: 'Helvetica',
        stack: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", system-ui, sans-serif',
        role: 'UI Gövde / Headings',
        usage: 'Tüm dijital arayüz metinleri. Buton, başlık, etiket, paragraf, tablo başlığı.',
        medium: 'digital',
    },
    serif: {
        name: 'Times New Roman',
        stack: '"Times New Roman", Times, "Liberation Serif", serif',
        role: 'Resmi Yazışma (Serif)',
        usage: 'Resmi yazışmalar ve tırnaklı gerektiren dijital içerikler. UI\'da yalnızca özel resmi belge görünümlerinde kullanılır.',
        medium: 'digital',
    },
} as const satisfies Record<string, BrandTypeface>;

export const printTypography = [
    { name: 'Myriad Pro', usage: 'Bakan seviyesi mataryeller, basılı/dijital içerik metinleri' },
    { name: 'Minion Pro', usage: 'İsim, unvan, başlık metni (basılı)' },
    { name: 'Snell Roundhand Bold', usage: 'Bakan makamı imzalı tebrik kartı/davetiye' },
] as const;

// ─── LOGO VARYANTLARI ─────────────────────────────────────────────────────────

export interface LogoVariant {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly minPrintHeightCm: number;
    readonly minWebHeightPx: number;
}

export const logoVariants = [
    {
        id: 'varak-amblem-logotayp-1',
        name: 'Varak Amblem Logotayp 1',
        description: 'Altın varaklı tam logo — Bakanlık Makamı.',
        minPrintHeightCm: 2.5,
        minWebHeightPx: 48,
    },
    {
        id: 'amblem-logotayp-1',
        name: 'Amblem Logotayp 1',
        description: 'Kırmızı tam amblem — Bakanlık standart kullanım.',
        minPrintHeightCm: 2.0,
        minWebHeightPx: 40,
    },
    {
        id: 'amblem-logotayp-2',
        name: 'Amblem Logotayp 2',
        description: 'Yatay küçük versiyon.',
        minPrintHeightCm: 1.5,
        minWebHeightPx: 32,
    },
    {
        id: 'amblem-logotayp-3',
        name: 'Amblem Logotayp 3',
        description: 'Alt başlıklı kompakt versiyon.',
        minPrintHeightCm: 1.5,
        minWebHeightPx: 32,
    },
    {
        id: 'amblem-logotayp-4',
        name: 'Amblem Logotayp 4',
        description: 'Yan yana versiyon — Türkiye Cumhuriyeti Dışişleri Bakanlığı.',
        minPrintHeightCm: 1.5,
        minWebHeightPx: 32,
    },
    {
        id: 'amblem-logotayp-5',
        name: 'Amblem Logotayp 5',
        description: 'Dikey kompakt versiyon.',
        minPrintHeightCm: 1.7,
        minWebHeightPx: 36,
    },
] as const satisfies readonly LogoVariant[];

// ─── ZEMİN — LOGO EŞLEŞME KURALLARI ──────────────────────────────────────────

export interface LogoBackgroundRule {
    readonly background: string;
    readonly backgroundColor: BrandColorKey | 'white' | 'black-photo';
    readonly logo: 'gold' | 'red' | 'white';
    readonly context: string;
}

export const logoBackgroundRules = [
    {
        background: 'Beyaz',
        backgroundColor: 'white' as const,
        logo: 'gold' as const,
        context: 'Bakanlık Makamı (özel temsili kullanım)',
    },
    {
        background: 'Beyaz',
        backgroundColor: 'white' as const,
        logo: 'red' as const,
        context: 'Bakanlık standart kullanım (genel)',
    },
    {
        background: 'Kırmızı',
        backgroundColor: 'red' as const,
        logo: 'white' as const,
        context: 'Bakanlık vurgulu zemin kullanım',
    },
    {
        background: 'Koyu Lacivert',
        backgroundColor: 'navyDark' as const,
        logo: 'gold' as const,
        context: 'Yardımcı renk kullanım — bakanlık temsili',
    },
    {
        background: 'Koyu Lacivert',
        backgroundColor: 'navyDark' as const,
        logo: 'white' as const,
        context: 'Yardımcı renk — alternatif',
    },
    {
        background: 'Koyu Fotoğraf Zemini',
        backgroundColor: 'black-photo' as const,
        logo: 'white' as const,
        context: 'Yüksek kontrast gerektiren görsel zeminler',
    },
] satisfies readonly LogoBackgroundRule[];

// ─── FARKLILAŞMA ALANLARI ─────────────────────────────────────────────────────

export const differentiationAreas = [
    {
        name: 'Bakanlık Makamı',
        background: 'Beyaz',
        logo: 'Altın varaklı',
        description: 'Bakanlık makamı temsilinde kullanılacak renktir.',
    },
    {
        name: 'Bakanlık',
        background: 'Kırmızı',
        logo: 'Beyaz amblem',
        description: 'Bakanlık bünyesindeki markalar, kurumlar ve kuruluşların bakanlığı temsilen kullanacağı renktir.',
    },
    {
        name: 'Bakanlık (Beyaz)',
        background: 'Beyaz',
        logo: 'Kırmızı amblem',
        description: 'Standart kurumsal kullanım — bakanlık temsili.',
    },
    {
        name: 'Yardımcı Renk',
        background: 'Koyu Lacivert',
        logo: 'Altın varaklı',
        description: 'Kamuoyu ve medyaya hitap edilen mecralarda, özgün bir görsel ifade gerektiren durumlarda kullanılacağı renktir.',
    },
] as const;

// ─── AGGREGATE ────────────────────────────────────────────────────────────────

export const corporateIdentity = {
    colors: brandColors,
    typography: brandTypography,
    printTypography,
    logoVariants,
    logoBackgroundRules,
    differentiationAreas,
    source: 'T.C. Dışişleri Bakanlığı — Kurum Kimliği Rehberi',
    lastUpdated: '2026-05-20',
} as const;

export type CorporateIdentity = typeof corporateIdentity;
