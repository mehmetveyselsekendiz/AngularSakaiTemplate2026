// src/app/core/settings/settings.types.ts

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AppLanguage = 'tr' | 'en';

export interface AppSettings {
    themeMode: ThemeMode;
    fontScale: FontScale;
    language: AppLanguage;
}

export const DEFAULT_SETTINGS: AppSettings = {
    themeMode: 'system',
    fontScale: 'md',
    language: 'tr'
};

export const FONT_SCALE_PX: Record<FontScale, number> = {
    xs: 13, sm: 14, md: 15, lg: 17, xl: 19
};

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'] as const;
export const FONT_SCALES: readonly FontScale[] = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const APP_LANGUAGES: readonly AppLanguage[] = ['tr', 'en'] as const;

export function isValidThemeMode(v: unknown): v is ThemeMode {
    return typeof v === 'string' && (THEME_MODES as readonly string[]).includes(v);
}
export function isValidFontScale(v: unknown): v is FontScale {
    return typeof v === 'string' && (FONT_SCALES as readonly string[]).includes(v);
}
export function isValidLanguage(v: unknown): v is AppLanguage {
    return typeof v === 'string' && (APP_LANGUAGES as readonly string[]).includes(v);
}
