// extractRoles birim testleri — saf fonksiyon (TestBed gerektirmez).
//
// SSO token claim'lerinden rol çıkarımının öncelik sırasını doğrular:
// realm_access.roles → düz roles → resource_access[clientId].roles → [].
// Güvenlik-kritik: rol-gated menü/aksiyonlar bu fonksiyona dayanır.

import { extractRoles } from './app-env';

describe('extractRoles', () => {
    afterEach(() => delete (window as unknown as Record<string, unknown>)['__ENV__']);

    it('realm_access.roles önceliklidir', () => {
        expect(extractRoles({ realm_access: { roles: ['ADMIN', 'VIZE_OKUMA'] } })).toEqual(['ADMIN', 'VIZE_OKUMA']);
    });

    it('realm_access yoksa düz roles dizisini okur', () => {
        expect(extractRoles({ roles: ['PASAPORT_OKUMA'] })).toEqual(['PASAPORT_OKUMA']);
    });

    it('resource_access[clientId].roles fallback olarak okunur', () => {
        (window as unknown as Record<string, unknown>)['__ENV__'] = { CLIENT_ID: 'mfa-frontend' };
        expect(extractRoles({ resource_access: { 'mfa-frontend': { roles: ['KONSOLOSLUK_YAZMA'] } } })).toEqual(['KONSOLOSLUK_YAZMA']);
    });

    it('hiçbir claim yoksa boş dizi döner', () => {
        expect(extractRoles({})).toEqual([]);
    });
});
