import { Component, inject } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabsModule } from 'primeng/tabs';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { SpeedDialModule } from 'primeng/speeddial';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-menu-demo',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TieredMenuModule,
        IconFieldModule,
        InputIconModule,
        MenuModule,
        ButtonModule,
        ContextMenuModule,
        MegaMenuModule,
        PanelMenuModule,
        TabsModule,
        MenubarModule,
        InputTextModule,
        StepperModule,
        SpeedDialModule,
        IconField,
        InputIcon,
        ComponentShowcase
    ],
    template: `
        <div class="flex flex-col gap-6">
            <app-showcase title="Menubar" snippetId="menu-menubar" [code]="snippet('menu-menubar')">
                <!-- snippet:menu-menubar -->
                <p-menubar [model]="nestedMenuItems">
                    <ng-template #end>
                        <p-iconfield>
                            <p-inputicon class="pi pi-search" />
                            <input type="text" pInputText placeholder="Search" />
                        </p-iconfield>
                    </ng-template>
                </p-menubar>
                <!-- /snippet -->
            </app-showcase>

            <app-showcase title="Breadcrumb" snippetId="menu-breadcrumb" [code]="snippet('menu-breadcrumb')">
                <!-- snippet:menu-breadcrumb -->
                <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
                <!-- /snippet -->
            </app-showcase>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2">
                    <app-showcase title="Steps" snippetId="menu-steps" [code]="snippet('menu-steps')">
                        <!-- snippet:menu-steps -->
                        <p-stepper [value]="1">
                            <p-step-list>
                                <p-step [value]="1">Header I</p-step>
                                <p-step [value]="2">Header II</p-step>
                                <p-step [value]="3">Header III</p-step>
                            </p-step-list>
                        </p-stepper>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/2">
                    <app-showcase title="TabMenu" snippetId="menu-tabmenu" [code]="snippet('menu-tabmenu')">
                        <!-- snippet:menu-tabmenu -->
                        <p-tabs [value]="0">
                            <p-tablist>
                                <p-tab [value]="0">Header I</p-tab>
                                <p-tab [value]="1">Header II</p-tab>
                                <p-tab [value]="2">Header III</p-tab>
                            </p-tablist>
                        </p-tabs>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/3">
                    <app-showcase title="Tiered Menu" snippetId="menu-tiered" [code]="snippet('menu-tiered')">
                        <!-- snippet:menu-tiered -->
                        <p-tieredmenu [model]="tieredMenuItems"></p-tieredmenu>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/3">
                    <app-showcase title="Plain Menu" snippetId="menu-plain" [code]="snippet('menu-plain')">
                        <!-- snippet:menu-plain -->
                        <p-menu [model]="menuItems"></p-menu>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/3 flex flex-col gap-6">
                    <app-showcase title="Overlay Menu" snippetId="menu-overlay" [code]="snippet('menu-overlay')">
                        <!-- snippet:menu-overlay -->
                        <p-menu #menu [popup]="true" [model]="overlayMenuItems"></p-menu>
                        <button type="button" pButton icon="pi pi-chevron-down" label="Options" (click)="menu.toggle($event)" style="width:auto"></button>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Context Menu" snippetId="menu-context" [code]="snippet('menu-context')">
                        <!-- snippet:menu-context -->
                        <div #anchor>
                            Right click to display.
                            <p-contextmenu [target]="anchor" [model]="contextMenuItems"></p-contextmenu>
                        </div>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="MegaMenu | Horizontal" snippetId="menu-megamenu-h" [code]="snippet('menu-megamenu-h')">
                        <!-- snippet:menu-megamenu-h -->
                        <p-megamenu [model]="megaMenuItems" />
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="MegaMenu | Vertical" snippetId="menu-megamenu-v" [code]="snippet('menu-megamenu-v')">
                        <!-- snippet:menu-megamenu-v -->
                        <p-megamenu [model]="megaMenuItems" orientation="vertical" />
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/2">
                    <app-showcase title="PanelMenu" snippetId="menu-panelmenu" [code]="snippet('menu-panelmenu')">
                        <!-- snippet:menu-panelmenu -->
                        <p-panelmenu [model]="panelMenuItems" />
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2">
                    <app-showcase title="SpeedDial" snippetId="menu-speeddial" [code]="snippet('menu-speeddial')" description="Yüzen aksiyon düğmesi (FAB) — sık kullanılan eylemleri tek noktada toplar.">
                        <!-- snippet:menu-speeddial -->
                        <div class="relative" style="height: 200px">
                            <p-speeddial [model]="speedDialItems" direction="up" [style]="{ position: 'absolute', right: 0, bottom: 0 }" />
                        </div>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>
        </div>
    `
})
export class MenuDemo {
    private readonly snippets = inject(SnippetService).forPage('menudemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    speedDialItems = [
        { icon: 'pi pi-pencil', tooltipOptions: { tooltipLabel: 'Düzenle' } },
        { icon: 'pi pi-refresh', tooltipOptions: { tooltipLabel: 'Yenile' } },
        { icon: 'pi pi-trash', tooltipOptions: { tooltipLabel: 'Sil' } },
        { icon: 'pi pi-upload', tooltipOptions: { tooltipLabel: 'Dışa Aktar' } }
    ];

    nestedMenuItems = [
        {
            label: 'Customers',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Duplicate',
                            icon: 'pi pi-fw pi-copy'
                        }
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipments',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass'
                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker'
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil'
                }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog'
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file'
                }
            ]
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-sign-out'
        }
    ];
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
    tieredMenuItems = [
        {
            label: 'Customers',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Duplicate',
                            icon: 'pi pi-fw pi-copy'
                        }
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipments',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass'
                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker'
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil'
                }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog'
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file'
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-sign-out'
        }
    ];
    overlayMenuItems = [
        {
            label: 'Save',
            icon: 'pi pi-save'
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            separator: true
        },
        {
            label: 'Home',
            icon: 'pi pi-home'
        }
    ];
    menuItems = [
        {
            label: 'Customers',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus'
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        }
    ];
    contextMenuItems = [
        {
            label: 'Save',
            icon: 'pi pi-save'
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            separator: true
        },
        {
            label: 'Options',
            icon: 'pi pi-cog'
        }
    ];
    megaMenuItems = [
        {
            label: 'Fashion',
            icon: 'pi pi-fw pi-tag',
            items: [
                [
                    {
                        label: 'Woman',
                        items: [{ label: 'Woman Item' }, { label: 'Woman Item' }, { label: 'Woman Item' }]
                    },
                    {
                        label: 'Men',
                        items: [{ label: 'Men Item' }, { label: 'Men Item' }, { label: 'Men Item' }]
                    }
                ],
                [
                    {
                        label: 'Kids',
                        items: [{ label: 'Kids Item' }, { label: 'Kids Item' }]
                    },
                    {
                        label: 'Luggage',
                        items: [{ label: 'Luggage Item' }, { label: 'Luggage Item' }, { label: 'Luggage Item' }]
                    }
                ]
            ]
        },
        {
            label: 'Electronics',
            icon: 'pi pi-fw pi-desktop',
            items: [
                [
                    {
                        label: 'Computer',
                        items: [{ label: 'Computer Item' }, { label: 'Computer Item' }]
                    },
                    {
                        label: 'Camcorder',
                        items: [{ label: 'Camcorder Item' }, { label: 'Camcorder Item' }, { label: 'Camcorder Item' }]
                    }
                ],
                [
                    {
                        label: 'TV',
                        items: [{ label: 'TV Item' }, { label: 'TV Item' }]
                    },
                    {
                        label: 'Audio',
                        items: [{ label: 'Audio Item' }, { label: 'Audio Item' }, { label: 'Audio Item' }]
                    }
                ],
                [
                    {
                        label: 'Sports.7',
                        items: [{ label: 'Sports.7.1' }, { label: 'Sports.7.2' }]
                    }
                ]
            ]
        },
        {
            label: 'Furniture',
            icon: 'pi pi-fw pi-image',
            items: [
                [
                    {
                        label: 'Living Room',
                        items: [{ label: 'Living Room Item' }, { label: 'Living Room Item' }]
                    },
                    {
                        label: 'Kitchen',
                        items: [{ label: 'Kitchen Item' }, { label: 'Kitchen Item' }, { label: 'Kitchen Item' }]
                    }
                ],
                [
                    {
                        label: 'Bedroom',
                        items: [{ label: 'Bedroom Item' }, { label: 'Bedroom Item' }]
                    },
                    {
                        label: 'Outdoor',
                        items: [{ label: 'Outdoor Item' }, { label: 'Outdoor Item' }, { label: 'Outdoor Item' }]
                    }
                ]
            ]
        },
        {
            label: 'Sports',
            icon: 'pi pi-fw pi-star',
            items: [
                [
                    {
                        label: 'Basketball',
                        items: [{ label: 'Basketball Item' }, { label: 'Basketball Item' }]
                    },
                    {
                        label: 'Football',
                        items: [{ label: 'Football Item' }, { label: 'Football Item' }, { label: 'Football Item' }]
                    }
                ],
                [
                    {
                        label: 'Tennis',
                        items: [{ label: 'Tennis Item' }, { label: 'Tennis Item' }]
                    }
                ]
            ]
        }
    ];
    panelMenuItems = [
        {
            label: 'Customers',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Duplicate',
                            icon: 'pi pi-fw pi-copy'
                        }
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipments',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass'
                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker'
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil'
                }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog'
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file'
                }
            ]
        }
    ];
}
