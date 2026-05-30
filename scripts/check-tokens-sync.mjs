#!/usr/bin/env node
// MFA Token Senkron Doğrulayıcı — sıfır bağımlılık (saf Node ESM).
//
// Marka paleti üç dosyada yaşar (teknik zorunluluk):
//   1. src/assets/mfa-tokens.scss           → KANONİK KAYNAK (runtime CSS değişkenleri)
//   2. src/app/core/config/theme.config.ts  → PrimeNG preset (tanım anında var() okunamaz → literal hex)
//   3. src/app/core/config/design-tokens.ts → Kurumsal Kimlik sayfası + svg-placeholder (data: SVG var() çözmez → literal hex)
//
// Bu üçü elle senkron tutulur. Bu script, ikincil iki dosyanın kanonik
// kaynakla AYNI marka hex'lerini taşıdığını doğrular; ayrışma (drift) varsa
// `exit 1` döner (CI/pre-commit durur). `npm run lint:tokens` ile çalışır.
//
// Kapsam: yalnızca 6 marka anchor rengi (red/gold/gray/navy/navy-dark/danger).
// Tonal rampalar (50..950) bunlardan türetilir; anchor doğruysa felsefe korunur.

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Proje kökü. Test edilebilirlik için MFA_LINT_ROOT env değişkeniyle override
// edilebilir (scripts/__tests__/*.test.mjs sahte fixture köklerine işaret eder).
const ROOT = process.env.MFA_LINT_ROOT ? resolve(process.env.MFA_LINT_ROOT) : join(fileURLToPath(new URL('.', import.meta.url)), '..');

const SCSS = 'src/assets/mfa-tokens.scss';
const PRESET = 'src/app/core/config/theme.config.ts';
const TOKENS_TS = 'src/app/core/config/design-tokens.ts';

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const norm = (hex) => hex.trim().toLowerCase();

// --- 1. Kanonik kaynak: mfa-tokens.scss --------------------------------------
// `--mfa-red: #DA291C;` → { red: '#da291c', ... }
// design-tokens.ts anahtarlarıyla hizalamak için 'navy-dark' → 'navyDark'.
const SCSS_KEYS = {
    red: '--mfa-red',
    gold: '--mfa-gold',
    gray: '--mfa-gray',
    navy: '--mfa-navy',
    navyDark: '--mfa-navy-dark',
    danger: '--mfa-danger'
};

function readCanonical() {
    const css = read(SCSS);
    const out = {};
    for (const [key, cssVar] of Object.entries(SCSS_KEYS)) {
        // Tam değişken adı + sonrasında sınır (--mfa-navy, --mfa-navy-dark'ı yakalamasın).
        const re = new RegExp(`${cssVar}\\s*:\\s*(#[0-9A-Fa-f]{6})\\b`);
        const m = css.match(re);
        if (!m) throw new Error(`Kanonik kaynak (${SCSS}) içinde "${cssVar}" bulunamadı.`);
        out[key] = norm(m[1]);
    }
    return out;
}

// --- 2. design-tokens.ts: brandColors.<key>.hex ------------------------------
function checkDesignTokens(canon) {
    const ts = read(TOKENS_TS);
    const issues = [];
    for (const [key, expected] of Object.entries(canon)) {
        const re = new RegExp(`${key}\\s*:\\s*\\{[\\s\\S]*?hex:\\s*'(#[0-9A-Fa-f]{6})'`);
        const m = ts.match(re);
        if (!m) {
            issues.push(`  ✗ brandColors.${key}.hex bulunamadı (${TOKENS_TS})`);
        } else if (norm(m[1]) !== expected) {
            issues.push(`  ✗ brandColors.${key}.hex = ${norm(m[1])}  ≠  ${SCSS} ${SCSS_KEYS[key]} = ${expected}`);
        }
    }
    return issues;
}

// --- 3. theme.config.ts: marka anchor'ları literal İÇERMELİ ------------------
// navy-dark preset'te yok (contrast/sidebar amaçlı, başka yerde kullanılır) → hariç.
const PRESET_KEYS = ['red', 'gold', 'gray', 'navy', 'danger'];

function checkPreset(canon) {
    const preset = read(PRESET).toLowerCase();
    const issues = [];
    for (const key of PRESET_KEYS) {
        const expected = canon[key];
        if (!preset.includes(expected)) {
            issues.push(`  ✗ ${SCSS_KEYS[key]} = ${expected} değeri preset'te yok (${PRESET} — MfaPreset güncellenmemiş?)`);
        }
    }
    return issues;
}

// --- Çalıştır ----------------------------------------------------------------
try {
    const canon = readCanonical();
    const issues = [...checkDesignTokens(canon), ...checkPreset(canon)];

    if (issues.length > 0) {
        console.error('\n✗ MFA token senkronu BOZUK — palet dosyaları ayrışmış:\n');
        console.error(issues.join('\n'));
        console.error(`\nDüzelt: önce ${SCSS} (kanonik), sonra ${PRESET} + ${TOKENS_TS}'i aynı hex'lere getir.\n`);
        process.exit(1);
    }

    const anchors = Object.entries(canon)
        .map(([k, v]) => `${k}=${v}`)
        .join(' · ');
    console.log(`✓ MFA token senkronu: 3 palet dosyası uyumlu. (${anchors})`);
    process.exit(0);
} catch (err) {
    console.error(`\n✗ MFA token senkron kontrolü çalışamadı: ${err.message}\n`);
    process.exit(1);
}
