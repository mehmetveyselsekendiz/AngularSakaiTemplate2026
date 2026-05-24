import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type SnippetMap = Record<string, string>;

/**
 * /uikit/* sayfalarının "Kodu Göster" snippet'lerini public/snippets/<sayfa>.json
 * üzerinden yükler. Snippet'ler build-zamanı `npm run snippets` ile demo .ts
 * dosyalarındaki <!-- snippet:ID --> bloklarından üretilir (kaynak tek yerde).
 */
@Injectable({ providedIn: 'root' })
export class SnippetService {
    private readonly http = inject(HttpClient);
    private readonly pages = new Map<string, Signal<SnippetMap>>();

    /** Sayfanın snippet haritasını döndürür (yüklenene kadar boş). Sonuç cache'lenir. */
    forPage(page: string): Signal<SnippetMap> {
        let sig = this.pages.get(page);
        if (!sig) {
            const writable = signal<SnippetMap>({});
            this.http.get<SnippetMap>(`/snippets/${page}.json`).subscribe({
                next: (data) => writable.set(data),
                error: () => writable.set({})
            });
            sig = writable.asReadonly();
            this.pages.set(page, sig);
        }
        return sig;
    }
}
