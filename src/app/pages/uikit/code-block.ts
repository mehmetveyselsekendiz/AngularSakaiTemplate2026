import { Component, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/**
 * "Kodu Göster/Gizle" + "Kopyala" — /uikit/* demo örneklerinin altında kullanılır.
 * Snippet metnini [code] ile alır (SnippetService → public/snippets/*.json).
 * Syntax highlight YOK (paket gerektirir, CLAUDE.md §3 sıfır-paket).
 */
@Component({
    selector: 'app-code-block',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="mt-3">
            <div class="flex flex-wrap gap-2">
                <p-button [label]="acik() ? 'Kodu Gizle' : 'Kodu Göster'" [icon]="acik() ? 'pi pi-eye-slash' : 'pi pi-code'" size="small" severity="secondary" [text]="true" (onClick)="acik.set(!acik())" />
                @if (acik()) {
                    <p-button [label]="kopyalandi() ? 'Kopyalandı' : 'Kopyala'" [icon]="kopyalandi() ? 'pi pi-check' : 'pi pi-copy'" size="small" severity="secondary" [outlined]="true" (onClick)="kopyala()" />
                }
            </div>
            @if (acik()) {
                <pre
                    class="mt-2 p-3 rounded-border overflow-auto text-sm border border-surface"
                    style="background: var(--mfa-bg-muted); color: var(--mfa-text)"
                ><code>{{ code() }}</code></pre>
            }
        </div>
    `
})
export class CodeBlock {
    readonly code = input.required<string>();
    readonly acik = signal(false);
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
