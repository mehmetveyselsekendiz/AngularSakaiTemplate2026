import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-panels-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        AccordionModule,
        FieldsetModule,
        MenuModule,
        InputTextModule,
        DividerModule,
        SplitterModule,
        PanelModule,
        TabsModule,
        IconFieldModule,
        InputIconModule,
        ComponentShowcase
    ],
    template: `
        <div class="flex flex-col gap-6">
            <app-showcase title="Toolbar" snippetId="panel-toolbar" [code]="snippet('panel-toolbar')">
                <!-- snippet:panel-toolbar -->
                <p-toolbar>
                    <ng-template #start>
                        <p-button icon="pi pi-plus" class="mr-2" severity="secondary" text />
                        <p-button icon="pi pi-print" class="mr-2" severity="secondary" text />
                        <p-button icon="pi pi-upload" severity="secondary" text />
                    </ng-template>

                    <ng-template #center>
                        <p-iconfield>
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText placeholder="Search" />
                        </p-iconfield>
                    </ng-template>

                    <ng-template #end><p-splitbutton label="Save" [model]="items"></p-splitbutton></ng-template>
                </p-toolbar>
                <!-- /snippet -->
            </app-showcase>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="Accordion" snippetId="panel-accordion" [code]="snippet('panel-accordion')">
                        <!-- snippet:panel-accordion -->
                        <p-accordion value="0">
                            <p-accordion-panel value="0">
                                <p-accordion-header>Header I</p-accordion-header>
                                <p-accordion-content>
                                    <p class="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                        mollit anim id est laborum.
                                    </p>
                                </p-accordion-content>
                            </p-accordion-panel>

                            <p-accordion-panel value="1">
                                <p-accordion-header>Header II</p-accordion-header>
                                <p-accordion-content>
                                    <p class="m-0">
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                                        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                                        numquam eius modi.
                                    </p>
                                </p-accordion-content>
                            </p-accordion-panel>

                            <p-accordion-panel value="2">
                                <p-accordion-header>Header III</p-accordion-header>
                                <p-accordion-content>
                                    <p class="m-0">
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                                        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                                        numquam eius modi.
                                    </p>
                                </p-accordion-content>
                            </p-accordion-panel>
                        </p-accordion>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Tabs" snippetId="panel-tabs" [code]="snippet('panel-tabs')">
                        <!-- snippet:panel-tabs -->
                        <p-tabs value="0">
                            <p-tablist>
                                <p-tab value="0">Header I</p-tab>
                                <p-tab value="1">Header II</p-tab>
                                <p-tab value="2">Header III</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="0">
                                    <p class="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                        mollit anim id est laborum.
                                    </p>
                                </p-tabpanel>
                                <p-tabpanel value="1">
                                    <p class="m-0">
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                                        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                                        numquam eius modi.
                                    </p>
                                </p-tabpanel>
                                <p-tabpanel value="2">
                                    <p class="m-0">
                                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                                        similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
                                        cumque nihil impedit quo minus.
                                    </p>
                                </p-tabpanel>
                            </p-tabpanels>
                        </p-tabs>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="Panel" snippetId="panel-panel" [code]="snippet('panel-panel')">
                        <!-- snippet:panel-panel -->
                        <p-panel header="Header" [toggleable]="true">
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        </p-panel>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Fieldset" snippetId="panel-fieldset" [code]="snippet('panel-fieldset')">
                        <!-- snippet:panel-fieldset -->
                        <p-fieldset legend="Legend" [toggleable]="true">
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        </p-fieldset>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>

            <app-showcase title="Divider" snippetId="panel-divider" [code]="snippet('panel-divider')">
                <!-- snippet:panel-divider -->
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                        <div class="flex flex-col gap-2">
                            <label for="username">Username</label>
                            <input pInputText id="username" type="text" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="password">Password</label>
                            <input pInputText id="password" type="password" />
                        </div>
                        <div class="flex">
                            <p-button label="Login" icon="pi pi-user" class="w-full max-w-[17.35rem] mx-auto"></p-button>
                        </div>
                    </div>
                    <div class="w-full md:w-2/12">
                        <p-divider layout="vertical" class="hidden! md:flex!"><b>OR</b></p-divider>
                        <p-divider layout="horizontal" class="flex! md:hidden!" align="center"><b>OR</b></p-divider>
                    </div>
                    <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                        <p-button label="Sign Up" icon="pi pi-user-plus" severity="success" class="w-full" styleClass="w-full max-w-[17.35rem] mx-auto"></p-button>
                    </div>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Splitter" snippetId="panel-splitter" [code]="snippet('panel-splitter')">
                <!-- snippet:panel-splitter -->
                <p-splitter [style]="{ height: '300px' }" [panelSizes]="[20, 80]" [minSizes]="[10, 0]" styleClass="mb-8">
                    <ng-template #panel>
                        <div class="col flex items-center justify-center">Panel 1</div>
                    </ng-template>
                    <ng-template #panel>
                        <p-splitter layout="vertical" [panelSizes]="[50, 50]">
                            <ng-template #panel>
                                <div style="grow: 1;" class="flex items-center justify-center">Panel 2</div>
                            </ng-template>
                            <ng-template #panel>
                                <p-splitter [panelSizes]="[20, 80]">
                                    <ng-template #panel>
                                        <div class="col flex items-center justify-center">Panel 3</div>
                                    </ng-template>
                                    <ng-template #panel>
                                        <div class="col flex items-center justify-center">Panel 4</div>
                                    </ng-template>
                                </p-splitter>
                            </ng-template>
                        </p-splitter>
                    </ng-template>
                </p-splitter>
                <!-- /snippet -->
            </app-showcase>
        </div>
    `
})
export class PanelsDemo {
    private readonly snippets = inject(SnippetService).forPage('panelsdemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    items: MenuItem[] = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];
}
