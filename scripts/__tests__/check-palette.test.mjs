// check-palette.mjs için saf-Node testleri (node --test).
//
// Script'i MFA_LINT_ROOT ile sahte bir src/app köküne yönlendirip çıkış kodunu
// doğrularız: temiz kod exit 0; hex/tailwind/cdn/import ihlali exit 1;
// `// mfa-ignore` ihlali bastırır (exit 0).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../check-palette.mjs', import.meta.url));

function makeFixture(files) {
    const root = mkdtempSync(join(tmpdir(), 'mfa-palette-'));
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

function withFixture(files, fn) {
    const root = makeFixture(files);
    try {
        fn(run(root));
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
}

test('temiz component (semantic sınıf + token) exit 0 döner', () => {
    withFixture(
        {
            'src/app/pages/temiz.ts': `import { Component } from '@angular/core';\n@Component({ selector: 'app-temiz', template: '<p-button severity="primary" class="bg-primary text-primary">Tamam</p-button>' })\nexport class TemizComponent {}\n`
        },
        (res) => assert.equal(res.status, 0, res.stdout + res.stderr)
    );
});

test('hardcoded hex (HEX) ihlalinde exit 1 döner', () => {
    withFixture(
        {
            'src/app/pages/hex.ts': `export const renk = '#DA291C';\n`
        },
        (res) => {
            assert.equal(res.status, 1);
            assert.match(res.stdout, /HEX/);
        }
    );
});

test('sabit Tailwind rengi (TAILWIND) ihlalinde exit 1 döner', () => {
    withFixture(
        {
            'src/app/pages/tw.ts': `import { Component } from '@angular/core';\n@Component({ selector: 'app-tw', template: '<div class="bg-red-500">x</div>' })\nexport class TwComponent {}\n`
        },
        (res) => {
            assert.equal(res.status, 1);
            assert.match(res.stdout, /TAILWIND/);
        }
    );
});

test('harici CDN URL (CDN) ihlalinde exit 1 döner', () => {
    withFixture(
        {
            'src/app/pages/cdn.ts': `export const logo = 'https://cdn.ornek-disari.com/logo.png';\n`
        },
        (res) => {
            assert.equal(res.status, 1);
            assert.match(res.stdout, /CDN/);
        }
    );
});

test('// mfa-ignore ihlali bastırır (exit 0)', () => {
    withFixture(
        {
            'src/app/pages/ignore.ts': `export const renk = '#DA291C'; // mfa-ignore\n`
        },
        (res) => assert.equal(res.status, 0, res.stdout + res.stderr)
    );
});

test('features/* içinde uikit’te gösterilmemiş PrimeNG import (IMPORT) exit 1 döner', () => {
    withFixture(
        {
            // uikit boş → hiçbir modül sanctioned değil; features import'u ihlal
            'src/app/features/vize/vize.ts': `import { GalleriaModule } from 'primeng/galleria';\nexport class Vize {}\n`
        },
        (res) => {
            assert.equal(res.status, 1);
            assert.match(res.stdout, /IMPORT/);
        }
    );
});

test('features import’u uikit’te gösterilmişse (sanctioned) exit 0 döner', () => {
    withFixture(
        {
            'src/app/pages/uikit/tablodemo.ts': `import { TableModule } from 'primeng/table';\nexport class TabloDemo {}\n`,
            'src/app/features/vize/vize.ts': `import { TableModule } from 'primeng/table';\nexport class Vize {}\n`
        },
        (res) => assert.equal(res.status, 0, res.stdout + res.stderr)
    );
});
