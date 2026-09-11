/** Read plain text without joining words separated by authored paragraphs or breaks. */
function cellText(cell) {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  copy.querySelectorAll('p').forEach((p) => p.after(' '));
  return copy.textContent.trim().replace(/\s+/g, ' ');
}

/** Each authored row is a value and its label; statistics are not interactive. */
export default function decorate(block) {
  if (block.querySelector(':scope > .stats-list')) return;
  const list = document.createElement('dl');
  list.className = 'stats-list';
  [...block.children].forEach((row) => {
    const [valueCell, labelCell] = row.children;
    const value = cellText(valueCell);
    const label = cellText(labelCell);
    if (!value || !label) return;
    const item = document.createElement('div');
    item.className = 'stats-item';
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    item.append(term, description);
    list.append(item);
  });
  list.style.setProperty('--stats-columns', Math.min(4, list.children.length) || 1);
  block.replaceChildren(list);
}
