/** One native table: CSS presents each complete row as a card on narrow screens. */
export default function decorate(block) {
  if (block.querySelector(':scope > table')) return;
  const rows = [...block.children];
  const headings = [...(rows.shift()?.children || [])].map((cell) => cell.textContent.trim());
  if (!headings.length) { block.replaceChildren(); return; }
  const columns = Math.max(headings.length, ...rows.map((row) => row.children.length));
  while (headings.length < columns) headings.push('Details');
  const table = document.createElement('table');
  table.setAttribute('role', 'table');
  const title = block.closest('.section')?.querySelector('h2')?.textContent.trim();
  if (title) {
    const caption = document.createElement('caption');
    caption.className = 'table-caption';
    caption.textContent = title;
    table.append(caption);
  }
  const head = document.createElement('thead');
  const body = document.createElement('tbody');
  head.setAttribute('role', 'rowgroup');
  body.setAttribute('role', 'rowgroup');
  const header = document.createElement('tr');
  header.setAttribute('role', 'row');
  headings.forEach((label) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.setAttribute('role', 'columnheader');
    cell.textContent = label || 'Details';
    header.append(cell);
  });
  head.append(header);
  rows.forEach((source) => {
    if (!source.textContent.trim() && !source.querySelector('img')) return;
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');
    headings.forEach((label, index) => {
      const rowHeader = block.classList.contains('results') && index === 0;
      const cell = document.createElement(rowHeader ? 'th' : 'td');
      cell.setAttribute('role', rowHeader ? 'rowheader' : 'cell');
      if (rowHeader) cell.scope = 'row';
      const marker = document.createElement('span');
      marker.className = 'table-cell-label';
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = label;
      if (!rowHeader) cell.append(marker);
      const content = document.createElement('div');
      content.className = 'table-cell-content';
      if (source.children[index]) content.append(...source.children[index].childNodes);
      if (rowHeader && !content.textContent.trim()) content.append(label || 'Details');
      cell.append(content);
      row.append(cell);
    });
    body.append(row);
  });
  table.append(head, body);
  block.replaceChildren(table);
  block.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href')?.trim();
    let safe = false;
    try {
      safe = Boolean(href) && !(/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))
        && ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location).protocol);
    } catch { /* Invalid authored links remain readable as text. */ }
    if (!safe) link.replaceWith(...link.childNodes);
    else if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
  });
}
