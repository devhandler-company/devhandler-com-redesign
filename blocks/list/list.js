function cellText(cell) {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  copy.querySelectorAll('p').forEach((p) => p.after(' '));
  return copy.textContent.trim().replace(/\s+/g, ' ');
}

/** One list item per authored title/description row; rows without a title are skipped. */
export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'list-items';
  list.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    const [titleCell, descriptionCell] = row.children;
    const title = cellText(titleCell);
    if (!title) return;
    const item = document.createElement('li');
    const marker = document.createElement('span');
    marker.className = 'list-marker';
    marker.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    content.className = 'list-content';
    const heading = document.createElement('p');
    heading.className = 'list-title';
    heading.textContent = title;
    content.append(heading);
    if (descriptionCell && descriptionCell.textContent.trim()) {
      descriptionCell.className = 'list-description';
      content.append(descriptionCell);
    }
    item.append(marker, content);
    list.append(item);
  });
  block.replaceChildren(list);
}
