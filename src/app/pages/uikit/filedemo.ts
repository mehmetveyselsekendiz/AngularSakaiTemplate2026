import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-file-demo',
    standalone: true,
    imports: [FileUploadModule, ToastModule, ButtonModule],
    template: `<p-toast />
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full lg:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Gelişmiş Yükleme</div>
                    <p-fileupload name="dosya[]" (onUpload)="onUpload($event)" [multiple]="true" accept="image/*,application/pdf" [maxFileSize]="5000000" mode="advanced" url="/api/upload">
                        <ng-template #empty>
                            <div>Dosyaları buraya sürükleyip bırakın veya seçin.</div>
                        </ng-template>
                    </p-fileupload>
                </div>
            </div>
            <div class="col-span-full lg:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Basit Yükleme</div>
                    <div class="flex flex-col gap-4 items-center justify-center">
                        <p-fileupload #fu mode="basic" chooseLabel="Dosya Seç" chooseIcon="pi pi-upload" name="dosya[]" url="/api/upload" accept="image/*,application/pdf" [maxFileSize]="5000000" (onUpload)="onUpload($event)" />
                        <p-button label="Yükle" (onClick)="fu.upload()" severity="secondary" />
                    </div>
                </div>
            </div>
        </div>`,
    providers: [MessageService]
})
export class FileDemo {
    private messageService = inject(MessageService);

    onUpload(event: any) {
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: `${event.files?.length ?? 1} dosya yüklendi` });
    }
}
