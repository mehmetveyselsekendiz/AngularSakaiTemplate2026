import { Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-chart-demo',
    standalone: true,
    imports: [ChartModule, FluidModule],
    template: `
        <p-fluid class="grid grid-cols-12 gap-8">
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-6">Linear</div>
                    <p-chart type="line" [data]="lineData()" [options]="lineOptions()"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-6">Bar</div>
                    <p-chart type="bar" [data]="barData()" [options]="barOptions()"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-6">Pie</div>
                    <p-chart type="pie" [data]="pieData()" [options]="pieOptions()"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-6">Doughnut</div>
                    <p-chart type="doughnut" [data]="pieData()" [options]="pieOptions()"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-6">Polar Area</div>
                    <p-chart type="polarArea" [data]="polarData()" [options]="polarOptions()"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-6">Radar</div>
                    <p-chart type="radar" [data]="radarData()" [options]="radarOptions()"></p-chart>
                </div>
            </div>
        </p-fluid>
    `
})
export class ChartDemo {
    layoutService = inject(LayoutService);

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
        this.layoutService.layoutConfig().darkTheme;
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
