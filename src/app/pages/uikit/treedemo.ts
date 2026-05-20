import { Component, OnInit, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tree-demo',
    standalone: true,
    imports: [CommonModule, FormsModule, TreeModule, TreeTableModule],
    template: `
        <div class="card">
            <div class="font-semibold text-xl">Tree</div>
            <p-tree [value]="treeValue()" selectionMode="checkbox" [(selection)]="selectedTreeValue"></p-tree>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">TreeTable</div>
            <p-treetable [value]="treeTableValue()" [columns]="cols" selectionMode="checkbox" [(selectionKeys)]="selectedTreeTableValue" dataKey="key" [scrollable]="true" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header let-columns>
                    <tr>
                        <th *ngFor="let col of columns">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
                    <tr [ttRow]="rowNode" [ttSelectableRow]="rowNode">
                        <td *ngFor="let col of columns; let i = index">
                            <span class="flex items-center gap-2">
                                <p-treeTableToggler [rowNode]="rowNode" *ngIf="i === 0" />
                                <p-treeTableCheckbox [value]="rowNode" *ngIf="i === 0" />
                                {{ rowData[col.field] }}
                            </span>
                        </td>
                    </tr>
                </ng-template>
            </p-treetable>
        </div>
    `
})
export class TreeDemo implements OnInit {
    treeValue = signal<TreeNode[]>([]);

    treeTableValue = signal<TreeNode[]>([]);

    selectedTreeValue: TreeNode[] = [];

    selectedTreeTableValue = {};

    cols: any[] = [];

    ngOnInit() {
        this.treeValue.set([
            {
                key: '0',
                label: 'Belgeler',
                icon: 'pi pi-folder',
                children: [
                    {
                        key: '0-0',
                        label: 'Pasaport Başvuruları',
                        icon: 'pi pi-folder',
                        children: [
                            { key: '0-0-0', label: 'form-2024.pdf', icon: 'pi pi-file' },
                            { key: '0-0-1', label: 'rehber.docx', icon: 'pi pi-file' }
                        ]
                    },
                    { key: '0-1', label: 'Vize Dosyaları', icon: 'pi pi-folder', children: [{ key: '0-1-0', label: 'schengen-2024.pdf', icon: 'pi pi-file' }] }
                ]
            },
            { key: '1', label: 'Raporlar', icon: 'pi pi-folder', children: [{ key: '1-0', label: 'yillik-rapor-2024.xlsx', icon: 'pi pi-file' }] }
        ]);
        this.treeTableValue.set([
            {
                key: '0',
                data: { name: 'Belgeler', size: '—', type: 'Klasör' },
                children: [
                    { key: '0-0', data: { name: 'form-2024.pdf', size: '124 KB', type: 'PDF' } },
                    { key: '0-1', data: { name: 'rehber.docx', size: '89 KB', type: 'Word' } }
                ]
            },
            { key: '1', data: { name: 'Raporlar', size: '—', type: 'Klasör' }, children: [{ key: '1-0', data: { name: 'rapor-2024.xlsx', size: '512 KB', type: 'Excel' } }] }
        ]);

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];

        this.selectedTreeTableValue = {
            '0-0': {
                partialChecked: false,
                checked: true
            }
        };
    }
}
