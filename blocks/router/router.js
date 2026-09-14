function cellText(cell) {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  copy.querySelectorAll('p').forEach((p) => p.after(' '));
  return copy.textContent.trim().replace(/\s+/g, ' ');
}

function linkHref(link) {
  const href = link?.getAttribute('href')?.trim();
  if (!href || (/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))) return '';
  try {
    return ['https:', 'http:'].includes(new URL(href, window.location.href).protocol) ? href : '';
  } catch {
    return '';
  }
}

/** One authored row: optional number, linked title, optional description. */
export default function decorate(block) {
  if (block.querySelector(':scope > .router-list')) return;
  const list = document.createElement('ul');
  list.className = 'router-list';
  list.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    const [numberCell, titleCell, descriptionCell] = row.children;
    const title = cellText(titleCell);
    if (!title) return;
    const sourceLink = titleCell.querySelector('a[href]');
    const href = linkHref(sourceLink);
    const item = document.createElement('li');
    const entry = document.createElement(href ? 'a' : 'div');
    entry.className = 'router-entry';
    if (href) {
      entry.setAttribute('href', href);
      if (sourceLink.target) entry.target = sourceLink.target;
      if (sourceLink.rel) entry.rel = sourceLink.rel;
      if (entry.target === '_blank') entry.relList.add('noopener', 'noreferrer');
    }
    const number = cellText(numberCell);
    if (number) {
      const index = document.createElement('span');
      index.className = 'router-index';
      index.setAttribute('aria-hidden', 'true');
      index.textContent = number;
      entry.append(index);
    }
    const content = document.createElement('span');
    content.className = 'router-content';
    const heading = document.createElement('span');
    heading.className = 'router-title';
    heading.textContent = title;
    content.append(heading);
    const description = cellText(descriptionCell);
    if (description) {
      const text = document.createElement('span');
      text.className = 'router-description';
      text.textContent = description;
      content.append(text);
    }
    entry.append(content);
    if (href) {
      const arrow = document.createElement('span');
      arrow.className = 'router-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      entry.append(arrow);
    }
    item.append(entry);
    list.append(item);
  });
  block.replaceChildren(list);
}
