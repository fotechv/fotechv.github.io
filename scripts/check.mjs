import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function files(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.isDirectory()) result.push(...await files(path.join(dir, item.name)));
    else if (item.name.endsWith('.html')) result.push(path.join(dir, item.name));
  }
  return result;
}
const pages = await files(root);
const articles = (await readdir(new URL('../content/projects/', import.meta.url))).filter(name => name.endsWith('.md'));
assert.equal(pages.length, articles.length + 3, 'Expected homepage, project index, all project articles and 404');
let checked = 0;
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: exactly one h1`);
  assert.ok(html.includes('lang="vi"'), `${file}: Vietnamese language`);
  assert.ok(html.includes('name="description"'), `${file}: SEO description`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(link)) continue;
    const [resource, fragment] = link.split('#');
    const relative = resource.split('?')[0];
    let target = relative ? path.resolve(relative.startsWith('/') ? root : path.dirname(file), '.' + (relative.startsWith('/') ? relative : '/' + relative)) : file;
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    await stat(target);
    if (fragment) assert.ok((await readFile(target, 'utf8')).includes(`id="${fragment}"`), `Missing anchor ${link} in ${file}`);
    checked++;
  }
}
console.log(`Passed: ${pages.length} HTML pages, ${checked} local links/assets/anchors, language, titles and metadata.`);
