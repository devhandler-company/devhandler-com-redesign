/** A heading, supporting copy and authored action links. */
export default function decorate(block) {
  if (block.querySelector(':scope > .cta-content')) return;
  const content = document.createElement('div');
  content.className = 'cta-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });
  if (!content.textContent.trim() && !content.querySelector('img')) {
    block.replaceChildren();
    return;
  }
  content.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href')?.trim();
    let safe = false;
    try {
      safe = Boolean(href) && !(/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))
        && ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location).protocol);
    } catch { /* Do not create interactive controls for invalid destinations. */ }
    if (!safe) link.replaceWith(...link.childNodes);
    else if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
  });
  const actions = document.createElement('div');
  actions.className = 'cta-actions';
  content.querySelectorAll('p').forEach((paragraph) => {
    const links = [...paragraph.querySelectorAll('a[href]')];
    if (!links.length || paragraph.textContent.replace(/\s/g, '')
      !== links.map((link) => link.textContent.replace(/\s/g, '')).join('')) return;
    links.forEach((link) => {
      if (!link.textContent.trim()) {
        link.replaceWith(...link.childNodes);
        return;
      }
      const secondary = link.classList.contains('secondary')
        || Boolean(link.closest('em') || link.querySelector('em'));
      link.textContent = link.textContent.trim();
      link.classList.add('button', secondary ? 'secondary' : 'primary');
      actions.append(link);
    });
    if (!paragraph.textContent.trim()) paragraph.remove();
  });
  if (actions.children.length) content.append(actions);
  block.replaceChildren(content);
}
