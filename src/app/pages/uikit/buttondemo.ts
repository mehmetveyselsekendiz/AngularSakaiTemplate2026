import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [ButtonModule, ButtonGroupModule, SplitButtonModule, ComponentShowcase],
    template: `<div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2 flex flex-col gap-6">
            <app-showcase title="Default" snippetId="button-default" [code]="snippet('button-default')">
                <!-- snippet:button-default -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Submit"></p-button>
                    <p-button label="Disabled" [disabled]="true"></p-button>
                    <p-button label="Link" class="p-button-link" />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Severities" snippetId="button-severities" [code]="snippet('button-severities')">
                <!-- snippet:button-severities -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" />
                    <p-button label="Secondary" severity="secondary" />
                    <p-button label="Success" severity="success" />
                    <p-button label="Info" severity="info" />
                    <p-button label="Warn" severity="warn" />
                    <p-button label="Help" severity="help" />
                    <p-button label="Danger" severity="danger" />
                    <p-button label="Contrast" severity="contrast" />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Text" snippetId="button-text" [code]="snippet('button-text')">
                <!-- snippet:button-text -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" text />
                    <p-button label="Secondary" severity="secondary" text />
                    <p-button label="Success" severity="success" text />
                    <p-button label="Info" severity="info" text />
                    <p-button label="Warn" severity="warn" text />
                    <p-button label="Help" severity="help" text />
                    <p-button label="Danger" severity="danger" text />
                    <p-button label="Plain" text />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Outlined" snippetId="button-outlined" [code]="snippet('button-outlined')">
                <!-- snippet:button-outlined -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" outlined />
                    <p-button label="Secondary" severity="secondary" outlined />
                    <p-button label="Success" severity="success" outlined />
                    <p-button label="Info" severity="info" outlined />
                    <p-button label="warn" severity="warn" outlined />
                    <p-button label="Help" severity="help" outlined />
                    <p-button label="Danger" severity="danger" outlined />
                    <p-button label="Contrast" severity="contrast" outlined />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Group" snippetId="button-group" [code]="snippet('button-group')">
                <!-- snippet:button-group -->
                <div class="flex flex-wrap gap-2">
                    <p-buttongroup>
                        <p-button label="Save" icon="pi pi-check" />
                        <p-button label="Delete" icon="pi pi-trash" />
                        <p-button label="Cancel" icon="pi pi-times" />
                    </p-buttongroup>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="SplitButton" snippetId="button-split" [code]="snippet('button-split')">
                <!-- snippet:button-split -->
                <div class="flex flex-wrap gap-2">
                    <p-splitbutton label="Save" [model]="items"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="secondary"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="success"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="info"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="warn"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="help"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="danger"></p-splitbutton>
                    <p-splitbutton label="Save" [model]="items" severity="contrast"></p-splitbutton>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Templating" snippetId="button-templating" [code]="snippet('button-templating')">
                <!-- snippet:button-templating -->
                <div class="flex flex-wrap gap-2">
                    <p-button type="button">
                        <i class="pi pi-star mr-2"></i>
                        <span>Özel İçerik</span>
                    </p-button>
                    <p-button type="button" outlined severity="success">
                        <i class="pi pi-check mr-2"></i>
                        <span class="font-bold">Onaylandı</span>
                    </p-button>
                </div>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="md:w-1/2 flex flex-col gap-6">
            <app-showcase title="Icons" snippetId="button-icons" [code]="snippet('button-icons')">
                <!-- snippet:button-icons -->
                <div class="flex flex-wrap gap-2">
                    <p-button icon="pi pi-bookmark"></p-button>
                    <p-button label="Bookmark" icon="pi pi-bookmark"></p-button>
                    <p-button label="Bookmark" icon="pi pi-bookmark" iconPos="right"></p-button>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Raised" snippetId="button-raised" [code]="snippet('button-raised')">
                <!-- snippet:button-raised -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" raised />
                    <p-button label="Secondary" severity="secondary" raised />
                    <p-button label="Success" severity="success" raised />
                    <p-button label="Info" severity="info" raised />
                    <p-button label="Warn" severity="warn" raised />
                    <p-button label="Help" severity="help" raised />
                    <p-button label="Danger" severity="danger" raised />
                    <p-button label="Contrast" severity="contrast" raised />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Rounded" snippetId="button-rounded" [code]="snippet('button-rounded')">
                <!-- snippet:button-rounded -->
                <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" rounded />
                    <p-button label="Secondary" severity="secondary" rounded />
                    <p-button label="Success" severity="success" rounded />
                    <p-button label="Info" severity="info" rounded />
                    <p-button label="Warn" severity="warn" rounded />
                    <p-button label="Help" severity="help" rounded />
                    <p-button label="Danger" severity="danger" rounded />
                    <p-button label="Contrast" severity="contrast" rounded />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Rounded Icons" snippetId="button-rounded-icons" [code]="snippet('button-rounded-icons')">
                <!-- snippet:button-rounded-icons -->
                <div class="flex flex-wrap gap-2">
                    <p-button icon="pi pi-check" rounded />
                    <p-button icon="pi pi-bookmark" severity="secondary" rounded />
                    <p-button icon="pi pi-search" severity="success" rounded />
                    <p-button icon="pi pi-user" severity="info" rounded />
                    <p-button icon="pi pi-bell" severity="warn" rounded />
                    <p-button icon="pi pi-heart" severity="help" rounded />
                    <p-button icon="pi pi-times" severity="danger" rounded />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Rounded Text" snippetId="button-rounded-text" [code]="snippet('button-rounded-text')">
                <!-- snippet:button-rounded-text -->
                <div class="flex flex-wrap gap-2">
                    <p-button icon="pi pi-check" text raised rounded />
                    <p-button icon="pi pi-bookmark" severity="secondary" text raised rounded />
                    <p-button icon="pi pi-search" severity="success" text raised rounded />
                    <p-button icon="pi pi-user" severity="info" text raised rounded />
                    <p-button icon="pi pi-bell" severity="warn" text raised rounded />
                    <p-button icon="pi pi-heart" severity="help" text raised rounded />
                    <p-button icon="pi pi-times" severity="danger" text raised rounded />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Rounded Outlined" snippetId="button-rounded-outlined" [code]="snippet('button-rounded-outlined')">
                <!-- snippet:button-rounded-outlined -->
                <div class="flex flex-wrap gap-2">
                    <p-button icon="pi pi-check" rounded outlined />
                    <p-button icon="pi pi-bookmark" severity="secondary" rounded outlined />
                    <p-button icon="pi pi-search" severity="success" rounded outlined />
                    <p-button icon="pi pi-user" severity="info" rounded outlined />
                    <p-button icon="pi pi-bell" severity="warn" rounded outlined />
                    <p-button icon="pi pi-heart" severity="help" rounded outlined />
                    <p-button icon="pi pi-times" severity="danger" rounded outlined />
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Loading" snippetId="button-loading" [code]="snippet('button-loading')">
                <!-- snippet:button-loading -->
                <div class="flex flex-wrap gap-2">
                    <p-button type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="load(0)" />
                    <p-button type="button" label="Search" icon="pi pi-search" iconPos="right" [loading]="loading[1]" (click)="load(1)" />
                    <p-button type="button" styleClass="h-full" icon="pi pi-search" [loading]="loading[2]" (click)="load(2)" />
                    <p-button type="button" label="Search" [loading]="loading[3]" (click)="load(3)" />
                </div>
                <!-- /snippet -->
            </app-showcase>
        </div>
    </div> `
})
export class ButtonDemo implements OnInit {
    private readonly snippets = inject(SnippetService).forPage('buttondemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    items: MenuItem[] = [];

    loading = [false, false, false, false];

    ngOnInit() {
        this.items = [
            { label: 'Update', icon: 'pi pi-refresh' },
            { label: 'Delete', icon: 'pi pi-times' },
            { label: 'MFA Portal', icon: 'pi pi-external-link', url: 'https://www.mfa.gov.tr' },
            { separator: true },
            { label: 'Setup', icon: 'pi pi-cog' }
        ];
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
    }
}
