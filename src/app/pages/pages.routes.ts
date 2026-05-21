import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { KurumsalKimlik } from './kurumsal-kimlik/kurumsal-kimlik';
import { Ayarlar } from './ayarlar/ayarlar';

export default [
    { path: 'kurumsal-kimlik', component: KurumsalKimlik },
    { path: 'ayarlar', component: Ayarlar },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
