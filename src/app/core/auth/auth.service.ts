import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { appEnv, extractRoles } from '@/app/core/config/app-env';
import type { AuthUser, OidcTokenResponse } from '@/app/core/types/auth.types';

// sessionStorage anahtarları
const STORAGE_KEY_USER = 'mfa_auth_user';
const STORAGE_KEY_VERIFIER = 'mfa_oidc_verifier';
const STORAGE_KEY_STATE = 'mfa_oidc_state';
const STORAGE_KEY_RETURN_TO = 'mfa_oidc_return_to';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // ─── State ────────────────────────────────────────────────────────────────
    // signal(): Angular'ın reaktif durum birimi. Zoneless uyumlu, template ve
    // computed() doğrudan izleyebilir.
    private readonly _user = signal<AuthUser | null>(this.#loadFromStorage());

    readonly user = this._user.asReadonly();
    readonly isLoggedIn = computed(() => this._user() !== null);
    // computed(): bağımlı signal'lar değişince otomatik güncellenen türetilmiş değer
    readonly roles = computed(() => this._user()?.roles ?? []);
    readonly displayName = computed(() => {
        const u = this._user();
        return u?.fullName ?? u?.username ?? '';
    });

    // ─── Login / Logout ───────────────────────────────────────────────────────

    /**
     * Kullanıcıyı Keycloak SSO'ya yönlendirir (PKCE akışı).
     * returnTo: başarılı girişten sonra dönülecek URL
     */
    loginRedirect(returnTo?: string): void {
        this.#performLoginRedirect(returnTo).catch(() => {
            // PKCE challenge başarısız olursa login sayfasına yönlendir
            void this.router.navigate(['/auth/login']);
        });
    }

    /**
     * SSO callback'ten dönen code + state'i token ile değiştirir.
     * callback.component.ts tarafından çağrılır.
     */
    handleCallback(code: string, state: string): Observable<void> {
        const storedState = sessionStorage.getItem(STORAGE_KEY_STATE);
        const codeVerifier = sessionStorage.getItem(STORAGE_KEY_VERIFIER);

        if (state !== storedState || !codeVerifier) {
            return new Observable((sub) => {
                sub.error(new Error('Geçersiz SSO oturum durumu — lütfen tekrar giriş yapın.'));
            });
        }

        // application/x-www-form-urlencoded body — OIDC token endpoint standardı
        const body = new HttpParams().set('grant_type', 'authorization_code').set('code', code).set('redirect_uri', appEnv.redirectUri()).set('client_id', appEnv.clientId()).set('code_verifier', codeVerifier);

        return this.http.post<OidcTokenResponse>(`${appEnv.ssoUrl()}/protocol/openid-connect/token`, body.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).pipe(
            tap((tokens) => {
                const user = this.#parseTokens(tokens);
                this._user.set(user);
                sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
                sessionStorage.removeItem(STORAGE_KEY_VERIFIER);
                sessionStorage.removeItem(STORAGE_KEY_STATE);
            }),
            map(() => void 0)
        );
    }

    logout(): void {
        this._user.set(null);
        sessionStorage.removeItem(STORAGE_KEY_USER);

        const params = new URLSearchParams({
            client_id: appEnv.clientId(),
            post_logout_redirect_uri: appEnv.postLogoutUri()
        });
        window.location.href = `${appEnv.ssoUrl()}/protocol/openid-connect/logout?${params}`;
    }

    /**
     * SSO yapılandırılmamış ortamlarda geliştirici geçişi sağlar.
     * SSO_URL tanımlıysa çalışmaz — production güvenliği korunur.
     */
    devLogin(displayName: string): void {
        if (appEnv.ssoUrl()) return;
        const mockUser: AuthUser = {
            id: 'dev-user',
            username: 'developer',
            email: 'developer@mfa.gov.tr',
            fullName: displayName || 'Geliştirici',
            roles: [],
            accessToken: 'dev-token'
        };
        this._user.set(mockUser);
        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
        void this.router.navigate(['/']);
    }

    /** HTTP interceptor tarafından Bearer token almak için kullanılır */
    getToken(): string | null {
        return this._user()?.accessToken ?? null;
    }

    /** Callback sonrası dönüş URL'sini al ve temizle */
    consumeReturnTo(): string {
        const returnTo = sessionStorage.getItem(STORAGE_KEY_RETURN_TO) ?? '/';
        sessionStorage.removeItem(STORAGE_KEY_RETURN_TO);
        return returnTo;
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    async #performLoginRedirect(returnTo?: string): Promise<void> {
        // SSO yapılandırılmamışsa (geliştirme / config.js boşsa) login sayfasını göster
        if (!appEnv.ssoUrl()) {
            await this.router.navigate(['/auth/login']);
            return;
        }

        const codeVerifier = this.#generateCodeVerifier();
        const codeChallenge = await this.#generateCodeChallenge(codeVerifier);
        const state = this.#generateState();

        sessionStorage.setItem(STORAGE_KEY_VERIFIER, codeVerifier);
        sessionStorage.setItem(STORAGE_KEY_STATE, state);
        if (returnTo) {
            sessionStorage.setItem(STORAGE_KEY_RETURN_TO, returnTo);
        }

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: appEnv.clientId(),
            redirect_uri: appEnv.redirectUri(),
            scope: 'openid profile email',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        window.location.href = `${appEnv.ssoUrl()}/protocol/openid-connect/auth?${params}`;
    }

    #generateCodeVerifier(): string {
        const array = new Uint8Array(64);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    async #generateCodeChallenge(verifier: string): Promise<string> {
        const data = new TextEncoder().encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    #generateState(): string {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
    }

    #parseTokens(tokens: OidcTokenResponse): AuthUser {
        const payload = this.#decodeJwt(tokens.access_token);
        return {
            id: payload['sub'] as string,
            username: (payload['preferred_username'] as string) ?? (payload['sub'] as string),
            email: (payload['email'] as string) ?? '',
            fullName: payload['name'] as string | undefined,
            roles: extractRoles(payload),
            accessToken: tokens.access_token
        };
    }

    #decodeJwt(token: string): Record<string, unknown> {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        } catch {
            return {};
        }
    }

    #loadFromStorage(): AuthUser | null {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY_USER);
            return stored ? (JSON.parse(stored) as AuthUser) : null;
        } catch {
            return null;
        }
    }
}
