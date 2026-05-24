#!/usr/bin/env node
// MFA Snippet Extractor — sıfır bağımlılık (saf Node ESM).
//
// /uikit/* demo .ts dosyalarındaki işaretli template bloklarını okuyup
// public/snippets/<sayfa>.json üretir. "Kodu Göster/Kopyala" UI'ı bu JSON'u
// fetch eder → kaynak kod tek yerde (DRY), kopya snippet tutulmaz.
//
// İşaretleme (demo template'i içinde, HTML yorumu — canlı sayfada görünmez):
//   <!-- snippet:button-default -->
//     <p-button label="Submit" />
//   <!-- /snippet -->
//
// `npm run snippets` ile çalışır. Çıktı: public/snippets/<dosyaadı>.json

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const UIKIT_DIR = join(ROOT, 'src', 'app', 'pages', 'uikit');
const OUT_DIR = join(ROOT, 'public', 'snippets');

const SNIPPET_RE = /<!--\s*snippet:([\w-]+)\s*-->([\s\S]*?)<!--\s*\/snippet\s*-->/g;

// Ortak girintiyi kaldır + baş/son boş satırları kırp.
function dedent(raw) {
    let lines = raw.replace(/\r\n/g, '\n').split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    const indents = lines.filter((l) => l.trim() !== '').map((l) => l.match(/^\s*/)[0].length);
    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map((l) => l.slice(min)).join('\n');
}

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let totalPages = 0;
let totalSnippets = 0;

for (const name of readdirSync(UIKIT_DIR)) {
    if (!name.endsWith('.ts') || name.endsWith('.spec.ts') || name.endsWith('.routes.ts')) continue;
    const content = readFileSync(join(UIKIT_DIR, name), 'utf8');
    const snippets = {};
    let m;
    SNIPPET_RE.lastIndex = 0;
    while ((m = SNIPPET_RE.exec(content)) !== null) {
        snippets[m[1]] = dedent(m[2]);
    }
    const count = Object.keys(snippets).length;
    if (count === 0) continue;
    const page = name.replace(/\.ts$/, '');
    writeFileSync(join(OUT_DIR, `${page}.json`), JSON.stringify(snippets, null, 2) + '\n', 'utf8');
    totalPages++;
    totalSnippets += count;
    console.log(`  ${page}.json  ←  ${count} snippet`);
}

console.log(`✓ Snippet extraction: ${totalSnippets} snippet, ${totalPages} sayfa → public/snippets/`);
