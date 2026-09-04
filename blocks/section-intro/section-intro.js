export default function decorate(block) {
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
    cta.className = 'section-intro-cta';
    block.append(cta);
  }
}
