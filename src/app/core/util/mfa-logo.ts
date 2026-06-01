import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * MFA Kurumsal Amblem — gerçek Bakanlık amblemi.
 *
 * Amblem `public/mfa-icon.svg`'ten `<img>` ile yüklenir (göreli yol, base href
 * `/`). SVG'in kendi sabit kurumsal renkleri vardır; çok-renkli/detaylı amblem
 * olduğu için palet token'larına bağlanmaz ve dark mode'da tonal kaymaz —
 * resmi amblem her temada aynıdır. Boyut `--mfa-logo-size` ile ayarlanır.
 * Yazı markası ("T.C. Dışişleri Bakanlığı" + EN alt başlık) palet token'larından
 * beslenmeye devam eder (dark mode uyumlu).
 *
 * Amblemi değiştirmek için: yeni SVG/PNG'yi `public/`'e koy, aşağıdaki `src`'yi
 * güncelle. Kullanan yerler (topbar, kurumsal kimlik) değişmez.
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
            <img class="mfa-logo__mark" src="mfa-icon.svg" width="48" height="48" [attr.alt]="variant() === 'mark' ? 'T.C. Dışişleri Bakanlığı' : ''" [attr.aria-hidden]="variant() === 'full' ? 'true' : null" />
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
                object-fit: contain;
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
