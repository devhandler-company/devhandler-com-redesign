function cellText(cell) {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  copy.querySelectorAll('p').forEach((p) => p.after(' '));
  return copy.textContent.trim().replace(/\s+/g, ' ');
}

/** One ordered step per authored title/description row. */
export default function decorate(block) {
  if (block.querySelector(':scope > .process-list')) return;
  const list = document.createElement('ol');
  list.className = 'process-list';
  list.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    const [titleCell, descriptionCell] = row.children;
    const title = cellText(titleCell);
    if (!title) return;
    const item = document.createElement('li');
    const number = document.createElement('span');
    number.className = 'process-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(list.children.length + 1).padStart(2, '0');
    const heading = document.createElement('h3');
    heading.textContent = title;
    item.append(number, heading);
    const description = cellText(descriptionCell);
    if (description) {
      const text = document.createElement('p');
      text.textContent = description;
      item.append(text);
    }
    list.append(item);
  });
  block.replaceChildren(list);
}
