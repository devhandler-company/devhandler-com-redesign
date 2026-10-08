/** A labeled note with optional rich text; keep unknown rows readable. */
export default function decorate(block) {
  if (block.querySelector(':scope > .callout-content')) return;
  const content = document.createElement('div');
  content.className = 'callout-content';
  const label = document.createElement('div');
  label.className = 'callout-label';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';
    if (key === 'label') {
      cells.slice(1).forEach((cell) => label.append(...cell.childNodes));
    } else if (key === 'content' || key === 'body') {
      cells.slice(1).forEach((cell) => content.append(...cell.childNodes));
    } else cells.forEach((cell) => content.append(...cell.childNodes));
  });
  block.replaceChildren();
  if (label.textContent.trim()) block.append(label);
  block.append(content);
}
