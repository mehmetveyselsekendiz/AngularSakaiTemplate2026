// OpenShift runtime config — docker-entrypoint.sh tarafından üretilir
declare global {
    interface Window {
        __ENV__?: Record<string, string>;
    }
}

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    roles: string[];
    accessToken: string;
}

export interface OidcTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    id_token?: string;
    scope?: string;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}
