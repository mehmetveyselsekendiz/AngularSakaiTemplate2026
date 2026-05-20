import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { brandColors, brandTypography, logoBackgroundRules, corporateIdentity, BrandColor, BrandColorKey } from '@/app/core/config/design-tokens';

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
                <p class="text-surface-500 m-0">{{ identity.authority }}</p>
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
                            <!-- Renk önizleme -->
                            <div class="h-20 flex items-end p-3"
                                 [style.background]="color.hex">
                                <span class="text-white text-xs font-mono font-semibold drop-shadow">
                                    {{ color.hex }}
                                </span>
                            </div>
                            <!-- Detaylar -->
                            <div class="p-4 flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold text-base">{{ color.name }}</span>
                                    <p-tag [value]="color.role" [severity]="severityOf(key)" />
                                </div>
                                <div class="text-sm text-surface-500 font-mono">{{ color.cssVar }}</div>
                                @if (color.pantone) {
                                    <div class="text-xs text-surface-400">{{ color.pantone }}</div>
                                }
                                <div class="text-xs text-surface-400">CMYK: {{ color.cmyk }}</div>
                                <p-divider styleClass="my-1" />
                                <div class="text-xs text-surface-600">{{ color.usage }}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Tipografi -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Tipografi</div>
                <div class="flex flex-col gap-4">
                    <div>
                        <div class="text-sm text-surface-500 mb-1">Font Ailesi</div>
                        <div class="font-mono text-lg">{{ typography.fontFamily }}</div>
                        <div class="text-xs text-surface-400 mt-1">{{ typography.rationale }}</div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        @for (entry of weightEntries; track entry.label) {
                            <div class="border border-surface-200 rounded-lg p-3 text-center">
                                <div class="text-2xl mb-1" [style.font-weight]="entry.value">Aa</div>
                                <div class="text-xs text-surface-500">{{ entry.label }}</div>
                                <div class="text-xs text-surface-400 font-mono">{{ entry.value }}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <!-- Logo Kullanım Kuralları -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Logo Arka Plan Kuralları</div>
                <div class="flex flex-col gap-2">
                    @for (rule of logoRules; track rule.background) {
                        <div class="flex items-center gap-3 p-3 border border-surface-200 rounded-lg">
                            <i [class]="rule.allowed ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                               class="text-xl"></i>
                            <span class="text-sm">{{ rule.background }}</span>
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
    readonly typography = brandTypography;
    readonly logoRules = logoBackgroundRules;

    readonly colorKeys = Object.keys(brandColors) as BrandColorKey[];

    readonly weightEntries = [
        { label: 'Regular', value: 400 },
        { label: 'Medium', value: 500 },
        { label: 'Semibold', value: 600 },
        { label: 'Bold', value: 700 },
    ];

    severityOf(key: BrandColorKey): 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const role = brandColors[key].semanticRole;
        if (role === 'primary') return undefined;
        if (role === 'surface') return 'secondary';
        if (role === 'contrast') return 'contrast';
        return role;
    }
}
