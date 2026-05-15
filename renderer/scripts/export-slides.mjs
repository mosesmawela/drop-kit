#!/usr/bin/env node
/**
 * Export every .slide div from one or more HTML decks to PNG.
 *
 * Usage:
 *   node scripts/export-slides.mjs <htmlPath> <outDir> [width] [height]
 *
 * Defaults to 1080×1350 (4:5). Pass 1080 1080 for 1:1 squares.
 *
 * Each slide is screenshot at its natural size (the .slide div is fixed
 * width/height in CSS), so the width/height args just size the viewport
 * to comfortably hold one slide at a time.
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [, , htmlArg, outArg, wArg, hArg] = process.argv;

if (!htmlArg || !outArg) {
  console.error(
    "Usage: node scripts/export-slides.mjs <htmlPath> <outDir> [width] [height]",
  );
  process.exit(1);
}

const htmlPath = path.resolve(htmlArg);
const outDir = path.resolve(outArg);
const W = parseInt(wArg ?? "1080", 10);
const H = parseInt(hArg ?? "1350", 10);

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing HTML: ${htmlPath}`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const url = pathToFileURL(htmlPath).href;
const prefix = path.basename(htmlPath, ".html");

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W + 80, height: H + 80 },
  deviceScaleFactor: 2, // retina-grade PNGs
});
const page = await ctx.newPage();

console.log(`Loading ${url}`);
await page.goto(url, { waitUntil: "networkidle" });
// Give Google Fonts + images a beat
await page.waitForTimeout(1200);

// Hide any floating UI (.nav) so it doesn't leak into screenshots
await page.addStyleTag({
  content: `.nav, .tabs { display: none !important; visibility: hidden !important; }`,
});

const slideHandles = await page.$$(".slide");
console.log(`Found ${slideHandles.length} slides — exporting at ${W}x${H}`);

let i = 0;
for (const slide of slideHandles) {
  i += 1;
  const id = (await slide.getAttribute("id")) || `slide-${i}`;
  const outFile = path.join(outDir, `${prefix}-${String(i).padStart(2, "0")}-${id}.png`);
  await slide.screenshot({ path: outFile, omitBackground: false });
  console.log(`  ✓ ${path.basename(outFile)}`);
}

// Also emit a 6-page PDF from the same HTML
const pdfFile = path.join(outDir, `${prefix}.pdf`);
await page.pdf({
  path: pdfFile,
  width: `${W}px`,
  height: `${H}px`,
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
console.log(`  ✓ ${path.basename(pdfFile)}`);

await browser.close();
console.log(`Done. → ${outDir}`);
