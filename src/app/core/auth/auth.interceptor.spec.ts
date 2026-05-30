// authInterceptor birim testleri — functional HttpInterceptorFn, zoneless.
//
// Interceptor withInterceptors([authInterceptor]) ile HttpClient'a takılır;
// istekler HttpTestingController ile yakalanıp Authorization başlığı denetlenir.
// AuthService.getToken() değiştirilebilir bir stub ile sağlanır.

import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let token: string | null;

    beforeEach(() => {
        token = 'test-token-123';
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), { provide: AuthService, useValue: { getToken: () => token } }]
        });
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        TestBed.resetTestingModule();
    });

    it('token varken normal isteğe Bearer başlığı ekler', () => {
        http.get('/api/personel').subscribe();
        const req = httpMock.expectOne('/api/personel');
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
        req.flush({});
    });

    it('token endpoint çağrısına Bearer EKLEMEZ (sonsuz döngü önlenir)', () => {
        const url = 'https://sso.mfa.gov.tr/realms/mfa/protocol/openid-connect/token';
        http.post(url, null).subscribe();
        const req = httpMock.expectOne(url);
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });

    it('token yokken Bearer başlığı eklemez', () => {
        token = null;
        http.get('/api/personel').subscribe();
        const req = httpMock.expectOne('/api/personel');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });
});
