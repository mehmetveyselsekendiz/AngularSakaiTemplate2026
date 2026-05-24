import { Component, inject } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import type { TreeNode } from 'primeng/api';
import { CodeBlock } from './code-block';
import { SnippetService } from './snippet.service';

// p-organizationchart: hiyerarşik organizasyon şeması bileşeni
const MFA_HIERARCHY: TreeNode[] = [
    {
        label: 'T.C. Dışişleri Bakanlığı',
        styleClass: 'bg-primary-600 text-white',
        expanded: true,
        children: [
            {
                label: 'Bakan Yardımcısı\n(Siyasi İşler)',
                styleClass: 'bg-primary-100',
                expanded: true,
                children: [
                    { label: 'Siyasi İşler\nGenel Müdürlüğü', styleClass: 'bg-surface-100' },
                    { label: 'Çok Taraflı Siyasi\nİşler Genel Müd.', styleClass: 'bg-surface-100' }
                ]
            },
            {
                label: 'Bakan Yardımcısı\n(Ekonomi & Konsolosluk)',
                styleClass: 'bg-primary-100',
                expanded: true,
                children: [
                    { label: 'Ekonomik İşler\nGenel Müdürlüğü', styleClass: 'bg-surface-100' },
                    { label: 'Konsolosluk İşleri\nGenel Müdürlüğü', styleClass: 'bg-surface-100' }
                ]
            }
        ]
    }
];

@Component({
    selector: 'app-hierarchy-demo',
    standalone: true,
    imports: [OrganizationChartModule, CodeBlock],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Hiyerarşi (Organization Chart)</div>
            <p class="text-muted-color mb-6">
                Organizasyonel yapıyı ağaç biçiminde görselleştirmek için
                <code>p-organizationchart</code> kullanılır.
            </p>
            <!-- snippet:hierarchy-basic -->
            <p-organizationchart [value]="data" styleClass="w-full overflow-auto" />
            <!-- /snippet -->
            <app-code-block [code]="snippet('hierarchy-basic')" />
        </div>

        <div class="card mt-4">
            <div class="font-semibold text-xl mb-4">Seçilebilir Düğümler</div>
            <p-organizationchart [value]="data" selectionMode="single" [(selection)]="selected" styleClass="w-full overflow-auto" />
            @if (selected) {
                <p class="mt-4 text-sm text-muted-color">
                    Seçili: <strong>{{ selected.label }}</strong>
                </p>
            }
        </div>
    `
})
export class HierarchyDemo {
    private readonly snippets = inject(SnippetService).forPage('hierarchydemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    readonly data = MFA_HIERARCHY;
    selected: TreeNode | null = null;
}
