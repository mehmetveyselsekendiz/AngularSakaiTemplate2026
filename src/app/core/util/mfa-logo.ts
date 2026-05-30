import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * MFA Kurumsal Amblem — palet-tabanlı SVG placeholder.
 *
 * Gerçek Bakanlık amblemi gelene kadar yer tutucu. Renkler MFA paletinden
 * (`--mfa-brand` / `--mfa-brand-fg`) okunur — dark mode'da otomatik kayar,
 * hardcoded hex YOK (governance-temiz). Boyut `--mfa-logo-size` ile ayarlanır.
 *
 * Gerçek amblem geldiğinde: bu dosyadaki <svg> içeriğini değiştir (veya yerel
 * asset'e geç). Kullanan yerler (topbar, kurumsal kimlik) değişmez.
 *
 * Kullanım:
 *   <app-mfa-logo />                         tam (amblem + yazı markası)
 *   <app-mfa-logo variant="mark" />          sadece amblem
 *   <app-mfa-logo [responsive]="true" />     dar ekranda yazı markasını gizler
 */
@Component({
    selector: 'app-mfa-logo',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span class="mfa-logo" [class.mfa-logo--responsive]="responsive()">
            <svg class="mfa-logo__mark" viewBox="0 0 48 48" role="img" aria-label="T.C. Dışişleri Bakanlığı">
                <circle cx="24" cy="24" r="23" fill="var(--mfa-brand)" />
                <polygon points="24,11 27.17,19.63 36.36,19.98 29.14,25.67 31.64,34.52 24,29.4 16.36,34.52 18.86,25.67 11.64,19.98 20.83,19.63" fill="var(--mfa-brand-fg)" />
            </svg>
            @if (variant() === 'full') {
                <span class="mfa-logo__wordmark">
                    <span class="mfa-logo__title">T.C. Dışişleri Bakanlığı</span>
                    <span class="mfa-logo__subtitle">Ministry of Foreign Affairs</span>
                </span>
            }
        </span>
    `,
    styles: [
        `
            .mfa-logo {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                line-height: 1;
            }
            .mfa-logo__mark {
                width: var(--mfa-logo-size, 2rem);
                height: var(--mfa-logo-size, 2rem);
                flex: none;
            }
            .mfa-logo__wordmark {
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                min-width: 0;
            }
            .mfa-logo__title {
                font-family: var(--mfa-font-sans);
                font-size: 0.95rem;
                font-weight: 700;
                color: var(--mfa-text);
                white-space: nowrap;
            }
            .mfa-logo__subtitle {
                font-family: var(--mfa-font-sans);
                font-size: 0.6rem;
                font-weight: 500;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                color: var(--mfa-text-muted);
                white-space: nowrap;
            }
            @media (max-width: 640px) {
                .mfa-logo--responsive .mfa-logo__wordmark {
                    display: none;
                }
            }
        `
    ]
})
export class MfaLogo {
    /** 'full' = amblem + yazı markası, 'mark' = sadece amblem. */
    readonly variant = input<'full' | 'mark'>('full');
    /** true ise ≤640px'te yazı markasını gizler (amblem kalır). */
    readonly responsive = input(false);
}
