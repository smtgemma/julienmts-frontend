/**
 * Generates TECHNICAL_DOCUMENTATION_FRONTEND.pdf from the markdown source.
 * Usage: node scripts/generate-docs-pdf.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "docs", "TECHNICAL_DOCUMENTATION_FRONTEND.md");
const outPath = path.join(root, "docs", "TECHNICAL_DOCUMENTATION_FRONTEND.pdf");

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inCode = false;
  let inTable = false;
  let tableRows = [];
  let inList = false;

  const flushTable = () => {
    if (!tableRows.length) return;
    html += "<table>";
    tableRows.forEach((row, i) => {
      const tag = i === 0 ? "th" : "td";
      const cellTag = i === 0 ? "thead" : i === 1 ? "tbody" : "";
      if (i === 0) html += "<thead><tr>";
      else if (i === 1) html += "<tbody>";
      row.forEach((cell) => {
        const t = i === 0 ? "th" : "td";
        html += `<${t}>${formatInline(cell.trim())}</${t}>`;
      });
      html += "</tr>";
      if (i === 0) html += "</thead>";
    });
    html += "</tbody></table>";
    tableRows = [];
    inTable = false;
  };

  const formatInline = (text) => {
    let t = escapeHtml(text);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return t;
  };

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        html += "</code></pre>";
        inCode = false;
      } else {
        closeList();
        flushTable();
        html += '<pre class="code-block"><code>';
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      html += escapeHtml(line) + "\n";
      continue;
    }

    if (line.startsWith("|") && line.includes("|")) {
      closeList();
      if (!inTable) inTable = true;
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue;
      const cells = line.split("|").slice(1, -1);
      tableRows.push(cells);
      const next = lines[i + 1];
      if (!next || !next.startsWith("|")) flushTable();
      continue;
    }

    if (inTable) flushTable();

    if (line.startsWith("# ")) {
      closeList();
      html += `<h1 class="doc-title">${formatInline(line.slice(2))}</h1>`;
    } else if (line.startsWith("## ")) {
      closeList();
      html += `<h2>${formatInline(line.slice(3))}</h2>`;
    } else if (line.startsWith("### ")) {
      closeList();
      html += `<h3>${formatInline(line.slice(4))}</h3>`;
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${formatInline(line.slice(2))}</li>`;
    } else if (line.trim() === "---") {
      closeList();
      html += '<hr class="section-break" />';
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p>${formatInline(line)}</p>`;
    }
  }

  closeList();
  flushTable();
  if (inCode) html += "</code></pre>";

  return html;
}

const md = fs.readFileSync(mdPath, "utf-8");
const bodyHtml = mdToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Sales Training Platform — Frontend Technical Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 22mm 18mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a1a2e;
      margin: 0;
      padding: 0;
    }
    .cover {
      page-break-after: always;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(160deg, #f8f9fc 0%, #eef1f8 100%);
      border: 1px solid #d8dce8;
      padding: 48px 32px;
    }
    .cover-badge {
      font-size: 9pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 24px;
    }
    .cover h1 {
      font-size: 26pt;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
      line-height: 1.2;
      border: none;
    }
    .cover .subtitle {
      font-size: 14pt;
      color: #4f46e5;
      font-weight: 600;
      margin-bottom: 40px;
    }
    .cover-meta {
      width: 100%;
      max-width: 420px;
      margin-top: 32px;
      border-collapse: collapse;
      font-size: 10pt;
    }
    .cover-meta td {
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      text-align: left;
    }
    .cover-meta td:first-child {
      background: #f3f4f6;
      font-weight: 600;
      width: 38%;
    }
    .cover-footer {
      margin-top: 48px;
      font-size: 9pt;
      color: #9ca3af;
    }
    .content { padding: 0; }
    h1.doc-title {
      font-size: 18pt;
      color: #111827;
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 8px;
      margin: 0 0 20px;
      page-break-after: avoid;
    }
    h2 {
      font-size: 13pt;
      color: #1e3a5f;
      margin: 28px 0 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e5e7eb;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      color: #374151;
      margin: 18px 0 8px;
      page-break-after: avoid;
    }
    p { margin: 6px 0 10px; }
    ul { margin: 6px 0 12px; padding-left: 22px; }
    li { margin-bottom: 4px; }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 9pt;
      background: #f3f4f6;
      padding: 1px 5px;
      border-radius: 3px;
      color: #be185d;
    }
    pre.code-block {
      background: #1e293b;
      color: #e2e8f0;
      padding: 14px 16px;
      border-radius: 6px;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 10px 0 14px;
    }
    pre.code-block code {
      background: none;
      color: inherit;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
    }
    tr:nth-child(even) td { background: #f9fafb; }
    hr.section-break {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .page-header {
      position: running(header);
      font-size: 8pt;
      color: #9ca3af;
    }
    @media print {
      .cover { min-height: 257mm; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-badge">Confidential</div>
    <h1>AI Sales Training Platform</h1>
    <div class="subtitle">Technical Documentation<br/>Frontend Developer Guide &amp; Architecture Reference</div>
    <table class="cover-meta">
      <tr><td>Platform</td><td>AI Sales Training Platform</td></tr>
      <tr><td>Framework</td><td>Next.js 15 · React 19 · TypeScript</td></tr>
      <tr><td>State</td><td>Redux Toolkit · RTK Query · Redux Persist</td></tr>
      <tr><td>Real-time</td><td>WebSocket · MediaRecorder · Web Audio API</td></tr>
      <tr><td>Integrations</td><td>Stripe · Google OAuth · Recharts</td></tr>
      <tr><td>Version</td><td>1.0.0</td></tr>
      <tr><td>Status</td><td>Production Ready</td></tr>
    </table>
    <div class="cover-footer">© 2025 AI Sales Training Platform · Confidential</div>
  </div>
  <div class="content">
    ${bodyHtml}
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(fullHtml, { waitUntil: "networkidle0" });
await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#9ca3af;padding-top:4px;">
    AI Sales Training Platform — Frontend Technical Documentation · Confidential
  </div>`,
  footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#9ca3af;padding-bottom:4px;">
    © 2025 AI Sales Training Platform · Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>`,
});
await browser.close();

console.log(`PDF generated: ${outPath}`);
