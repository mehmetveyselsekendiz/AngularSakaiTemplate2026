import { Routes } from '@angular/router';
import { ButtonDemo } from './buttondemo';
import { ChartDemo } from './chartdemo';
import { EditorDemo } from './editordemo';
import { FileDemo } from './filedemo';
import { FormLayoutDemo } from './formlayoutdemo';
import { InputDemo } from './inputdemo';
import { ListDemo } from './listdemo';
import { MediaDemo } from './mediademo';
import { MessagesDemo } from './messagesdemo';
import { MiscDemo } from './miscdemo';
import { PanelsDemo } from './panelsdemo';
import { TimelineDemo } from './timelinedemo';
import { TableDemo } from './tabledemo';
import { OverlayDemo } from './overlaydemo';
import { TreeDemo } from './treedemo';
import { MenuDemo } from './menudemo';

export default [
    { path: 'button', data: { breadcrumb: 'Butonlar' }, component: ButtonDemo },
    { path: 'charts', data: { breadcrumb: 'Grafikler' }, component: ChartDemo },
    { path: 'editor', data: { breadcrumb: 'Zengin Metin' }, component: EditorDemo },
    { path: 'file', data: { breadcrumb: 'Dosya Yükleme' }, component: FileDemo },
    { path: 'formlayout', data: { breadcrumb: 'Form Düzeni' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Giriş Alanları' }, component: InputDemo },
    { path: 'list', data: { breadcrumb: 'Liste' }, component: ListDemo },
    { path: 'media', data: { breadcrumb: 'Medya' }, component: MediaDemo },
    { path: 'message', data: { breadcrumb: 'Mesajlar' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Diğer' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Paneller' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Zaman Çizelgesi' }, component: TimelineDemo },
    { path: 'table', data: { breadcrumb: 'Tablo' }, component: TableDemo },
    { path: 'overlay', data: { breadcrumb: 'Overlay' }, component: OverlayDemo },
    { path: 'tree', data: { breadcrumb: 'Ağaç' }, component: TreeDemo },
    { path: 'menu', data: { breadcrumb: 'Menü' }, component: MenuDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
