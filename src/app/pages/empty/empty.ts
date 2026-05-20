import { Component } from '@angular/core';

@Component({
    selector: 'app-empty',
    standalone: true,
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">Boş Sayfa</div>
        <p>Yeni modül geliştirmek için bu sayfayı başlangıç noktası olarak kullanın. İçeriğinizi buraya ekleyin.</p>
    </div>`
})
export class Empty {}
