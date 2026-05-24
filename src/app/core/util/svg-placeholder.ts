import { brandColors } from '@/app/core/config/design-tokens';

/**
 * Dış CDN gerektirmeyen, MFA paletinden beslenen yer-tutucu görsel üretir.
 *
 * SVG bir `data:` URI olarak gömülür; bu bağlamda CSS `var(--mfa-*)`
 * çözülmediği için hex değerleri tek yetkili kaynaktan (design-tokens.ts)
 * okunur — burada hardcode edilmez (CLAUDE.md §4).
 *
 * @param w     genişlik (px)
 * @param h     yükseklik (px)
 * @param bg    arka plan hex (varsayılan: kurumsal gri)
 * @param label ortada gösterilecek metin (boşsa metin çizilmez)
 */
export function svgPlaceholder(w: number, h: number, bg: string = brandColors.gray.hex, label = ''): string {
    const fontSize = Math.max(12, Math.floor(h / 6));
    const text = label ? `<text x="${w / 2}" y="${h / 2}" font-size="${fontSize}" text-anchor="middle" ` + `dominant-baseline="middle" fill="white" font-family="Helvetica,Arial,sans-serif">${label}</text>` : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` + `<rect width="${w}" height="${h}" fill="${bg}"/>` + text + `</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
