import { createOptimizedPicture } from '../../scripts/aem.js';

/** Authored image with rounded corners. Optional caption in a second row. */
export default function decorate(block) {
  if (block.querySelector(':scope > figure')) return;
  const image = block.querySelector('img');
  if (!image) { block.replaceChildren(); return; }
  const caption = [...block.querySelectorAll(':scope > div')]
    .filter((row) => !row.querySelector('img'))
    .map((row) => row.textContent.trim().replace(/\s+/g, ' '))
    .find(Boolean);
  const picture = createOptimizedPicture(image.src, image.alt, false, [
    { media: '(min-width: 600px)', width: '2000' },
    { width: '750' },
  ]);
  const figure = document.createElement('figure');
  figure.append(picture);
  if (caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;
    figure.append(figcaption);
  }
  const { width, height } = image;
  const img = picture.querySelector('img');
  if (width && height) {
    img.width = width;
    img.height = height;
  }
  block.replaceChildren(figure);
}
