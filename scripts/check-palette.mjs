#!/usr/bin/env node
// MFA Governance Tarayıcı — sıfır bağımlılık (saf Node ESM).
//
// CLAUDE.md §4 (tek palet kaynağı), §6 (CDN asset yok), §14 (governance)
// kurallarını otomatik denetler. `npm run lint:palette` ile çalışır.
//
// Taranan yüzey: src/app/**/*.ts  (modül takımlarının component kodu — tüm
// template + style inline olduğu için tek dosya tipi yeterli).
//
// Kurallar:
//   1. HEX          — hardcoded hex renk (#DA291C, #fff ...). Palet kaynak
//                     dosyaları (theme.config.ts, design-tokens.ts) hariç.
//   2. TAILWIND     — sabit Tailwind renk sınıfı (bg-red-500, text-blue-700)
//                     ve arbitrary renk (text-[#...]). surface/primary gibi
//                     semantic sınıflar serbest.
//   3. CDN          — harici http(s) asset URL'i. w3.org/xml namespace hariç.
//   4. IMPORT       — features/** içinde /uikit/*'te gösterilmemiş PrimeNG
//                     modülü import'u (CLAUDE.md §14 enforcement).
//
// İstisna: bir satıra `mfa-ignore` yorumu eklenirse o satır atlanır.
//
// Çıkış kodu: ihlal varsa 1 (CI/pre-commit fail eder), temizse 0.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const APP_DIR = join(ROOT, 'src', 'app');
const UIKIT_DIR = join(APP_DIR, 'pages', 'uikit');
const FEATURES_DIR = join(APP_DIR, 'features');

// Palet kaynak dosyaları — hex barındırması GEREKEN tek yetkili yerler.
const HEX_WHITELIST = ['src/app/core/config/theme.config.ts', 'src/app/core/config/design-tokens.ts'];

// CDN kuralının yok sayacağı host'lar:
//   - XML/SVG namespace'leri (asset değil)
//   - mfa.gov.tr: kurumun KENDİ domaini (SSO endpoint / portal config default'ları)
const URL_ALLOWLIST = ['localhost', '127.0.0.1', 'www.w3.org', 'schemas.', 'ns.adobe.com', 'mfa.gov.tr'];

const IGNORE_TOKEN = 'mfa-ignore';

// --- Regex kuralları ---------------------------------------------------------

const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;

const TW_COLORS = 'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone';
const TW_PREFIX = 'bg|text|border|ring|ring-offset|from|via|to|fill|stroke|divide|outline|decoration|accent|caret|shadow';
const TW_FIXED_RE = new RegExp(`\\b(?:${TW_PREFIX})-(?:${TW_COLORS})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`, 'g');
const TW_ARBITRARY_RE = new RegExp(`\\b(?:${TW_PREFIX})-\\[(?:#|rgb|rgba|hsl|hsla|oklch|color)`, 'gi');

const URL_RE = /\bhttps?:\/\/[^\s"'`)<>]+/gi;

const PRIMENG_IMPORT_RE = /from\s+['"](primeng\/[^'"]+)['"]/g;

// --- Yardımcılar -------------------------------------------------------------

function walk(dir, out = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return out;
    }
    for (const name of entries) {
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) {
            if (name === 'node_modules' || name === '.angular' || name === 'dist') continue;
            walk(full, out);
        } else if (name.endsWith('.ts') && !name.endsWith('.spec.ts')) {
            out.push(full);
        }
    }
    return out;
}

function rel(file) {
    return relative(ROOT, file).split(sep).join('/');
}

function collectMatches(content, re) {
    const lines = content.split(/\r?\n/);
    const hits = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(IGNORE_TOKEN)) continue;
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
            hits.push({ line: i + 1, text: m[0] });
        }
    }
    return hits;
}

// --- Tarama ------------------------------------------------------------------

const violations = [];
const files = walk(APP_DIR);

for (const file of files) {
    const relPath = rel(file);
    const content = readFileSync(file, 'utf8');

    // 1. HEX (palet kaynak dosyaları hariç)
    if (!HEX_WHITELIST.includes(relPath)) {
        for (const h of collectMatches(content, HEX_RE)) {
            violations.push({ file: relPath, line: h.line, rule: 'HEX', text: h.text });
        }
    }

    // 2. TAILWIND sabit renk + arbitrary renk
    for (const h of collectMatches(content, TW_FIXED_RE)) {
        violations.push({ file: relPath, line: h.line, rule: 'TAILWIND', text: h.text });
    }
    for (const h of collectMatches(content, TW_ARBITRARY_RE)) {
        violations.push({ file: relPath, line: h.line, rule: 'TAILWIND', text: h.text });
    }

    // 3. CDN URL (allowlist host'lar hariç)
    for (const h of collectMatches(content, URL_RE)) {
        if (URL_ALLOWLIST.some((host) => h.text.includes(host))) continue;
        violations.push({ file: relPath, line: h.line, rule: 'CDN', text: h.text });
    }
}

// 4. Component-import governance — /uikit/* sanctioned set vs features/**
function collectPrimeNgImports(file) {
    const out = new Set();
    const content = readFileSync(file, 'utf8');
    PRIMENG_IMPORT_RE.lastIndex = 0;
    let m;
    while ((m = PRIMENG_IMPORT_RE.exec(content)) !== null) out.add(m[1]);
    return out;
}

const sanctioned = new Set();
for (const file of walk(UIKIT_DIR)) {
    for (const spec of collectPrimeNgImports(file)) sanctioned.add(spec);
}

for (const file of walk(FEATURES_DIR)) {
    const relPath = rel(file);
    const content = readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(IGNORE_TOKEN)) continue;
        PRIMENG_IMPORT_RE.lastIndex = 0;
        let m;
        while ((m = PRIMENG_IMPORT_RE.exec(lines[i])) !== null) {
            if (!sanctioned.has(m[1])) {
                violations.push({ file: relPath, line: i + 1, rule: 'IMPORT', text: m[1] });
            }
        }
    }
}

// --- Rapor -------------------------------------------------------------------

const RULE_INFO = {
    HEX: 'Hardcoded hex renk — var(--mfa-*) token veya PrimeNG severity kullan.',
    TAILWIND: 'Sabit Tailwind renk sınıfı — text-primary / bg-primary / var(--mfa-*) kullan.',
    CDN: 'Harici asset URL — yerel asset veya data: URI kullan.',
    IMPORT: "/uikit/*'te gösterilmemiş PrimeNG modülü — önce uikit demosuna ekle."
};

if (violations.length === 0) {
    console.log('✓ MFA governance: ihlal yok. (' + files.length + ' dosya tarandı)');
    process.exit(0);
}

const byRule = {};
for (const v of violations) (byRule[v.rule] ??= []).push(v);

console.log('\n✗ MFA governance: ' + violations.length + ' ihlal bulundu.\n');
for (const rule of Object.keys(byRule)) {
    console.log(`  [${rule}] ${RULE_INFO[rule]}`);
    for (const v of byRule[rule]) {
        console.log(`    ${v.file}:${v.line}  →  ${v.text}`);
    }
    console.log('');
}
console.log('İhlal olan satırda kasıtlı istisna için satır sonuna `// mfa-ignore` ekleyebilirsin.\n');
process.exit(1);
