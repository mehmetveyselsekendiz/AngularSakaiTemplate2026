import { Component, inject } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';
import { svgPlaceholder } from '@/app/core/util/svg-placeholder';

@Component({
    selector: 'app-timeline-demo',
    standalone: true,
    imports: [CommonModule, TimelineModule, ButtonModule, CardModule, ComponentShowcase],
    template: `<div class="grid grid-cols-12 gap-4 md:gap-8">
        <div class="col-span-12 sm:col-span-6">
            <app-showcase title="Left Align" snippetId="timeline-left" [code]="snippet('timeline-left')">
                <!-- snippet:timeline-left -->
                <p-timeline [value]="events1">
                    <ng-template #content let-event>
                        {{ event.status }}
                    </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="col-span-12 sm:col-span-6">
            <app-showcase title="Right Align" snippetId="timeline-right" [code]="snippet('timeline-right')">
                <!-- snippet:timeline-right -->
                <p-timeline [value]="events1" align="right">
                    <ng-template #content let-event>
                        {{ event.status }}
                    </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="col-span-12 sm:col-span-6">
            <app-showcase title="Alternate Align" snippetId="timeline-alternate" [code]="snippet('timeline-alternate')">
                <!-- snippet:timeline-alternate -->
                <p-timeline [value]="events1" align="alternate">
                    <ng-template #content let-event>
                        {{ event.status }}
                    </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="col-span-12 sm:col-span-6">
            <app-showcase title="Opposite Content" snippetId="timeline-opposite" [code]="snippet('timeline-opposite')">
                <!-- snippet:timeline-opposite -->
                <p-timeline [value]="events1">
                    <ng-template #content let-event>
                        <small class="p-text-secondary">{{ event.date }}</small>
                    </ng-template>
                    <ng-template #opposite let-event>
                        {{ event.status }}
                    </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="col-span-full">
            <app-showcase title="Templating" snippetId="timeline-templating" [code]="snippet('timeline-templating')">
                <!-- snippet:timeline-templating -->
                <p-timeline [value]="events1" align="alternate" styleClass="customized-timeline">
                    <ng-template #marker let-event>
                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" [style]="{ 'background-color': event.color }">
                            <i [class]="event.icon"></i>
                        </span>
                    </ng-template>
                    <ng-template #content let-event>
                        <p-card [header]="event.status" [subheader]="event.date">
                            <img *ngIf="event.image" [src]="event.image" [alt]="event.status" width="200" class="shadow" />
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
                                cupiditate neque quas!
                            </p>
                            <p-button label="Read more" [text]="true" />
                        </p-card>
                    </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
        <div class="col-span-full">
            <app-showcase title="Horizontal" snippetId="timeline-horizontal" [code]="snippet('timeline-horizontal')">
                <!-- snippet:timeline-horizontal -->
                <div class="font-semibold mb-2">Top Align</div>
                <p-timeline [value]="events2" layout="horizontal" align="top">
                    <ng-template #content let-event>
                        {{ event }}
                    </ng-template>
                </p-timeline>

                <div class="font-semibold mt-4 mb-2">Bottom Align</div>
                <p-timeline [value]="events2" layout="horizontal" align="bottom">
                    <ng-template #content let-event>
                        {{ event }}
                    </ng-template>
                </p-timeline>

                <div class="font-semibold mt-4 mb-2">Alternate Align</div>
                <p-timeline [value]="events2" layout="horizontal" align="alternate">
                    <ng-template #content let-event>
                        {{ event }}
                    </ng-template>
                    <ng-template #opposite let-event> &nbsp; </ng-template>
                </p-timeline>
                <!-- /snippet -->
            </app-showcase>
        </div>
    </div>`
})
export class TimelineDemo {
    private readonly snippets = inject(SnippetService).forPage('timelinedemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    events1: any[] = [];

    events2: any[] = [];

    ngOnInit() {
        this.events1 = [
            {
                status: 'Ordered',
                date: '15/10/2020 10:30',
                icon: 'pi pi-shopping-cart',
                color: 'var(--mfa-red)',
                image: svgPlaceholder(200, 120, undefined, 'Sipariş')
            },
            {
                status: 'Processing',
                date: '15/10/2020 14:00',
                icon: 'pi pi-cog',
                color: 'var(--mfa-navy)'
            },
            {
                status: 'Shipped',
                date: '15/10/2020 16:15',
                icon: 'pi pi-envelope',
                color: 'var(--mfa-gold)'
            },
            {
                status: 'Delivered',
                date: '16/10/2020 10:00',
                icon: 'pi pi-check',
                color: 'var(--mfa-gray)'
            }
        ];

        this.events2 = ['2020', '2021', '2022', '2023'];
    }
}
