import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { MeterGroupModule } from 'primeng/metergroup';
import { InplaceModule } from 'primeng/inplace';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { svgPlaceholder } from '@/app/core/util/svg-placeholder';
import { brandColors } from '@/app/core/config/design-tokens';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-misc-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        BlockUIModule,
        MeterGroupModule,
        InplaceModule,
        PanelModule,
        InputTextModule,
        BadgeModule,
        AvatarModule,
        ScrollPanelModule,
        TagModule,
        ChipModule,
        ButtonModule,
        SkeletonModule,
        AvatarGroupModule,
        ScrollTopModule,
        OverlayBadgeModule,
        ComponentShowcase
    ],
    template: `
        <div class="flex flex-col gap-6">
            <app-showcase title="ProgressBar" snippetId="misc-progressbar" [code]="snippet('misc-progressbar')">
                <!-- snippet:misc-progressbar -->
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="md:w-1/2">
                        <p-progressbar [value]="value" [showValue]="true"></p-progressbar>
                    </div>
                    <div class="md:w-1/2">
                        <p-progressbar [value]="50" [showValue]="false"></p-progressbar>
                    </div>
                </div>
                <!-- /snippet -->
            </app-showcase>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="Badge" snippetId="misc-badge" [code]="snippet('misc-badge')">
                        <!-- snippet:misc-badge -->
                        <div class="flex gap-2">
                            <p-badge value="2"></p-badge>
                            <p-badge value="8" severity="success"></p-badge>
                            <p-badge value="4" severity="info"></p-badge>
                            <p-badge value="12" severity="warn"></p-badge>
                            <p-badge value="3" severity="danger"></p-badge>
                        </div>

                        <div class="font-semibold my-4">Overlay</div>
                        <div class="flex gap-6">
                            <p-overlaybadge value="2">
                                <i class="pi pi-bell" style="font-size: 2rem"></i>
                            </p-overlaybadge>
                            <p-overlaybadge value="4" severity="danger">
                                <i class="pi pi-calendar" style="font-size: 2rem"></i>
                            </p-overlaybadge>
                            <p-overlaybadge severity="danger">
                                <i class="pi pi-envelope" style="font-size: 2rem"></i>
                            </p-overlaybadge>
                        </div>

                        <div class="font-semibold my-4">Button</div>
                        <div class="flex gap-2">
                            <p-button label="Emails" badge="8"></p-button>
                            <p-button label="Messages" icon="pi pi-users" severity="warn" badge="8" badgeSeverity="danger"></p-button>
                        </div>

                        <div class="font-semibold my-4">Sizes</div>
                        <div class="flex items-start gap-2">
                            <p-badge [value]="2"></p-badge>
                            <p-badge [value]="4" badgeSize="large" severity="warn"></p-badge>
                            <p-badge [value]="6" badgeSize="xlarge" severity="success"></p-badge>
                        </div>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Avatar" snippetId="misc-avatar" [code]="snippet('misc-avatar')">
                        <!-- snippet:misc-avatar -->
                        <div class="font-semibold mb-4">Group</div>
                        <p-avatargroup styleClass="mb-4">
                            <p-avatar [image]="avatarImage('AE')" size="large" shape="circle"></p-avatar>
                            <p-avatar [image]="avatarImage('AJ')" size="large" shape="circle"></p-avatar>
                            <p-avatar [image]="avatarImage('OL')" size="large" shape="circle"></p-avatar>
                            <p-avatar [image]="avatarImage('IB')" size="large" shape="circle"></p-avatar>
                            <p-avatar [image]="avatarImage('XF')" size="large" shape="circle"></p-avatar>
                            <p-avatar label="+2" shape="circle" size="large" [style]="{ 'background-color': 'var(--mfa-navy-dark)', color: 'var(--mfa-surface-0)' }"></p-avatar>
                        </p-avatargroup>

                        <div class="font-semibold my-4">Label - Circle</div>
                        <p-avatar class="mr-2" label="P" size="xlarge" shape="circle"></p-avatar>
                        <p-avatar class="mr-2" label="V" size="large" [style]="{ 'background-color': 'var(--mfa-navy)', color: 'var(--mfa-surface-0)' }" shape="circle"></p-avatar>
                        <p-avatar class="mr-2" label="U" [style]="{ 'background-color': 'var(--mfa-navy-dark)', color: 'var(--mfa-surface-0)' }" shape="circle"></p-avatar>

                        <div class="font-semibold my-4">Icon - Badge</div>
                        <p-overlaybadge value="4" severity="danger" class="inline-flex">
                            <p-avatar label="U" size="xlarge" />
                        </p-overlaybadge>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Skeleton" snippetId="misc-skeleton" [code]="snippet('misc-skeleton')">
                        <!-- snippet:misc-skeleton -->
                        <div class="rounded-border border border-surface p-6">
                            <div class="flex mb-4">
                                <p-skeleton shape="circle" size="4rem" styleClass="mr-2"></p-skeleton>
                                <div>
                                    <p-skeleton width="10rem" styleClass="mb-2"></p-skeleton>
                                    <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                                    <p-skeleton height=".5rem"></p-skeleton>
                                </div>
                            </div>
                            <p-skeleton width="100%" height="150px"></p-skeleton>
                            <div class="flex justify-between mt-4">
                                <p-skeleton width="4rem" height="2rem"></p-skeleton>
                                <p-skeleton width="4rem" height="2rem"></p-skeleton>
                            </div>
                        </div>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="Tag" snippetId="misc-tag" [code]="snippet('misc-tag')">
                        <!-- snippet:misc-tag -->
                        <div class="font-semibold mb-4">Default</div>
                        <div class="flex gap-2">
                            <p-tag value="Primary"></p-tag>
                            <p-tag severity="success" value="Success"></p-tag>
                            <p-tag severity="info" value="Info"></p-tag>
                            <p-tag severity="warn" value="Warning"></p-tag>
                            <p-tag severity="danger" value="Danger"></p-tag>
                        </div>

                        <div class="font-semibold my-4">Pills</div>
                        <div class="flex gap-2">
                            <p-tag value="Primary" [rounded]="true"></p-tag>
                            <p-tag severity="success" value="Success" [rounded]="true"></p-tag>
                            <p-tag severity="info" value="Info" [rounded]="true"></p-tag>
                            <p-tag severity="warn" value="Warning" [rounded]="true"></p-tag>
                            <p-tag severity="danger" value="Danger" [rounded]="true"></p-tag>
                        </div>

                        <div class="font-semibold my-4">Icons</div>
                        <div class="flex gap-2">
                            <p-tag icon="pi pi-user" value="Primary"></p-tag>
                            <p-tag icon="pi pi-check" severity="success" value="Success"></p-tag>
                            <p-tag icon="pi pi-info-circle" severity="info" value="Info"></p-tag>
                            <p-tag icon="pi pi-exclamation-triangle" severity="warn" value="Warning"></p-tag>
                            <p-tag icon="pi pi-times" severity="danger" value="Danger"></p-tag>
                        </div>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Chip" snippetId="misc-chip" [code]="snippet('misc-chip')">
                        <!-- snippet:misc-chip -->
                        <div class="font-semibold mb-4">Basic</div>
                        <div class="flex items-center flex-col sm:flex-row">
                            <p-chip label="Action" styleClass="m-1"></p-chip>
                            <p-chip label="Comedy" styleClass="m-1"></p-chip>
                            <p-chip label="Mystery" styleClass="m-1"></p-chip>
                            <p-chip label="Thriller" styleClass="m-1" [removable]="true"></p-chip>
                        </div>

                        <div class="font-semibold my-4">Icon</div>
                        <div class="flex items-center flex-col sm:flex-row">
                            <p-chip label="Apple" icon="pi pi-apple" styleClass="m-1"></p-chip>
                            <p-chip label="Facebook" icon="pi pi-facebook" styleClass="m-1"></p-chip>
                            <p-chip label="Google" icon="pi pi-google" styleClass="m-1"></p-chip>
                            <p-chip label="Microsoft" icon="pi pi-microsoft" styleClass="m-1" [removable]="true"></p-chip>
                        </div>

                        <div class="font-semibold my-4">Image</div>
                        <div class="flex items-center flex-col sm:flex-row">
                            <p-chip label="Amy Elsner" [image]="avatarImage('AE')" styleClass="m-1"></p-chip>
                            <p-chip label="Asiya Javayant" [image]="avatarImage('AJ')" styleClass="m-1"></p-chip>
                            <p-chip label="Onyama Limba" [image]="avatarImage('OL')" styleClass="m-1"></p-chip>
                            <p-chip label="Xuxue Feng" [image]="avatarImage('XF')" styleClass="m-1" [removable]="true"></p-chip>
                        </div>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="ProgressSpinner" snippetId="misc-progressspinner" [code]="snippet('misc-progressspinner')" description="Belirsiz süreli yükleme göstergesi (httpResource bekleme durumu).">
                        <!-- snippet:misc-progressspinner -->
                        <div class="flex items-center gap-6">
                            <p-progressspinner ariaLabel="Yükleniyor" />
                            <p-progressspinner styleClass="w-12 h-12" strokeWidth="6" animationDuration=".6s" ariaLabel="Yükleniyor" />
                        </div>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="MeterGroup" snippetId="misc-metergroup" [code]="snippet('misc-metergroup')" description="Birden çok değeri tek çubukta gösteren gösterge (kota, ilerleme dağılımı).">
                        <!-- snippet:misc-metergroup -->
                        <p-metergroup [value]="meterValues" />
                        <!-- /snippet -->
                    </app-showcase>
                </div>
                <div class="md:w-1/2 flex flex-col gap-6">
                    <app-showcase title="BlockUI" snippetId="misc-blockui" [code]="snippet('misc-blockui')" description="Async işlem (kaydetme/silme) sırasında bir bölümü kilitler; etkileşimi engeller.">
                        <!-- snippet:misc-blockui -->
                        <div class="flex flex-col gap-3">
                            <div class="flex gap-2">
                                <p-button label="Kilitle" icon="pi pi-lock" (click)="blocked = true" />
                                <p-button label="Kilidi Aç" icon="pi pi-lock-open" severity="secondary" (click)="blocked = false" />
                            </div>
                            <p-panel #blockPanel header="İşlem Bölümü">
                                <p class="m-0 leading-normal">Bu bölüm BlockUI ile kilitlendiğinde içindeki alanlar tıklanamaz. Modüller bu deseni kaydetme/silme sırasında kullanır.</p>
                            </p-panel>
                            <p-blockui [target]="blockPanel" [blocked]="blocked" />
                        </div>
                        <!-- /snippet -->
                    </app-showcase>

                    <app-showcase title="Inplace" snippetId="misc-inplace" [code]="snippet('misc-inplace')" description="Tıkla-düzenle: görüntüleme modundan giriş moduna geçer.">
                        <!-- snippet:misc-inplace -->
                        <p-inplace>
                            <ng-template #display>
                                <span class="inline-flex items-center gap-2"><i class="pi pi-pencil"></i> Düzenlemek için tıklayın</span>
                            </ng-template>
                            <ng-template #content>
                                <input pInputText type="text" [(ngModel)]="inplaceValue" placeholder="Değer girin" />
                            </ng-template>
                        </p-inplace>
                        <!-- /snippet -->
                    </app-showcase>
                </div>
            </div>
        </div>
    `
})
export class MiscDemo {
    value = 0;

    blocked = false;

    inplaceValue = '';

    meterValues = [
        { label: 'Tamamlanan', color: 'var(--mfa-navy)', value: 40, icon: 'pi pi-check' },
        { label: 'Devam Eden', color: 'var(--mfa-gold)', value: 25, icon: 'pi pi-clock' },
        { label: 'Bekleyen', color: 'var(--mfa-gray)', value: 15, icon: 'pi pi-hourglass' }
    ];

    private readonly snippets = inject(SnippetService).forPage('miscdemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    avatarImage(label: string): string {
        return svgPlaceholder(80, 80, brandColors.navy.hex, label);
    }

    interval: any;

    ngOnInit() {
        this.interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 100;
                clearInterval(this.interval);
            }
        }, 2000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }
}
