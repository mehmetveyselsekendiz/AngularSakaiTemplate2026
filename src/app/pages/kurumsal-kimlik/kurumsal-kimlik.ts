import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import {
    brandColors, brandTypography, printTypography,
    logoVariants, logoBackgroundRules, differentiationAreas,
    corporateIdentity, BrandColor, BrandColorKey
} from '@/app/core/config/design-tokens';

@Component({
    selector: 'app-kurumsal-kimlik',
    standalone: true,
    imports: [CommonModule, TagModule, DividerModule],
    template: `
        <div class="flex flex-col gap-6">

            <!-- Başlık -->
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-palette text-2xl" style="color: var(--mfa-red)"></i>
                    <span class="font-bold text-2xl">Kurumsal Kimlik Kılavuzu</span>
                </div>
                <p class="text-surface-500 m-0">{{ identity.source }}</p>
            </div>

            <!-- Renk Paleti -->
            <div class="card">
                <div class="font-semibold text-xl mb-1">Renk Paleti</div>
                <p class="text-surface-500 text-sm mb-4">
                    Tüm renkler <code>mfa-tokens.scss</code> CSS değişkenleri üzerinden tanımlanır.
                    Bileşenlerde hardcoded hex kullanılmaz.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    @for (key of colorKeys; track key) {
                        @let color = colors[key];
                        <div class="border border-surface-200 rounded-lg overflow-hidden">
                            <div class="h-20 flex items-end p-3" [style.background]="color.hex">
                                <span class="text-white text-xs font-mono font-semibold drop-shadow">
                                    {{ color.hex }}
                                </span>
                            </div>
                            <div class="p-4 flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold text-base">{{ color.name }}</span>
                                    <p-tag [value]="color.role" [severity]="severityOf(key)" />
                                </div>
                                <div class="text-sm text-surface-500 font-mono">{{ color.cssVar }}</div>
                                <div class="text-xs text-surface-400 font-mono">oklch: {{ color.oklch }}</div>
                                @if (color.pantone) {
                                    <div class="text-xs text-surface-400">Pantone {{ color.pantone }}</div>
                                }
                                <div class="text-xs text-surface-400">CMYK: {{ color.cmyk }}</div>
                                <p-divider styleClass="my-1" />
                                <div class="text-xs text-surface-600">{{ color.usage }}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Farkılaşma Alanları -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Farklılaşma Alanları</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    @for (area of areas; track area.name) {
                        <div class="border border-surface-200 rounded-lg p-4">
                            <div class="font-semibold mb-1">{{ area.name }}</div>
                            <div class="text-xs text-surface-500 mb-2">
                                Zemin: {{ area.background }} — Logo: {{ area.logo }}
                            </div>
                            <div class="text-xs text-surface-600">{{ area.description }}</div>
                        </div>
                    }
                </div>
            </div>

            <!-- Tipografi -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Tipografi — Dijital</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    @for (entry of typographyEntries; track entry.name) {
                        <div class="border border-surface-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-semibold">{{ entry.name }}</span>
                                <p-tag [value]="entry.role" severity="secondary" />
                            </div>
                            <div class="text-sm mb-3" [style.font-family]="entry.stack">
                                Aa Bb Cc — T.C. Dışişleri Bakanlığı
                            </div>
                            <div class="text-xs text-surface-400 font-mono">{{ entry.stack }}</div>
                            <p-divider styleClass="my-2" />
                            <div class="text-xs text-surface-600">{{ entry.usage }}</div>
                        </div>
                    }
                </div>

                <div class="font-semibold mb-3">Tipografi — Basılı Mecra</div>
                <div class="flex flex-col gap-2">
                    @for (item of printFonts; track item.name) {
                        <div class="flex items-start gap-3 p-3 border border-surface-200 rounded-lg">
                            <i class="pi pi-print text-surface-400 mt-0.5"></i>
                            <div>
                                <div class="text-sm font-semibold">{{ item.name }}</div>
                                <div class="text-xs text-surface-500">{{ item.usage }}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Logo Varyantları -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Logo Varyantları</div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    @for (variant of variants; track variant.id) {
                        <div class="border border-surface-200 rounded-lg p-4">
                            <div class="font-semibold text-sm mb-1">{{ variant.name }}</div>
                            <div class="text-xs text-surface-500 mb-2">{{ variant.description }}</div>
                            <div class="flex gap-4 text-xs text-surface-400">
                                <span>Min baskı: {{ variant.minPrintHeightCm }} cm</span>
                                <span>Min web: {{ variant.minWebHeightPx }} px</span>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Logo Zemin Kuralları -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Logo — Zemin Eşleşme Kuralları</div>
                <div class="flex flex-col gap-2">
                    @for (rule of bgRules; track rule.context) {
                        <div class="flex items-center gap-4 p-3 border border-surface-200 rounded-lg">
                            <div class="w-8 h-8 rounded border border-surface-300 shrink-0"
                                 [style.background]="bgColorOf(rule.backgroundColor)"></div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-semibold">{{ rule.context }}</div>
                                <div class="text-xs text-surface-500">
                                    Zemin: {{ rule.background }} — Logo: {{ rule.logo }}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div>
    `
})
export class KurumsalKimlik {
    readonly identity = corporateIdentity;
    readonly colors: Record<BrandColorKey, BrandColor> = brandColors;
    readonly colorKeys = Object.keys(brandColors) as BrandColorKey[];
    readonly typographyEntries = Object.values(brandTypography);
    readonly printFonts = printTypography;
    readonly variants = logoVariants;
    readonly bgRules = logoBackgroundRules;
    readonly areas = differentiationAreas;

    severityOf(key: BrandColorKey): 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const role = brandColors[key].semanticRole;
        if (role === 'primary') return undefined;
        if (role === 'surface') return 'secondary';
        if (role === 'contrast') return 'contrast';
        return role;
    }

    bgColorOf(bg: string): string {
        if (bg === 'white') return '#ffffff';
        if (bg === 'black-photo') return '#1a1a1a';
        const color = brandColors[bg as BrandColorKey];
        return color ? color.hex : '#ffffff';
    }
}
