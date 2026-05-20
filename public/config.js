// Bu dosya docker-entrypoint.sh tarafından production'da (OpenShift ConfigMap) doldurulur.
// Yerel geliştirme için kendi değerlerinizi aşağıya girin. Git'e commit etmeyin.
window.__ENV__ = {
    SSO_URL:         '',   // Keycloak realm URL: https://sso.mfa.gov.tr/realms/mfa
    CLIENT_ID:       '',   // OIDC client ID
    REDIRECT_URI:    '',   // SSO callback: http://localhost:4200/auth/callback
    POST_LOGOUT_URI: '',   // SSO logout redirect: http://localhost:4200/auth/login
    API_URL:         '',   // Backend API base URL
    PORTAL_URL:      'https://www.mfa.gov.tr',
};
