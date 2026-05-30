// authGuard birim testleri — functional CanActivateFn, zoneless.
//
// Guard inject(AuthService) kullanır; injection context TestBed.runInInjectionContext
// ile sağlanır. AuthService stub'lanır (isLoggedIn signal + loginRedirect spy).

import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
    let loggedIn: ReturnType<typeof signal<boolean>>;
    let loginRedirectSpy: jasmine.Spy;

    function runGuard(url: string): boolean {
        const route = {} as ActivatedRouteSnapshot;
        const state = { url } as RouterStateSnapshot;
        return TestBed.runInInjectionContext(() => authGuard(route, state)) as boolean;
    }

    beforeEach(() => {
        loggedIn = signal(false);
        loginRedirectSpy = jasmine.createSpy('loginRedirect');
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), { provide: AuthService, useValue: { isLoggedIn: loggedIn, loginRedirect: loginRedirectSpy } }]
        });
    });

    afterEach(() => TestBed.resetTestingModule());

    it('giriş yapılmışsa true döner ve yönlendirme yapmaz', () => {
        loggedIn.set(true);
        expect(runGuard('/korumali')).toBeTrue();
        expect(loginRedirectSpy).not.toHaveBeenCalled();
    });

    it('giriş yapılmamışsa false döner ve hedef URL ile loginRedirect çağırır', () => {
        loggedIn.set(false);
        expect(runGuard('/korumali/sayfa')).toBeFalse();
        expect(loginRedirectSpy).toHaveBeenCalledOnceWith('/korumali/sayfa');
    });
});
