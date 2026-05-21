import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--mfa-gold) 40%, transparent) 10%, transparent 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <div class="gap-4 flex flex-col items-center">
                            <div class="flex justify-center items-center border-2 rounded-full" style="width: 3.2rem; height: 3.2rem; border-color: var(--mfa-gold)">
                                <i class="pi pi-fw pi-lock text-2xl!" style="color: var(--mfa-gold)"></i>
                            </div>
                            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">Erişim Engeli</h1>
                            <span class="text-muted-color mb-8">Bu sayfayı görüntülemek için gerekli yetkiniz bulunmamaktadır. Lütfen yöneticinizle iletişime geçin.</span>
                            <i class="pi pi-ban mb-8" style="font-size: 6rem; color: var(--mfa-gold)"></i>
                            <div class="col-span-12 mt-8 text-center">
                                <p-button label="Ana Sayfaya Dön" routerLink="/" severity="warn" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class Access {}
