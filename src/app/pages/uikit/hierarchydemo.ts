import { Component, inject } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import type { TreeNode } from 'primeng/api';
import { ComponentShowcase } from './component-showcase';
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
    imports: [OrganizationChartModule, ComponentShowcase],
    template: `
        <div class="flex flex-col gap-6">
            <app-showcase
                title="Hiyerarşi (Organization Chart)"
                snippetId="hierarchy-basic"
                [code]="snippet('hierarchy-basic')"
                description="Organizasyonel yapıyı ağaç biçiminde görselleştirmek için p-organizationchart kullanılır."
            >
                <!-- snippet:hierarchy-basic -->
                <p-organizationchart [value]="data" styleClass="w-full overflow-auto" />
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Seçilebilir Düğümler" snippetId="hierarchy-selectable" [code]="snippet('hierarchy-selectable')">
                <!-- snippet:hierarchy-selectable -->
                <p-organizationchart [value]="data" selectionMode="single" [(selection)]="selected" styleClass="w-full overflow-auto" />
                @if (selected) {
                    <p class="mt-4 text-sm text-muted-color">
                        Seçili: <strong>{{ selected.label }}</strong>
                    </p>
                }
                <!-- /snippet -->
            </app-showcase>
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
