// Runs automatically after `npm run build` (see "postbuild" in package.json).
// 1) Finds every asset in the build (folders with NO pages inside, plain files).
// 2) Adds the base path to every reference to them, in HTML, JS, CSS and
//    the __next data files.
// 3) Scans the result and reports anything still pointing at the domain root,
//    with the surrounding text so you can see exactly what it is.
const fs = require("fs");
const path = require("path");
const { BASE_PATH } = require("../site.config.js");

const BASE = (BASE_PATH || "").replace(/\/$/, "");
const OUT_DIR = path.join(process.cwd(), "out");

if (!BASE) {
  console.log("prefix-paths: BASE_PATH is empty, nothing to do.");
  process.exit(0);
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("prefix-paths: the 'out' folder was not found. Run the build first.");
  process.exit(1);
}

/* ---------- 1. Work out which top-level names are assets ---------- */

// true if an index.html exists anywhere inside this folder
// (so /blog, /gallery, /products are page folders, not assets)
function hasPages(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (hasPages(full)) return true;
    } else if (entry.name === "index.html") {
      return true;
    }
  }
  return false;
}

const assetNames = new Set(["catalogue", "api/catalogue-proxy"]);

for (const entry of fs.readdirSync(OUT_DIR, { withFileTypes: true })) {
  const name = entry.name;
  if (name.startsWith("_")) continue; // _next, _not-found, __next.* files

  if (entry.isDirectory()) {
    if (!hasPages(path.join(OUT_DIR, name))) assetNames.add(name); // images, videos
  } else if (![".html", ".txt"].includes(path.extname(name))) {
    assetNames.add(name); // catalogue1.pdf, globe.svg, catalogue-proxy.php ...
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
const alternatives = [...assetNames].sort((a, b) => b.length - a.length).map(escape).join("|");

// A quote, backtick or "(" followed by one of the asset paths
const ASSET_PATTERN = new RegExp("([\"'`(])/(" + alternatives + ")", "g");
const ASSET_CHECK = new RegExp("([\"'`(])/(" + alternatives + ")");

/* ---------- 2. Rewrite the files ---------- */
const TEXT_EXTENSIONS = new Set([".html", ".js", ".mjs", ".css", ".json", ".txt", ""]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

function isProcessable(file) {
  const ext = path.extname(file);
  if (!TEXT_EXTENSIONS.has(ext)) return false;
  // extension-less files are only the __next.* data files
  return ext !== "" || path.basename(file).startsWith("__next");
}

function snippet(text, regex) {
  const match = regex.exec(text);
  if (!match) return "";
  const start = Math.max(0, match.index - 50);
  return text.slice(start, match.index + 100).replace(/\s+/g, " ");
}

const NEXT_MENTION = /(["'`(=])\/_next\//;
// Real breakage: a tag that loads CSS/JS/images from the domain root
const NEXT_IN_TAG = /<(?:link|script|img|source|video)\b[^>]*\s(?:href|src)="\/_next\//;

let filesChanged = 0;
let replacements = 0;
const brokenTags = [];
const nextMentions = [];
const leftoverAssets = [];
const plainLinks = new Map();

for (const file of walk(OUT_DIR)) {
  if (!isProcessable(file)) continue;

  const original = fs.readFileSync(file, "utf8");
  let count = 0;

  const updated = original.replace(ASSET_PATTERN, (match, quote, name) => {
    count += 1;
    return `${quote}${BASE}/${name}`;
  });

  if (count > 0) {
    fs.writeFileSync(file, updated);
    filesChanged += 1;
    replacements += count;
  }

  const relative = path.relative(OUT_DIR, file);
  const isHtml = path.extname(file) === ".html";

  /* ---------- 3. Verify ---------- */
  if (isHtml && NEXT_IN_TAG.test(updated)) {
    brokenTags.push({ file: relative, text: snippet(updated, NEXT_IN_TAG) });
  }

  if (NEXT_MENTION.test(updated)) {
    nextMentions.push({ file: relative, text: snippet(updated, NEXT_MENTION) });
  }

  if (ASSET_CHECK.test(updated)) {
    leftoverAssets.push({ file: relative, text: snippet(updated, ASSET_CHECK) });
  }

  if (isHtml) {
    const plain = /\s(?:href|src|action|poster)="\/(?!\/)([^"]*)"/g;
    let hit;
    while ((hit = plain.exec(updated)) !== null) {
      const value = "/" + hit[1];
      if (value === BASE || value.startsWith(BASE + "/")) continue;
      if (!plainLinks.has(value)) plainLinks.set(value, relative);
    }
  }
}

console.log(`\nprefix-paths: added "${BASE}" to ${replacements} paths in ${filesChanged} files.`);
console.log(`prefix-paths: asset folders/files handled: ${[...assetNames].join(", ")}`);

let problems = 0;

if (brokenTags.length) {
  problems += 1;
  console.log("\n❌ Tags still loading from the domain root (these WILL break):");
  brokenTags.slice(0, 10).forEach((item) => console.log(`  ${item.file}\n    ...${item.text}...`));
}

if (nextMentions.length) {
  console.log("\nℹ️  Text containing an unprefixed /_next/ (often harmless runtime strings;");
  console.log("   only a problem if it appears in a <link>/<script> tag, which is reported above):");
  nextMentions.slice(0, 10).forEach((item) => console.log(`  ${item.file}\n    ...${item.text}...`));
}

if (leftoverAssets.length) {
  problems += 1;
  console.log("\n❌ Asset paths still unprefixed in:");
  leftoverAssets.slice(0, 10).forEach((item) => console.log(`  ${item.file}\n    ...${item.text}...`));
}

if (plainLinks.size) {
  problems += 1;
  console.log("\n❌ Plain links that still point at the domain root (change <a href=\"...\"> to");
  console.log("   <Link href=\"...\"> from next/link in the source):");
  [...plainLinks].slice(0, 25).forEach(([value, file]) => console.log(`   ${value}   (first seen in ${file})`));
}

console.log(problems === 0 ? "\n✅ prefix-paths: all checks passed.\n" : "\nFix the ❌ items above, then build again.\n");