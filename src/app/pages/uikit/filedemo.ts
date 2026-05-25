import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ComponentShowcase } from './component-showcase';
import { SnippetService } from './snippet.service';

@Component({
    selector: 'app-file-demo',
    standalone: true,
    imports: [FileUploadModule, ToastModule, ButtonModule, ComponentShowcase],
    template: `<p-toast />
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full lg:col-span-6">
                <app-showcase title="Gelişmiş Yükleme" snippetId="file-advanced" [code]="snippet('file-advanced')">
                    <!-- snippet:file-advanced -->
                    <p-fileupload name="dosya[]" (onUpload)="onUpload($event)" [multiple]="true" accept="image/*,application/pdf" [maxFileSize]="5000000" mode="advanced" url="/api/upload">
                        <ng-template #empty>
                            <div>Dosyaları buraya sürükleyip bırakın veya seçin.</div>
                        </ng-template>
                    </p-fileupload>
                    <!-- /snippet -->
                </app-showcase>
            </div>
            <div class="col-span-full lg:col-span-6">
                <app-showcase title="Basit Yükleme" snippetId="file-basic" [code]="snippet('file-basic')">
                    <!-- snippet:file-basic -->
                    <div class="flex flex-col gap-4 items-center justify-center">
                        <p-fileupload #fu mode="basic" chooseLabel="Dosya Seç" chooseIcon="pi pi-upload" name="dosya[]" url="/api/upload" accept="image/*,application/pdf" [maxFileSize]="5000000" (onUpload)="onUpload($event)" />
                        <p-button label="Yükle" (onClick)="fu.upload()" severity="secondary" />
                    </div>
                    <!-- /snippet -->
                </app-showcase>
            </div>
        </div>`,
    providers: [MessageService]
})
export class FileDemo {
    private readonly snippets = inject(SnippetService).forPage('filedemo');

    snippet(id: string): string {
        return this.snippets()[id] ?? '';
    }

    private messageService = inject(MessageService);

    onUpload(event: any) {
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: `${event.files?.length ?? 1} dosya yüklendi` });
    }
}
