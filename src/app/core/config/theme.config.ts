import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Renk değerleri mfa-tokens.scss ile senkrondur.
// Değiştirmek için önce mfa-tokens.scss'i güncelleyin, ardından buraya yansıtın.
//
// Primitive override stratejisi:
//   info    severity → sky    paleti → MFA Lacivert (#003773)
//   warn    severity → orange paleti → MFA Altın    (#D7AD4D)
//   danger  severity → red    paleti → MFA Tehlike   (#C81D1D, primary'den koyu/soğuk)
//
// Bu sayede Button, Tag, Badge, Message, Toast vb. tüm bileşenler
// component token yazmadan otomatik MFA paletini kullanır.

export const MfaPreset = definePreset(Aura, {
    primitive: {
        // info severity → MFA Lacivert
        sky: {
            50: '#eff4fb',
            100: '#d5e2f5',
            200: '#aac5eb',
            300: '#72a0d8',
            400: '#3c78c2',
            500: '#1557a4',
            600: '#003773', // --mfa-navy (Pantone 287)
            700: '#002d5e',
            800: '#00224a',
            900: '#001736',
            950: '#000c1e'
        },
        // warn severity → MFA Altın Varak
        orange: {
            50: '#fdf8ec',
            100: '#faf0d1',
            200: '#f5e0a3',
            300: '#edce6d',
            400: '#e2bd57',
            500: '#d7ad4d', // --mfa-gold
            600: '#c49a37',
            700: '#a67d24',
            800: '#876117',
            900: '#67490e',
            950: '#3a2806'
        },
        // danger severity → MFA Tehlike Kırmızısı (primary'den soğuk/koyu)
        red: {
            50: '#fff1f0',
            100: '#ffe2e0',
            200: '#ffc5c2',
            300: '#ff9690',
            400: '#f95f5a',
            500: '#e83030',
            600: '#c81d1d', // --mfa-danger (primary #DA291C'den koyu ve daha nötr)
            700: '#a81717',
            800: '#8a1515',
            900: '#6e1313',
            950: '#3d0909'
        }
    },
    semantic: {
        primary: {
            50: '#fef2f1',
            100: '#fee4e1',
            200: '#fec9c4',
            300: '#fd9e97',
            400: '#f96661',
            500: '#ef3a34',
            600: '#da291c', // --mfa-red (Pantone 199 C)
            700: '#b81e14',
            800: '#991b12',
            900: '#7a1810',
            950: '#440c08'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f9f9fa',
                    100: '#f2f2f3',
                    200: '#e4e4e7',
                    300: '#c8c9cc',
                    400: '#a8aab0',
                    500: '#7e8088',
                    600: '#53565a', // --mfa-gray
                    700: '#3e4044',
                    800: '#2a2d31',
                    900: '#1a1c1f',
                    950: '#0d0e10'
                }
            },
            dark: {
                surface: {
                    0: '#0d0e10',
                    50: '#1a1c1f',
                    100: '#2a2d31',
                    200: '#3e4044',
                    300: '#53565a', // --mfa-gray
                    400: '#7e8088',
                    500: '#a8aab0',
                    600: '#c8c9cc',
                    700: '#e4e4e7',
                    800: '#f2f2f3',
                    900: '#f9f9fa',
                    950: '#ffffff'
                }
            }
        }
    }
});
