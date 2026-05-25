import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { brandColors } from '@/app/core/config/design-tokens';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputOtpModule } from 'primeng/inputotp';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CountryService } from '@/app/pages/service/country.service';
import { TreeNode } from 'primeng/api';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

interface Country {
    name: string;
    code: string;
}

@Component({
    selector: 'app-input-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        RadioButtonModule,
        SelectButtonModule,
        InputGroupModule,
        FluidModule,
        IconFieldModule,
        InputIconModule,
        FloatLabelModule,
        AutoCompleteModule,
        InputNumberModule,
        SliderModule,
        RatingModule,
        ColorPickerModule,
        KnobModule,
        SelectModule,
        DatePickerModule,
        ToggleButtonModule,
        ToggleSwitchModule,
        TreeSelectModule,
        MultiSelectModule,
        ListboxModule,
        InputGroupAddonModule,
        TextareaModule,
        PasswordModule,
        InputMaskModule,
        InputOtpModule,
        CascadeSelectModule,
        KeyFilterModule,
        ComponentShowcase
    ],
    template: ` <p-fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="InputText" snippetId="input-text" [code]="snippet('input-text')">
                    <!-- snippet:input-text -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <input pInputText type="text" placeholder="Default" />
                        <input pInputText type="text" placeholder="Disabled" [disabled]="true" />
                        <input pInputText type="text" placeholder="Invalid" class="ng-dirty ng-invalid" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Icons" snippetId="input-icons" [code]="snippet('input-icons')">
                    <!-- snippet:input-icons -->
                    <div class="flex flex-col gap-4">
                        <p-iconfield>
                            <p-inputicon class="pi pi-user" />
                            <input pInputText type="text" placeholder="Username" />
                        </p-iconfield>
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Float Label" snippetId="input-floatlabel" [code]="snippet('input-floatlabel')">
                    <!-- snippet:input-floatlabel -->
                    <p-floatlabel>
                        <input pInputText id="username" type="text" [(ngModel)]="floatValue" />
                        <label for="username">Username</label>
                    </p-floatlabel>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Textarea" snippetId="input-textarea" [code]="snippet('input-textarea')">
                    <!-- snippet:input-textarea -->
                    <textarea pTextarea placeholder="Your Message" [autoResize]="true" rows="3" cols="30"></textarea>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="AutoComplete" snippetId="input-autocomplete" [code]="snippet('input-autocomplete')">
                    <!-- snippet:input-autocomplete -->
                    <p-autocomplete [(ngModel)]="selectedAutoValue" [suggestions]="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown multiple display="chip" (completeMethod)="filterCountry($event)" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="DatePicker" snippetId="input-datepicker" [code]="snippet('input-datepicker')">
                    <!-- snippet:input-datepicker -->
                    <p-datepicker [showIcon]="true" [showButtonBar]="true" [(ngModel)]="calendarValue"></p-datepicker>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="InputNumber" snippetId="input-number" [code]="snippet('input-number')">
                    <!-- snippet:input-number -->
                    <p-inputnumber [(ngModel)]="inputNumberValue" showButtons mode="decimal"></p-inputnumber>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Slider" snippetId="input-slider" [code]="snippet('input-slider')">
                    <!-- snippet:input-slider -->
                    <div class="flex flex-col gap-4">
                        <input pInputText [(ngModel)]="sliderValue" type="number" />
                        <p-slider [(ngModel)]="sliderValue" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Rating" snippetId="input-rating" [code]="snippet('input-rating')">
                    <!-- snippet:input-rating -->
                    <p-rating [(ngModel)]="ratingValue" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="ColorPicker" snippetId="input-colorpicker" [code]="snippet('input-colorpicker')">
                    <!-- snippet:input-colorpicker -->
                    <p-colorpicker [style]="{ width: '2rem' }" [(ngModel)]="colorValue" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Knob" snippetId="input-knob" [code]="snippet('input-knob')">
                    <!-- snippet:input-knob -->
                    <p-knob [(ngModel)]="knobValue" [step]="10" [min]="-50" [max]="50" valueTemplate="{value}%" />
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="RadioButton" snippetId="input-radio" [code]="snippet('input-radio')">
                    <!-- snippet:input-radio -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center">
                            <p-radiobutton id="option1" name="option" value="Chicago" [(ngModel)]="radioValue" />
                            <label for="option1" class="leading-none ml-2">Chicago</label>
                        </div>
                        <div class="flex items-center">
                            <p-radiobutton id="option2" name="option" value="Los Angeles" [(ngModel)]="radioValue" />
                            <label for="option2" class="leading-none ml-2">Los Angeles</label>
                        </div>
                        <div class="flex items-center">
                            <p-radiobutton id="option3" name="option" value="New York" [(ngModel)]="radioValue" />
                            <label for="option3" class="leading-none ml-2">New York</label>
                        </div>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Checkbox" snippetId="input-checkbox" [code]="snippet('input-checkbox')">
                    <!-- snippet:input-checkbox -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center">
                            <p-checkbox id="checkOption1" name="option" value="Chicago" [(ngModel)]="checkboxValue" />
                            <label for="checkOption1" class="ml-2">Chicago</label>
                        </div>
                        <div class="flex items-center">
                            <p-checkbox id="checkOption2" name="option" value="Los Angeles" [(ngModel)]="checkboxValue" />
                            <label for="checkOption2" class="ml-2">Los Angeles</label>
                        </div>
                        <div class="flex items-center">
                            <p-checkbox id="checkOption3" name="option" value="New York" [(ngModel)]="checkboxValue" />
                            <label for="checkOption3" class="ml-2">New York</label>
                        </div>
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="ToggleSwitch" snippetId="input-toggleswitch" [code]="snippet('input-toggleswitch')">
                    <!-- snippet:input-toggleswitch -->
                    <p-toggleswitch [(ngModel)]="switchValue" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Listbox" snippetId="input-listbox" [code]="snippet('input-listbox')">
                    <!-- snippet:input-listbox -->
                    <p-listbox [(ngModel)]="listboxValue" [options]="listboxValues" optionLabel="name" [filter]="true" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="Select" snippetId="input-select" [code]="snippet('input-select')">
                    <!-- snippet:input-select -->
                    <p-select [(ngModel)]="dropdownValue" [options]="dropdownValues" optionLabel="name" placeholder="Select" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="MultiSelect" snippetId="input-multiselect" [code]="snippet('input-multiselect')">
                    <!-- snippet:input-multiselect -->
                    <p-multiselect [options]="multiselectCountries" [(ngModel)]="multiselectSelectedCountries" placeholder="Select Countries" optionLabel="name" display="chip" [filter]="true">
                        <ng-template #selecteditems let-countries>
                            @for (country of countries; track country.code) {
                                <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2">
                                    <span [class]="'mr-2 flag flag-' + country.code.toLowerCase()" style="width: 18px; height: 12px"></span>
                                    <div>{{ country.name }}</div>
                                </div>
                            }
                        </ng-template>
                        <ng-template #item let-country>
                            <div class="flex items-center">
                                <span [class]="'mr-2 flag flag-' + country.code.toLowerCase()" style="width: 18px; height: 12px"></span>
                                <div>{{ country.name }}</div>
                            </div>
                        </ng-template>
                    </p-multiselect>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="TreeSelect" snippetId="input-treeselect" [code]="snippet('input-treeselect')">
                    <!-- snippet:input-treeselect -->
                    <p-treeselect [(ngModel)]="selectedNode" [options]="treeSelectNodes" placeholder="Select Item"></p-treeselect>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="ToggleButton" snippetId="input-togglebutton" [code]="snippet('input-togglebutton')">
                    <!-- snippet:input-togglebutton -->
                    <p-togglebutton [(ngModel)]="toggleValue" onLabel="Yes" offLabel="No" [style]="{ width: '10em' }" />
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="SelectButton" snippetId="input-selectbutton" [code]="snippet('input-selectbutton')">
                    <!-- snippet:input-selectbutton -->
                    <p-selectbutton [(ngModel)]="selectButtonValue" [options]="selectButtonValues" optionLabel="name" />
                    <!-- /snippet -->
                </app-showcase>
            </div>
        </p-fluid>

        <p-fluid class="flex mt-8">
            <app-showcase title="InputGroup" snippetId="input-group" [code]="snippet('input-group')" class="w-full">
                <!-- snippet:input-group -->
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col md:flex-row gap-6">
                        <p-inputgroup>
                            <p-inputgroup-addon>
                                <i class="pi pi-user"></i>
                            </p-inputgroup-addon>
                            <input pInputText placeholder="Username" />
                        </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroup-addon>
                                <i class="pi pi-clock"></i>
                            </p-inputgroup-addon>
                            <p-inputgroup-addon>
                                <i class="pi pi-star-fill"></i>
                            </p-inputgroup-addon>
                            <p-inputnumber placeholder="Price" />
                            <p-inputgroup-addon>$</p-inputgroup-addon>
                            <p-inputgroup-addon>.00</p-inputgroup-addon>
                        </p-inputgroup>
                    </div>
                    <div class="flex flex-col md:flex-row gap-6">
                        <p-inputgroup>
                            <p-button label="Search" />
                            <input pInputText placeholder="Keyword" />
                        </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroup-addon>
                                <p-checkbox [(ngModel)]="inputGroupValue" [binary]="true" />
                            </p-inputgroup-addon>
                            <input pInputText placeholder="Confirm" />
                        </p-inputgroup>
                    </div>
                </div>
                <!-- /snippet -->
            </app-showcase>
        </p-fluid>

        <p-fluid class="flex flex-col md:flex-row gap-8 mt-8">
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="Password" snippetId="input-password" [code]="snippet('input-password')" description="Şifre alanı: göster/gizle (toggleMask) ve güç ölçer (feedback).">
                    <!-- snippet:input-password -->
                    <div class="flex flex-col gap-4">
                        <p-password [(ngModel)]="passwordValue" [toggleMask]="true" promptLabel="Şifre girin" weakLabel="Zayıf" mediumLabel="Orta" strongLabel="Güçlü" />
                        <p-password [(ngModel)]="passwordNoFeedback" [feedback]="false" [toggleMask]="true" placeholder="Geri bildirimsiz" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="InputMask" snippetId="input-mask" [code]="snippet('input-mask')" description="Maskeli giriş: T.C. kimlik, pasaport, telefon ve tarih desenleri.">
                    <!-- snippet:input-mask -->
                    <div class="flex flex-col gap-4">
                        <p-inputmask [(ngModel)]="kimlikNo" mask="99999999999" placeholder="T.C. Kimlik No" />
                        <p-inputmask [(ngModel)]="pasaportNo" mask="a9999999" placeholder="Pasaport No (U1234567)" />
                        <p-inputmask [(ngModel)]="telefon" mask="(0999) 999 99 99" placeholder="(0xxx) xxx xx xx" />
                        <p-inputmask [(ngModel)]="dogumTarihi" mask="99/99/9999" slotChar="gg/aa/yyyy" placeholder="GG/AA/YYYY" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="KeyFilter" snippetId="input-keyfilter" [code]="snippet('input-keyfilter')" description="Tuş kısıtı (pKeyFilter): sadece sayı, para veya harf girişine izin verir.">
                    <!-- snippet:input-keyfilter -->
                    <div class="flex flex-col gap-4">
                        <input pInputText pKeyFilter="int" placeholder="Sadece tam sayı" />
                        <input pInputText pKeyFilter="money" placeholder="Para (1.234,56)" />
                        <input pInputText pKeyFilter="alpha" placeholder="Sadece harf" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="md:w-1/2 flex flex-col gap-6">
                <app-showcase title="InputOtp" snippetId="input-otp" [code]="snippet('input-otp')" description="Tek kullanımlık kod (OTP / 2FA) girişi; maskeli ve sadece-rakam varyantları.">
                    <!-- snippet:input-otp -->
                    <div class="flex flex-col gap-4">
                        <p-inputotp [(ngModel)]="otpValue" [length]="6" />
                        <p-inputotp [(ngModel)]="otpMaskValue" [length]="4" [mask]="true" [integerOnly]="true" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>

                <app-showcase title="CascadeSelect" snippetId="input-cascadeselect" [code]="snippet('input-cascadeselect')" description="Bağımlı/hiyerarşik seçim: Ülke → Bölge → Şehir (konsolosluk seçimi gibi).">
                    <!-- snippet:input-cascadeselect -->
                    <p-cascadeselect [(ngModel)]="selectedCity" [options]="cascadeCountries" optionLabel="cname" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" placeholder="Şehir seçin" [style]="{ minWidth: '14rem' }" />
                    <!-- /snippet -->
                </app-showcase>
            </div>
        </p-fluid>`,
    providers: [CountryService]
})
export class InputDemo implements OnInit {
    private readonly snippets = inject(SnippetService).forPage('inputdemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    floatValue: any = null;

    autoValue: any[] | undefined;

    autoFilteredValue: any[] = [];

    selectedAutoValue: any = null;

    calendarValue: any = null;

    inputNumberValue: any = null;

    sliderValue: number = 50;

    ratingValue: any = null;

    colorValue: string = brandColors.red.hex;

    radioValue: any = null;

    checkboxValue: any[] = [];

    switchValue: boolean = false;

    listboxValues: any[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    listboxValue: any = null;

    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    dropdownValue: any = null;

    multiselectCountries: Country[] = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    multiselectSelectedCountries!: Country[];

    toggleValue: boolean = false;

    selectButtonValue: any = null;

    selectButtonValues: any = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

    knobValue: number = 50;

    inputGroupValue: boolean = false;

    treeSelectNodes!: TreeNode[];

    selectedNode: any = null;

    passwordValue: any = null;

    passwordNoFeedback: any = null;

    kimlikNo: any = null;

    pasaportNo: any = null;

    telefon: any = null;

    dogumTarihi: any = null;

    otpValue: any = null;

    otpMaskValue: any = null;

    selectedCity: any = null;

    cascadeCountries: any[] = [
        {
            name: 'Türkiye',
            code: 'TR',
            states: [
                {
                    name: 'Marmara',
                    cities: [
                        { cname: 'İstanbul', code: 'IST' },
                        { cname: 'Bursa', code: 'BRS' }
                    ]
                },
                {
                    name: 'İç Anadolu',
                    cities: [
                        { cname: 'Ankara', code: 'ANK' },
                        { cname: 'Konya', code: 'KON' }
                    ]
                }
            ]
        },
        {
            name: 'Almanya',
            code: 'DE',
            states: [
                {
                    name: 'Bavyera',
                    cities: [
                        { cname: 'Münih', code: 'MUC' },
                        { cname: 'Nürnberg', code: 'NUE' }
                    ]
                }
            ]
        }
    ];

    countryService = inject(CountryService);

    ngOnInit() {
        this.countryService.getCountries().then((countries) => {
            this.autoValue = countries;
        });

        this.treeSelectNodes = [
            {
                key: '0',
                label: 'Belgeler',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-inbox',
                children: [
                    {
                        key: '0-0',
                        label: 'İş',
                        data: 'Work Folder',
                        icon: 'pi pi-fw pi-cog',
                        children: [
                            { key: '0-0-0', label: 'Giderler.doc', icon: 'pi pi-fw pi-file', data: 'Expenses' },
                            { key: '0-0-1', label: 'Özgeçmiş.doc', icon: 'pi pi-fw pi-file', data: 'Resume' }
                        ]
                    },
                    { key: '0-1', label: 'Ev', data: 'Home Folder', icon: 'pi pi-fw pi-home', children: [{ key: '0-1-0', label: 'Faturalar.txt', icon: 'pi pi-fw pi-file', data: 'Invoices' }] }
                ]
            },
            { key: '1', label: 'Resimler', data: 'Pictures Folder', icon: 'pi pi-fw pi-image', children: [{ key: '1-0', label: 'logo.jpg', icon: 'pi pi-fw pi-image', data: 'Logo' }] }
        ];
    }

    filterCountry(event: AutoCompleteCompleteEvent) {
        const filtered: any[] = [];
        const query = event.query;

        for (let i = 0; i < (this.autoValue as any[]).length; i++) {
            const country = (this.autoValue as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.autoFilteredValue = filtered;
    }
}
