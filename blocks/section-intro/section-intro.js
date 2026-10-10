export default function decorate(block) {
  if (block.querySelector(':scope > .section-intro-content')) return;
  const [eyebrowRow, titleRow, subtitleRow, ctaRow] = block.children;

  const eyebrowText = eyebrowRow?.textContent.trim();
  const heading = titleRow?.querySelector('h1, h2, h3, h4, h5, h6');
  const subtitleText = subtitleRow?.textContent.trim();
  const cta = ctaRow?.querySelector('a[href]');

  const content = document.createElement('div');
  content.className = 'section-intro-content';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'section-intro-eyebrow';
    eyebrow.textContent = eyebrowText;
    content.append(eyebrow);
  }

  if (heading) {
    heading.className = 'section-intro-title';
    content.append(heading);
  }

  if (subtitleText) {
    const subtitle = document.createElement('p');
    subtitle.className = 'section-intro-subtitle';
    subtitle.textContent = subtitleText;
    content.append(subtitle);
  }

  block.replaceChildren(content);

  if (cta) {
    let safe = false;
    try {
      safe = ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(cta.href, window.location.href).protocol);
    } catch { /* Preserve incomplete authored action text without an unsafe link. */ }
    if (!safe) {
      const text = document.createElement('span');
      text.textContent = cta.textContent;
      block.append(text);
      return;
    }
    cta.className = 'section-intro-cta';
    block.append(cta);
  }
}
