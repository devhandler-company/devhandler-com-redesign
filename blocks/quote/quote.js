import { createOptimizedPicture } from '../../scripts/aem.js';

/** Authored quote and optional attribution. No ratings, invented speakers or scripts. */
export default function decorate(block) {
  if (block.querySelector(':scope > figure')) return;
  const fields = new Map([...block.children].map((row) => [
    row.firstElementChild?.textContent.trim().toLowerCase(), row.children[1],
  ]));
  const text = (cell) => {
    const copy = cell?.cloneNode(true);
    copy?.querySelectorAll('p, br').forEach((element) => element.after(' '));
    return copy?.textContent.trim().replace(/\s+/g, ' ') || '';
  };
  const quote = text(fields.get('quote'));
  if (!quote) { block.replaceChildren(); return; }
  const figure = document.createElement('figure');
  const body = document.createElement('blockquote');
  const paragraph = document.createElement('p');
  paragraph.textContent = quote;
  body.append(paragraph);
  figure.append(body);
  const author = text(fields.get('author'));
  const role = text(fields.get('role'));
  const portrait = fields.get('portrait')?.querySelector('picture, img');
  if (author || role || portrait) {
    const caption = document.createElement('figcaption');
    if (portrait) {
      const image = portrait.matches('img') ? portrait : portrait.querySelector('img');
      if (image) {
        caption.append(createOptimizedPicture(image.src, image.alt, false, [{ width: '150' }]));
      }
    }
    const attribution = document.createElement('div');
    if (author) {
      const name = document.createElement('strong');
      name.textContent = author;
      attribution.append(name);
    }
    if (role) {
      const detail = document.createElement('p');
      detail.textContent = role;
      attribution.append(detail);
    }
    caption.append(attribution);
    figure.append(caption);
  }
  block.replaceChildren(figure);
}
