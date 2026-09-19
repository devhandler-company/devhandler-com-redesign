/** Two authored cells per row: question and rich-text answer. */
export default function decorate(block) {
  if (block.querySelector(':scope > .faq-item')) return;
  const items = [];
  [...block.children].forEach((row) => {
    const [question, answer] = row.children;
    const title = question?.textContent.trim();
    if (!title) return;
    const hasAnswer = Boolean(answer?.textContent.trim() || answer?.querySelector('img'));
    const item = document.createElement(hasAnswer ? 'details' : 'div');
    item.className = 'faq-item';
    const heading = document.createElement('h3');
    heading.textContent = title;
    if (hasAnswer) {
      const summary = document.createElement('summary');
      summary.append(heading);
      item.append(summary);
      const content = document.createElement('div');
      content.className = 'faq-answer';
      content.append(...answer.childNodes);
      content.querySelectorAll('a').forEach((link) => {
        let safe = false;
        const href = link.getAttribute('href')?.trim();
        try {
          safe = Boolean(href) && !(/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))
            && ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location).protocol);
        } catch { /* Incomplete authoring stays readable. */ }
        if (!safe) link.replaceWith(...link.childNodes);
        else if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
      });
      item.append(content);
      if (!items.length && block.classList.contains('first-open')) item.open = true;
    } else {
      item.classList.add('faq-unanswered');
      item.append(heading);
    }
    items.push(item);
  });
  block.replaceChildren(...items);
}
