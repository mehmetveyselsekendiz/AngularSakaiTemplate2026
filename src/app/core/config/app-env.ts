// OpenShift'te window.__ENV__ (ConfigMap), local'de public/config.js doldurulur
function env(key: string, fallback = ''): string {
    return (window as Window).__ENV__?.[key] ?? fallback;
}

// React referansındaki extractRoles() pattern'inden port edildi (auth.config.ts)
export function extractRoles(profile: Record<string, unknown>): string[] {
    const realmAccess = profile['realm_access'] as { roles?: string[] } | undefined;
    if (realmAccess?.roles?.length) return realmAccess.roles;

    const direct = profile['roles'];
    if (Array.isArray(direct)) return direct as string[];

    const clientId = env('CLIENT_ID');
    const resourceAccess = profile['resource_access'] as Record<string, { roles?: string[] }> | undefined;
    if (resourceAccess?.[clientId]?.roles?.length) return resourceAccess[clientId].roles ?? [];

    return [];
}

export const appEnv = {
    // SSO (Keycloak) realm URL: https://sso.mfa.gov.tr/realms/mfa
    ssoUrl: () => env('SSO_URL'),
    clientId: () => env('CLIENT_ID'),
    // SSO callback URL: http://localhost:4200/auth/callback
    redirectUri: () => env('REDIRECT_URI', `${window.location.origin}/auth/callback`),
    // SSO logout redirect: http://localhost:4200/auth/login
    postLogoutUri: () => env('POST_LOGOUT_URI', `${window.location.origin}/auth/login`),
    apiUrl: () => env('API_URL'),
    portalUrl: () => env('PORTAL_URL', 'https://www.mfa.gov.tr'),
} as const;
