import { Routes } from '@angular/router';

// Vize modülü lazy child rotaları (app.routes.ts → loadChildren).
// Sıra önemli: 'yeni' ve ':id/duzenle', ':id' detay rotasından ÖNCE gelmeli.
export default [
    { path: '', loadComponent: () => import('./list/vize-list').then((m) => m.VizeList), data: { breadcrumb: 'menu.modules.vize' } },
    { path: 'yeni', loadComponent: () => import('./form/vize-form').then((m) => m.VizeForm) },
    { path: ':id/duzenle', loadComponent: () => import('./form/vize-form').then((m) => m.VizeForm) },
    { path: ':id', loadComponent: () => import('./detail/vize-detail').then((m) => m.VizeDetail) }
] as Routes;
