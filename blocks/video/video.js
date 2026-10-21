function mediaURL(value) {
  try {
    const url = new URL(value, window.location.href);
    return value && ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

/** Render the authored Source/settings table as a native inline video. */
export default function decorate(block) {
  const fields = new Map([...block.children].map((row) => [
    row.firstElementChild?.textContent.trim().toLowerCase(), row.children[1],
  ]));
  const text = (name) => fields.get(name)?.textContent.trim() || '';
  const sourceCell = fields.get('source');
  const source = mediaURL(sourceCell?.querySelector('a[href]')?.getAttribute('href')
    || text('source'));
  const frame = document.createElement('div');
  frame.className = 'video-frame';
  const status = document.createElement('p');
  status.className = 'video-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  frame.append(status);
  block.replaceChildren(frame);

  if (!source) {
    status.textContent = 'Add a valid video Source URL to display this video.';
    status.hidden = false;
    return;
  }

  const video = document.createElement('video');
  video.playsInline = true;
  video.setAttribute('aria-label', text('title') || 'Video');
  const decorative = block.classList.contains('no-interactive');
  video.controls = !decorative && text('controls').toLowerCase() !== 'none';
  video.loop = block.classList.contains('loop');
  const autoplay = block.classList.contains('autoplay');
  // Muted playback is required for reliable inline autoplay.
  video.muted = autoplay || block.classList.contains('muted');
  video.defaultMuted = video.muted;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  video.autoplay = autoplay && !motion.matches;
  const preload = text('preload').toLowerCase();
  video.preload = ['auto', 'metadata', 'none'].includes(preload) ? preload : 'metadata';
  const posterCell = fields.get('poster');
  const poster = mediaURL(posterCell?.querySelector('img')?.getAttribute('src')
    || posterCell?.querySelector('a[href]')?.getAttribute('href') || text('poster'));
  if (poster) video.poster = poster;

  const fit = text('fit').toLowerCase() || (block.classList.contains('contain') ? 'contain' : 'cover');
  video.style.objectFit = ['contain', 'cover'].includes(fit) ? fit : 'cover';
  const ratio = text('aspect ratio').toLowerCase();
  const dimensions = ratio.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
  const fixedRatio = dimensions && Number(dimensions[1]) > 0 && Number(dimensions[2]) > 0;
  if (fixedRatio) {
    frame.style.aspectRatio = `${dimensions[1]} / ${dimensions[2]}`;
  }
  video.addEventListener('loadedmetadata', () => {
    // Reserve a frame before loading, then preserve the clip's native proportions.
    if (!fixedRatio && video.videoWidth && video.videoHeight) {
      frame.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
  });

  if (block.classList.contains('no-keyboard') || decorative) video.tabIndex = -1;
  if (block.classList.contains('no-context-menu')) {
    video.addEventListener('contextmenu', (event) => event.preventDefault());
  }
  if (decorative) video.classList.add('video-non-interactive');

  const showControls = () => {
    video.controls = true;
    video.removeAttribute('tabindex');
    video.classList.remove('video-non-interactive');
  };
  const syncMotion = () => {
    if (motion.matches) {
      video.autoplay = false;
      video.pause();
      showControls();
    }
  };
  syncMotion();
  motion.addEventListener('change', syncMotion);

  video.addEventListener('error', () => {
    video.hidden = true;
    status.textContent = 'This video is currently unavailable. ';
    const link = document.createElement('a');
    link.href = source;
    link.textContent = 'Open video';
    status.append(link);
    status.hidden = false;
  }, { once: true });

  frame.prepend(video);
  video.src = source;
  if (video.autoplay) {
    video.play().catch(() => {
      // Keep playback reachable when the browser declines autoplay.
      if (!video.error) showControls();
    });
  }
}
