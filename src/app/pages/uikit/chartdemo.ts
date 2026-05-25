import { Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { SettingsService } from '@/app/core/settings/settings.service';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-chart-demo',
    standalone: true,
    imports: [ChartModule, FluidModule, ComponentShowcase],
    template: `
        <p-fluid class="grid grid-cols-12 gap-4 md:gap-8">
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Linear" snippetId="chart-line" [code]="snippet('chart-line')">
                    <!-- snippet:chart-line -->
                    <p-chart type="line" [data]="lineData()" [options]="lineOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Bar" snippetId="chart-bar" [code]="snippet('chart-bar')">
                    <!-- snippet:chart-bar -->
                    <p-chart type="bar" [data]="barData()" [options]="barOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Pie" snippetId="chart-pie" [code]="snippet('chart-pie')">
                    <!-- snippet:chart-pie -->
                    <p-chart type="pie" [data]="pieData()" [options]="pieOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Doughnut" snippetId="chart-doughnut" [code]="snippet('chart-doughnut')">
                    <!-- snippet:chart-doughnut -->
                    <p-chart type="doughnut" [data]="pieData()" [options]="pieOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Polar Area" snippetId="chart-polar" [code]="snippet('chart-polar')">
                    <!-- snippet:chart-polar -->
                    <p-chart type="polarArea" [data]="polarData()" [options]="polarOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-showcase title="Radar" snippetId="chart-radar" [code]="snippet('chart-radar')">
                    <!-- snippet:chart-radar -->
                    <p-chart type="radar" [data]="radarData()" [options]="radarOptions()"></p-chart>
                    <!-- /snippet -->
                </app-showcase>
            </div>
        </p-fluid>
    `
})
export class ChartDemo {
    private readonly settings = inject(SettingsService);
    private readonly snippets = inject(SnippetService).forPage('chartdemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    lineData = signal<any>(null);

    barData = signal<any>(null);

    pieData = signal<any>(null);

    polarData = signal<any>(null);

    radarData = signal<any>(null);

    lineOptions = signal<any>(null);

    barOptions = signal<any>(null);

    pieOptions = signal<any>(null);

    polarOptions = signal<any>(null);

    radarOptions = signal<any>(null);

    chartEffect = effect(() => {
        this.settings.isDark();
        setTimeout(() => this.initCharts(), 150);
    });

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData.set({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        });

        this.barOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        });

        this.pieData.set({
            labels: ['Kırmızı', 'Lacivert', 'Altın Varak'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--mfa-red'), documentStyle.getPropertyValue('--mfa-navy'), documentStyle.getPropertyValue('--mfa-gold')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--mfa-red-400'), documentStyle.getPropertyValue('--mfa-navy-400'), documentStyle.getPropertyValue('--mfa-gold')]
                }
            ]
        });

        this.pieOptions.set({
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        });

        this.lineData.set({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                    tension: 0.4
                }
            ]
        });

        this.lineOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        });

        this.polarData.set({
            datasets: [
                {
                    data: [11, 16, 7, 3],
                    backgroundColor: [documentStyle.getPropertyValue('--mfa-red'), documentStyle.getPropertyValue('--mfa-navy'), documentStyle.getPropertyValue('--mfa-gold'), documentStyle.getPropertyValue('--mfa-gray')],
                    label: 'Veri Seti'
                }
            ],
            labels: ['Kırmızı', 'Lacivert', 'Altın Varak', 'Gri']
        });

        this.polarOptions.set({
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    },
                    ticks: {
                        display: false,
                        color: textColorSecondary
                    }
                }
            }
        });

        this.radarData.set({
            labels: ['Planlama', 'Analiz', 'Tasarım', 'Geliştirme', 'Test', 'Dağıtım', 'Destek'],
            datasets: [
                {
                    label: 'Dönem 1',
                    borderColor: documentStyle.getPropertyValue('--mfa-red'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--mfa-red'),
                    pointBorderColor: documentStyle.getPropertyValue('--mfa-red'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--mfa-red'),
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'Dönem 2',
                    borderColor: documentStyle.getPropertyValue('--mfa-navy'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--mfa-navy'),
                    pointBorderColor: documentStyle.getPropertyValue('--mfa-navy'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--mfa-navy'),
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        });

        this.radarOptions.set({
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    pointLabels: {
                        color: textColor
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        });
    }
}
