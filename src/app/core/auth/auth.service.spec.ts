// AuthService birim testleri — zoneless.
//
// Güvenli yüzeyler test edilir: depo yükleme, türetilmiş state (isLoggedIn/
// roles/displayName), getToken, devLogin (SSO boş/dolu), handleCallback state
// doğrulaması, consumeReturnTo. window.location.href atayan yollar (gerçek SSO
// loginRedirect/logout) KASITLI hariç — headless tarayıcıda navigasyon Karma'yı
// kırar; o yollar manuel/E2E kapsamındadır.

import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let navigateSpy: jasmine.Spy;

    function setup(): AuthService {
        navigateSpy = jasmine.createSpy('navigate').and.resolveTo(true);
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: navigateSpy } }]
        });
        return TestBed.inject(AuthService);
    }

    beforeEach(() => {
        sessionStorage.clear();
        (window as unknown as Record<string, unknown>)['__ENV__'] = {}; // SSO boş → dev modu açık
    });

    afterEach(() => {
        sessionStorage.clear();
        delete (window as unknown as Record<string, unknown>)['__ENV__'];
        TestBed.resetTestingModule();
    });

    it('depo boşken oturum kapalı başlar', () => {
        const svc = setup();
        expect(svc.isLoggedIn()).toBeFalse();
        expect(svc.roles()).toEqual([]);
        expect(svc.displayName()).toBe('');
        expect(svc.getToken()).toBeNull();
    });

    it('sessionStorage’teki kullanıcıyı yükler', () => {
        sessionStorage.setItem('mfa_auth_user', JSON.stringify({ id: '1', username: 'u', email: '', fullName: 'Ad Soyad', roles: ['VIZE_OKUMA'], accessToken: 'tok' }));
        const svc = setup();
        expect(svc.isLoggedIn()).toBeTrue();
        expect(svc.displayName()).toBe('Ad Soyad');
        expect(svc.roles()).toEqual(['VIZE_OKUMA']);
        expect(svc.getToken()).toBe('tok');
    });

    it('displayName fullName yoksa username’e düşer', () => {
        sessionStorage.setItem('mfa_auth_user', JSON.stringify({ id: '1', username: 'kullanici', email: '', roles: [], accessToken: 't' }));
        const svc = setup();
        expect(svc.displayName()).toBe('kullanici');
    });

    it('bozuk depo verisinde çökmeden kapalı başlar', () => {
        sessionStorage.setItem('mfa_auth_user', '{bozuk');
        const svc = setup();
        expect(svc.isLoggedIn()).toBeFalse();
    });

    it('devLogin SSO boşken kullanıcı oluşturur ve köke yönlendirir', () => {
        const svc = setup();
        svc.devLogin('Test Kullanıcı');
        expect(svc.isLoggedIn()).toBeTrue();
        expect(svc.displayName()).toBe('Test Kullanıcı');
        expect(svc.roles().length).toBeGreaterThan(0);
        expect(svc.getToken()).toBe('dev-token');
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('devLogin SSO tanımlıysa hiçbir şey yapmaz (production güvenliği)', () => {
        (window as unknown as Record<string, unknown>)['__ENV__'] = { SSO_URL: 'https://sso.mfa.gov.tr/realms/mfa' };
        const svc = setup();
        svc.devLogin('X');
        expect(svc.isLoggedIn()).toBeFalse();
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('handleCallback state uyuşmazlığında hata verir', async () => {
        const svc = setup();
        // sessionStorage'da storedState yok → gelen state ile uyuşmaz
        await expectAsync(firstValueFrom(svc.handleCallback('kod', 'gelen-state'))).toBeRejectedWithError(/SSO oturum durumu/);
    });

    it('consumeReturnTo değeri okur ve temizler', () => {
        sessionStorage.setItem('mfa_oidc_return_to', '/vize/liste');
        const svc = setup();
        expect(svc.consumeReturnTo()).toBe('/vize/liste');
        expect(svc.consumeReturnTo()).toBe('/'); // ikinci okumada temizlenmiş
    });
});
