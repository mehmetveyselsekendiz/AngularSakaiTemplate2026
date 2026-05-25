import { Component, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

/**
 * Kurumsal bileşen vitrini — /uikit/* örneklerini sarar.
 * Kart + header (başlık + kopyala) + p-tabs (Önizleme = <ng-content>, Kod = snippet).
 * Tek-kaynak: örnek markup hem canlı render edilir hem de [code] ile gösterilir.
 * Snippet metni SnippetService → public/snippets/<sayfa>.json üzerinden gelir.
 * Sıfır-paket: syntax highlight yok (CLAUDE.md §3).
 */
@Component({
    selector: 'app-showcase',
    standalone: true,
    imports: [ButtonModule, TabsModule],
    template: `
        <div class="mfa-showcase card">
            <div class="mfa-showcase__header flex items-center justify-between gap-2">
                <span class="mfa-showcase__title font-semibold text-lg">{{ title() }}</span>
                <p-button
                    [icon]="kopyalandi() ? 'pi pi-check' : 'pi pi-copy'"
                    [label]="kopyalandi() ? 'Kopyalandı' : 'Kopyala'"
                    size="small"
                    severity="secondary"
                    [text]="true"
                    (onClick)="kopyala()"
                />
            </div>
            @if (description()) {
                <p class="mfa-showcase__desc text-sm text-muted-color mt-1 mb-0">{{ description() }}</p>
            }

            <p-tabs value="preview" class="mfa-showcase__tabs mt-3">
                <p-tablist>
                    <p-tab value="preview"><i class="pi pi-eye mr-2"></i>Önizleme</p-tab>
                    <p-tab value="code"><i class="pi pi-code mr-2"></i>Kod</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="preview">
                        <div class="mfa-showcase__preview"><ng-content /></div>
                    </p-tabpanel>
                    <p-tabpanel value="code">
                        <pre class="mfa-showcase__code rounded-border overflow-auto text-sm"><code>{{ code() }}</code></pre>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    styles: [
        `
            .mfa-showcase {
                border: 1px solid var(--mfa-border);
                background: var(--mfa-bg-elevated);
            }
            .mfa-showcase__header {
                padding-left: 0.75rem;
                border-left: 3px solid var(--mfa-brand);
            }
            .mfa-showcase__preview {
                padding-top: 0.5rem;
            }
            .mfa-showcase__code {
                margin: 0;
                padding: 0.75rem;
                background: var(--mfa-bg-muted);
                color: var(--mfa-text);
                border: 1px solid var(--mfa-border);
            }
        `
    ]
})
export class ComponentShowcase {
    readonly title = input.required<string>();
    readonly snippetId = input.required<string>();
    readonly description = input<string>('');
    readonly code = input<string>('');
    readonly kopyalandi = signal(false);

    async kopyala(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.code());
            this.kopyalandi.set(true);
            setTimeout(() => this.kopyalandi.set(false), 2000);
        } catch {
            // pano erişimi reddedilirse sessiz geç
        }
    }
}
