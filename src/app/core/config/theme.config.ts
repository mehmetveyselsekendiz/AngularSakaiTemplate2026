import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Renk değerleri mfa-tokens.scss ile senkrondur.
// Değiştirmek için önce mfa-tokens.scss'i güncelleyin, ardından buraya yansıtın.
export const MfaPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '#fef2f1',
            100: '#fee4e1',
            200: '#fec9c4',
            300: '#fd9e97',
            400: '#f96661',
            500: '#ef3a34',
            600: '#da291c', // --mfa-red (Pantone 199 C)
            700: '#b81e14',
            800: '#991b12',
            900: '#7a1810',
            950: '#440c08',
        },
        colorScheme: {
            light: {
                surface: {
                    0:   '#ffffff',
                    50:  '#f9f9fa',
                    100: '#f2f2f3',
                    200: '#e4e4e7',
                    300: '#c8c9cc',
                    400: '#a8aab0',
                    500: '#7e8088',
                    600: '#53565a', // --mfa-gray
                    700: '#3e4044',
                    800: '#2a2d31',
                    900: '#1a1c1f',
                    950: '#0d0e10',
                },
            },
            dark: {
                surface: {
                    0:   '#ffffff',
                    50:  '#f9f9fa',
                    100: '#f2f2f3',
                    200: '#e4e4e7',
                    300: '#c8c9cc',
                    400: '#a8aab0',
                    500: '#7e8088',
                    600: '#53565a', // --mfa-gray
                    700: '#3e4044',
                    800: '#2a2d31',
                    900: '#1a1c1f',
                    950: '#0d0e10',
                },
            },
        },
    },
});
