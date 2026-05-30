// check-tokens-sync.mjs için saf-Node testleri (node --test).
//
// Script'i MFA_LINT_ROOT ile sahte bir palet köküne yönlendirip çıkış kodunu
// doğrularız: 3 dosya senkronsa exit 0, biri ayrışırsa (drift) exit 1.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../check-tokens-sync.mjs', import.meta.url));

// Kanonik (senkron) marka hex'leri — gerçek MFA paleti (sentetik kullanım).
const SYNCED = {
    red: '#DA291C',
    gold: '#D7AD4D',
    gray: '#53565A',
    navy: '#003773',
    navyDark: '#00235A',
    danger: '#C81D1D'
};

function scss(c) {
    return `:root {\n  --mfa-red: ${c.red};\n  --mfa-gold: ${c.gold};\n  --mfa-gray: ${c.gray};\n  --mfa-navy: ${c.navy};\n  --mfa-navy-dark: ${c.navyDark};\n  --mfa-danger: ${c.danger};\n}\n`;
}

function preset(c) {
    return `import { definePreset } from '@primeuix/themes';\nexport const MfaPreset = definePreset({}, {\n  primary: '${c.red}', gold: '${c.gold}', gray: '${c.gray}', navy: '${c.navy}', danger: '${c.danger}'\n});\n`;
}

function designTokens(c) {
    return `export const brandColors = {\n  red: { hex: '${c.red}' },\n  gold: { hex: '${c.gold}' },\n  gray: { hex: '${c.gray}' },\n  navy: { hex: '${c.navy}' },\n  navyDark: { hex: '${c.navyDark}' },\n  danger: { hex: '${c.danger}' }\n};\n`;
}

// scss = kanonik; preset/tokens override edilerek drift kurgulanabilir.
function makeFixture({ scssColors = SYNCED, presetColors = SYNCED, tokensColors = SYNCED } = {}) {
    const root = mkdtempSync(join(tmpdir(), 'mfa-tokens-'));
    const files = {
        'src/assets/mfa-tokens.scss': scss(scssColors),
        'src/app/core/config/theme.config.ts': preset(presetColors),
        'src/app/core/config/design-tokens.ts': designTokens(tokensColors)
    };
    for (const [rel, content] of Object.entries(files)) {
        const full = join(root, rel);
        mkdirSync(dirname(full), { recursive: true });
        writeFileSync(full, content, 'utf8');
    }
    return root;
}

function run(root) {
    return spawnSync(process.execPath, [SCRIPT], {
        env: { ...process.env, MFA_LINT_ROOT: root },
        encoding: 'utf8'
    });
}

test('3 palet dosyası senkronken exit 0 döner', () => {
    const root = makeFixture();
    try {
        const res = run(root);
        assert.equal(res.status, 0, res.stdout + res.stderr);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});

test('design-tokens.ts ayrışınca (drift) exit 1 döner', () => {
    const root = makeFixture({ tokensColors: { ...SYNCED, red: '#FF0000' } });
    try {
        const res = run(root);
        assert.equal(res.status, 1, 'drift exit 1 bekleniyordu');
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});

test('theme.config.ts preset ayrışınca exit 1 döner', () => {
    const root = makeFixture({ presetColors: { ...SYNCED, navy: '#123456' } });
    try {
        const res = run(root);
        assert.equal(res.status, 1, 'preset drift exit 1 bekleniyordu');
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
