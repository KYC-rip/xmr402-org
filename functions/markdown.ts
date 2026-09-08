function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function markdownToHtml(md: string): string {
  if (!md) return '';

  // Extract and stash fenced code blocks
  const codeBlocks: string[] = [];
  let text = md.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length;
    const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : '';
    codeBlocks.push(`<pre><code${langAttr}>${escapeHtml(code.trimEnd())}</code></pre>`);
    return `<!--CODEBLOCK_${idx}-->`;
  });

  // Extract and stash inline code
  const inlineCodes: string[] = [];
  text = text.replace(/`([^`\n]+)`/g, (_match, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `<!--INLINECODE_${idx}-->`;
  });

  const lines = text.split('\n');
  const htmlOut: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (inList) {
      htmlOut.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      htmlOut.push('</blockquote>');
      inBlockquote = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      let tHtml = '<table>\n';
      const header = tableRows[0];
      tHtml += '  <thead><tr>\n';
      for (const cell of header) {
        tHtml += `    <th>${cell}</th>\n`;
      }
      tHtml += '  </tr></thead>\n';

      if (tableRows.length > 1) {
        tHtml += '  <tbody>\n';
        for (let r = 1; r < tableRows.length; r++) {
          tHtml += '    <tr>\n';
          for (const cell of tableRows[r]) {
            tHtml += `      <td>${cell}</td>\n`;
          }
          tHtml += '    </tr>\n';
        }
        tHtml += '  </tbody>\n';
      }
      tHtml += '</table>';
      htmlOut.push(tHtml);
      inTable = false;
      tableRows = [];
    }
  };

  const processInline = (s: string): string => {
    return s
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />`)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => `<a href="${escapeHtml(href)}">${label}</a>`)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      flushBlockquote();
      const rawCells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
      if (rawCells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }
      inTable = true;
      tableRows.push(rawCells.map((c) => processInline(c)));
      continue;
    } else {
      flushTable();
    }

    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      flushList();
      flushBlockquote();
      htmlOut.push('<hr />');
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      const title = processInline(headingMatch[2]);
      htmlOut.push(`<h${level}>${title}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushList();
      if (!inBlockquote) {
        htmlOut.push('<blockquote>');
        inBlockquote = true;
      }
      const quoteText = processInline(trimmed.replace(/^>\s*/, ''));
      htmlOut.push(`<p>${quoteText}</p>`);
      continue;
    } else {
      flushBlockquote();
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (inList !== 'ul') {
        flushList();
        htmlOut.push('<ul>');
        inList = 'ul';
      }
      htmlOut.push(`<li>${processInline(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        flushList();
        htmlOut.push('<ol>');
        inList = 'ol';
      }
      htmlOut.push(`<li>${processInline(olMatch[2])}</li>`);
      continue;
    }

    if (!trimmed) {
      flushList();
      flushBlockquote();
      continue;
    }

    flushList();
    flushBlockquote();
    if (trimmed.startsWith('<!--CODEBLOCK_') && trimmed.endsWith('-->')) {
      htmlOut.push(trimmed);
    } else {
      htmlOut.push(`<p>${processInline(trimmed)}</p>`);
    }
  }

  flushList();
  flushBlockquote();
  flushTable();

  let finalHtml = htmlOut.join('\n');
  finalHtml = finalHtml.replace(/<!--INLINECODE_(\d+)-->/g, (_m, idx) => inlineCodes[parseInt(idx, 10)] ?? '');
  finalHtml = finalHtml.replace(/<!--CODEBLOCK_(\d+)-->/g, (_m, idx) => codeBlocks[parseInt(idx, 10)] ?? '');

  return finalHtml;
}
