import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { KurumsalKimlik } from './kurumsal-kimlik/kurumsal-kimlik';

export default [
    { path: 'kurumsal-kimlik', component: KurumsalKimlik },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
