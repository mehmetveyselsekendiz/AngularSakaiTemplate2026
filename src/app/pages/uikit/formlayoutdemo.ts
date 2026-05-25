import { Component, inject } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-formlayout-demo',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ComponentShowcase],
    template: `<p-fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="Vertical" snippetId="formlayout-vertical" [code]="snippet('formlayout-vertical')">
                    <!-- snippet:formlayout-vertical -->
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="name1">Name</label>
                            <input pInputText id="name1" type="text" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="email1">Email</label>
                            <input pInputText id="email1" type="text" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="age1">Age</label>
                            <input pInputText id="age1" type="text" />
                        </div>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Vertical Grid" snippetId="formlayout-vertical-grid" [code]="snippet('formlayout-vertical-grid')">
                    <!-- snippet:formlayout-vertical-grid -->
                    <div class="flex flex-wrap gap-6">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">Name</label>
                            <input pInputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">Email</label>
                            <input pInputText id="email2" type="text" />
                        </div>
                    </div>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="Horizontal" snippetId="formlayout-horizontal" [code]="snippet('formlayout-horizontal')">
                    <!-- snippet:formlayout-horizontal -->
                    <div class="flex flex-col gap-4">
                        <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-2">
                            <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                            <div class="col-span-12 md:col-span-10">
                                <input pInputText id="name3" type="text" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-2">
                            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                            <div class="col-span-12 md:col-span-10">
                                <input pInputText id="email3" type="text" />
                            </div>
                        </div>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Inline" snippetId="formlayout-inline" [code]="snippet('formlayout-inline')">
                    <!-- snippet:formlayout-inline -->
                    <div class="flex flex-wrap items-start gap-6">
                        <div class="field">
                            <label for="firstname1" class="sr-only">Firstname</label>
                            <input pInputText id="firstname1" type="text" placeholder="Firstname" />
                        </div>
                        <div class="field">
                            <label for="lastname1" class="sr-only">Lastname</label>
                            <input pInputText id="lastname1" type="text" placeholder="Lastname" />
                        </div>
                        <p-button label="Submit" [fluid]="false"></p-button>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Help Text" snippetId="formlayout-help" [code]="snippet('formlayout-help')">
                    <!-- snippet:formlayout-help -->
                    <div class="flex flex-wrap gap-2">
                        <label for="username">Username</label>
                        <input pInputText id="username" type="text" />
                        <small>Enter your username to reset your password.</small>
                    </div>
                    <!-- /snippet -->
                </app-showcase>
            </div>
        </div>

        <div class="flex mt-8">
            <app-showcase title="Advanced" snippetId="formlayout-advanced" [code]="snippet('formlayout-advanced')" class="w-full">
                <!-- snippet:formlayout-advanced -->
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">Firstname</label>
                            <input pInputText id="firstname2" type="text" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Lastname</label>
                            <input pInputText id="lastname2" type="text" />
                        </div>
                    </div>

                    <div class="flex flex-wrap">
                        <label for="address">Address</label>
                        <textarea pTextarea id="address" rows="4"></textarea>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">State</label>
                            <p-select id="state" [(ngModel)]="dropdownItem" [options]="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></p-select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="zip">Zip</label>
                            <input pInputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
                <!-- /snippet -->
            </app-showcase>
        </div>
    </p-fluid>`
})
export class FormLayoutDemo {
    private readonly snippets = inject(SnippetService).forPage('formlayoutdemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    dropdownItem = null;
}
