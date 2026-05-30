// PermissionService birim testleri — zoneless.
//
// Servis, AuthService.roles() signal'ına dayanan computed'lar döner. Computed
// okuması bağımlılık değişince taze değer çeker → effect flush'a gerek yok;
// roles signal'ı set edip computed yeniden okunur.

import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PermissionService } from './permission.service';
import { AuthService } from './auth.service';

describe('PermissionService', () => {
    let roles: WritableSignal<string[]>;
    let service: PermissionService;

    beforeEach(() => {
        roles = signal<string[]>([]);
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), PermissionService, { provide: AuthService, useValue: { roles } }]
        });
        service = TestBed.inject(PermissionService);
    });

    afterEach(() => TestBed.resetTestingModule());

    describe('hasRole', () => {
        it('rol yoksa false döner', () => {
            roles.set(['VIZE_OKUMA']);
            expect(service.hasRole('VIZE_YAZMA')()).toBeFalse();
        });

        it('rol varsa true döner', () => {
            roles.set(['VIZE_OKUMA', 'VIZE_YAZMA']);
            expect(service.hasRole('VIZE_YAZMA')()).toBeTrue();
        });

        it('boş rol her zaman true döner (kısıtsız erişim)', () => {
            expect(service.hasRole('')()).toBeTrue();
        });

        it('roller değişince reaktif güncellenir', () => {
            const can = service.hasRole('ADMIN');
            expect(can()).toBeFalse();
            roles.set(['ADMIN']);
            expect(can()).toBeTrue();
        });
    });

    describe('anyRole', () => {
        it('boş liste her zaman true döner', () => {
            expect(service.anyRole([])()).toBeTrue();
        });

        it('rollerden en az biri varsa true döner', () => {
            roles.set(['VIZE_OKUMA']);
            expect(service.anyRole(['VIZE_YAZMA', 'VIZE_OKUMA'])()).toBeTrue();
        });

        it('hiçbiri yoksa false döner', () => {
            roles.set(['PASAPORT_OKUMA']);
            expect(service.anyRole(['VIZE_YAZMA', 'VIZE_OKUMA'])()).toBeFalse();
        });

        it('roller değişince reaktif güncellenir', () => {
            const can = service.anyRole(['ADMIN', 'SUPERVISOR']);
            expect(can()).toBeFalse();
            roles.set(['SUPERVISOR']);
            expect(can()).toBeTrue();
        });
    });
});
