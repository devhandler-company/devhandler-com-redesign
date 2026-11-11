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
  const founder = block.classList.contains('founder');
  const eyebrow = text(fields.get('eyebrow') || fields.get('label'));
  if (founder && eyebrow) {
    const label = document.createElement('p');
    label.className = 'quote-eyebrow';
    label.textContent = eyebrow;
    figure.prepend(label);
  }
  const portraitCell = fields.get('portrait');
  const portrait = portraitCell?.querySelector('picture, img');
  const portraitPath = /^\/(?!\/)\S+$/.test(text(portraitCell)) ? text(portraitCell) : '';
  if (author || role || (portrait && !founder)) {
    const caption = document.createElement('figcaption');
    if (portrait && !founder) {
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
  if (founder) {
    // The founder card shows a large cut-out photo that overhangs the card; it is
    // authored as an inline image or as a repo path with a `-2x` sibling file.
    const image = portrait?.matches('img') ? portrait : portrait?.querySelector('img');
    let photo;
    if (image) {
      photo = createOptimizedPicture(image.src, author, false, [{ width: '1070' }]);
    } else if (portraitPath) {
      photo = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = `${portraitPath} 1x, ${portraitPath.replace(/(\.\w+)$/, '-2x$1')} 2x`;
      const img = document.createElement('img');
      img.src = portraitPath;
      img.alt = author;
      img.loading = 'lazy';
      img.width = 535;
      img.height = 400;
      photo.append(source, img);
    }
    if (photo) {
      photo.classList.add('quote-photo');
      figure.append(photo);
    }
  }
  block.replaceChildren(figure);
}
