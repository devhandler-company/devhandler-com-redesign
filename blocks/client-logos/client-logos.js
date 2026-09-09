/** One accessible roster, with decorative desktop marquee copies. */
export default function decorate(block) {
  if (block.querySelector(':scope > .client-logos-list')) return;
  const list = document.createElement('ul');
  list.className = 'client-logos-list';
  list.setAttribute('role', 'list');
  let heading;

  [...block.children].forEach((row) => {
    const [nameCell, imageCell, surfaceCell] = row.children;
    const name = nameCell?.textContent.trim();
    if (!name) return;
    if (name.toLowerCase() === 'heading') {
      const text = imageCell?.textContent.trim();
      if (text) {
        heading = document.createElement('h2');
        heading.className = 'client-logos-heading';
        heading.textContent = text;
      }
      return;
    }

    const item = document.createElement('li');
    item.className = 'client-logos-item';
    if (surfaceCell?.textContent.trim().toLowerCase() === 'light') {
      item.classList.add('client-logos-light');
    }
    const authoredImage = imageCell?.querySelector('img');
    const raw = authoredImage?.getAttribute('src')
      || imageCell?.querySelector('a[href]')?.getAttribute('href')
      || imageCell?.textContent.trim();
    let url;
    if (raw) {
      try {
        const candidate = new URL(raw, window.location.href);
        if (['http:', 'https:'].includes(candidate.protocol)) url = candidate.href;
      } catch { /* An invalid asset falls back to the client name. */ }
    }

    const label = document.createElement('span');
    label.className = 'client-logos-name';
    label.textContent = name;
    item.append(label);
    if (url) {
      const img = authoredImage || document.createElement('img');
      const picture = authoredImage?.closest('picture');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      // The cell reserves a fixed image slot; names remain readable if loading fails.
      if (!img.hasAttribute('width')) img.width = 192;
      if (!img.hasAttribute('height')) img.height = 64;
      const bundled = new URL('/blocks/client-logos/', window.location.href).href;
      if (!picture && url.startsWith(bundled)
        && /\/(rx|maytag|helios|smartcat|dhl|languagewire|sonova)\.webp$/.test(url)) {
        img.srcset = `${url} 1x, ${url.replace('.webp', '-2x.webp')} 2x, ${url.replace('.webp', '-3x.webp')} 3x`;
      }
      img.addEventListener('error', () => {
        item.classList.remove('client-logos-has-image');
        (picture || img).remove();
      }, { once: true });
      if (!authoredImage) img.src = url;
      item.classList.add('client-logos-has-image');
      item.append(picture || img);
      if (img.complete && !img.naturalWidth && img.getAttribute('src')) {
        item.classList.remove('client-logos-has-image');
        (picture || img).remove();
      }
    }
    list.append(item);
  });

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(list);

  // Short lists remain static: each moving group must cover the capped viewport.
  if (list.children.length >= 12) {
    const rows = document.createElement('div');
    rows.className = 'client-logos-rows';
    rows.setAttribute('aria-hidden', 'true');
    const items = [...list.children];
    const midpoint = Math.ceil(items.length / 2);
    [items.slice(0, midpoint), items.slice(midpoint)].forEach((clients) => {
      const row = document.createElement('div');
      row.className = 'client-logos-row';
      const track = document.createElement('div');
      track.className = 'client-logos-track';
      // 224 px logo slots + 40 px spacing, moving at 40 CSS px per second.
      track.style.setProperty('--client-logos-duration', `${(clients.length * 264) / 40}s`);
      for (let repeat = 0; repeat < 2; repeat += 1) {
        const group = document.createElement('div');
        group.className = 'client-logos-group';
        clients.forEach((client) => {
          const copy = document.createElement('div');
          copy.className = client.className;
          [...client.childNodes].forEach((node) => copy.append(node.cloneNode(true)));
          copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
          copy.querySelector('img')?.addEventListener('error', () => {
            copy.classList.remove('client-logos-has-image');
            copy.querySelector('picture, img')?.remove();
          }, { once: true });
          group.append(copy);
        });
        track.append(group);
      }
      row.append(track);
      rows.append(row);
    });
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'client-logos-toggle';
    toggle.textContent = 'Pause animation';
    toggle.addEventListener('click', () => {
      const paused = block.classList.toggle('client-logos-paused');
      toggle.textContent = paused ? 'Resume animation' : 'Pause animation';
    });
    block.classList.add('client-logos-animated');
    block.append(rows, toggle);
  }
}
