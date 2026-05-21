import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
    name: 't',
    standalone: true,
    pure: false
})
export class TranslatePipe implements PipeTransform {
    private readonly svc = inject(TranslateService);

    transform(key: string, params?: Record<string, string | number>): string {
        this.svc.dict();
        return this.svc.t(key, params);
    }
}
