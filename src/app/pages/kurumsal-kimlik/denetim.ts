import { afterNextRender, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

interface Swatch {
    token: string;
    value: string;
}

interface DomHexHit {
    tag: string;
    snippet: string;
}

// Canlı tarayacağımız MFA token'ları (mfa-tokens.scss)
const WATCHED_TOKENS = ['--mfa-red', '--mfa-gold', '--mfa-gray', '--mfa-navy', '--mfa-navy-dark', '--mfa-bg', '--mfa-bg-elevated', '--mfa-text', '--mfa-text-muted', '--mfa-border', '--mfa-brand', '--mfa-brand-fg'];

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;

@Component({
    selector: 'app-denetim',
    standalone: true,
    imports: [CommonModule, TagModule, DividerModule, ButtonModule, MessageModule],
    template: `
        <div class="flex flex-col gap-6">
            <!-- Başlık -->
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-shield text-2xl" style="color: var(--mfa-red)"></i>
                    <span class="font-bold text-2xl">Palet Denetimi</span>
                </div>
                <p class="text-surface-500 m-0">
                    Bu sayfa, açık olan ekranı çalışma zamanında denetler: satır-içi hex kullanımı, kurumsal token'ların canlı değerleri ve gövde fontu. Build-zamanı tam denetim için
                    <code>npm run lint:palette</code> komutu yetkili kaynaktır.
                </p>
                <div class="mt-4">
                    <p-button label="Yeniden Tara" icon="pi pi-refresh" size="small" severity="secondary" [outlined]="true" (onClick)="runAudit()" />
                </div>
            </div>

            <!-- Statik tarayıcı bilgisi -->
            <div class="card">
                <div class="font-semibold text-xl mb-1">Build-Zamanı Tarayıcı (Yetkili Kaynak)</div>
                <p class="text-surface-500 text-sm mb-4"><code>scripts/check-palette.mjs</code> — <code>src/app/**/*.ts</code> dosyalarını tarar. İhlal varsa <code>exit 1</code> döner (CI/pre-commit durur).</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    @for (rule of staticRules; track rule.code) {
                        <div class="border border-surface-200 rounded-lg p-4 flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <p-tag [value]="rule.code" severity="info" />
                                <span class="font-semibold">{{ rule.title }}</span>
                            </div>
                            <div class="text-sm text-surface-600">{{ rule.desc }}</div>
                        </div>
                    }
                </div>
                <p class="text-xs text-surface-400 mt-3">İstisna: bir satıra <code>// mfa-ignore</code> eklenirse o satır atlanır.</p>
            </div>

            <!-- Font denetimi -->
            <div class="card">
                <div class="font-semibold text-xl mb-4">Gövde Fontu</div>
                @if (fontOk()) {
                    <p-message severity="success" text="Helvetica system stack aktif." />
                } @else {
                    <p-message severity="error" text="Gövde fontu Helvetica ile başlamıyor — kurumsal font kuralı (CLAUDE.md §5) ihlal edilmiş olabilir." />
                }
                <div class="text-sm text-surface-500 font-mono mt-3 break-all">{{ fontFamily() || '—' }}</div>
            </div>

            <!-- Canlı palet token'ları -->
            <div class="card">
                <div class="font-semibold text-xl mb-1">Canlı Token Değerleri</div>
                <p class="text-surface-500 text-sm mb-4">Tema (açık/koyu) değişince alias token'lar otomatik kayar. Swatch'lar <code>var(--mfa-*)</code> okur; aşağıdaki hex metin sadece bilgilendirmedir.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    @for (s of swatches(); track s.token) {
                        <div class="border border-surface-200 rounded-lg overflow-hidden">
                            <div class="h-16" [style.background]="cssVar(s.token)"></div>
                            <div class="p-3 flex flex-col gap-1">
                                <span class="font-mono text-sm font-semibold">{{ s.token }}</span>
                                <span class="font-mono text-xs text-surface-500">{{ s.value || '(tanımsız)' }}</span>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Canlı DOM hex taraması -->
            <div class="card">
                <div class="font-semibold text-xl mb-1">Açık Ekranda Satır-İçi Hex</div>
                <p class="text-surface-500 text-sm mb-4">
                    Görüntülenen DOM'da <code>style</code> özniteliğinde hex renk barındıran öğeler. Not: renk paleti gibi swatch sayfaları renkleri kasıtlı render eder — bu liste bilgilendiricidir, yetkili karar build-zamanı tarayıcısındadır.
                </p>
                @if (domHexHits().length === 0) {
                    <p-message severity="success" text="Bu ekranda satır-içi hex bulunamadı." />
                } @else {
                    <p-message severity="warn" [text]="domHexHits().length + ' öğe satır-içi hex kullanıyor.'" />
                    <div class="mt-3 flex flex-col gap-2">
                        @for (hit of domHexHits(); track $index) {
                            <div class="border border-surface-200 rounded p-2 text-xs font-mono break-all">
                                <span class="text-surface-400">&lt;{{ hit.tag }}&gt;</span> {{ hit.snippet }}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    `
})
export class Denetim {
    readonly fontFamily = signal('');
    readonly fontOk = signal(true);
    readonly swatches = signal<Swatch[]>([]);
    readonly domHexHits = signal<DomHexHit[]>([]);

    readonly staticRules = [
        { code: 'HEX', title: 'Hardcoded hex', desc: 'Sabit hex renk yasak. var(--mfa-*) veya PrimeNG severity kullan. theme.config.ts / design-tokens.ts hariç.' },
        { code: 'TAILWIND', title: 'Sabit Tailwind renk', desc: 'Sabit Tailwind renk sınıfı (kırmızı/mavi/yeşil tonları) yasak. text-primary, surface-*, var(--mfa-*) kullan.' },
        { code: 'CDN', title: 'Harici asset', desc: 'Dış http(s) görsel/asset yasak. Yerel dosya veya data: URI kullan.' },
        { code: 'IMPORT', title: 'İzinsiz bileşen', desc: "features/** içinde /uikit/*'te gösterilmemiş PrimeNG modülü import edilemez." }
    ];

    constructor() {
        afterNextRender(() => this.runAudit());
    }

    cssVar(token: string): string {
        return `var(${token})`;
    }

    runAudit(): void {
        const root = getComputedStyle(document.documentElement);
        this.swatches.set(WATCHED_TOKENS.map((token) => ({ token, value: root.getPropertyValue(token).trim() })));

        const family = getComputedStyle(document.body).fontFamily;
        this.fontFamily.set(family);
        this.fontOk.set(/^\s*["']?helvetica/i.test(family));

        const hits: DomHexHit[] = [];
        document.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
            const style = el.getAttribute('style') ?? '';
            if (HEX_RE.test(style)) {
                hits.push({ tag: el.tagName.toLowerCase(), snippet: style.length > 90 ? style.slice(0, 90) + '…' : style });
            }
        });
        this.domHexHits.set(hits);
    }
}
