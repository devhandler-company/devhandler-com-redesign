const DEFAULT_THANK_YOU_HEADING = 'Thanks for reaching out!';
const DEFAULT_THANK_YOU_MESSAGE = "We've received your message and will be in touch within 24 hours.";
const DEFAULT_SUBMIT_LABEL = 'Submit';
const DEFAULT_SCHEDULE_LABEL = 'Schedule a call';
const ERROR_MESSAGE = 'Something went wrong. Please try again.';

let instanceCount = 0;

/** Read authored key/value rows into a lookup keyed by normalized label text. */
function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [labelCell, valueCell] = row.children;
    const label = labelCell?.textContent.trim().toLowerCase();
    if (label) config[label] = valueCell;
  });
  return config;
}

function textOf(cell) {
  return cell?.textContent.trim() || '';
}

function linkOf(cell) {
  return cell?.querySelector('a[href]') || null;
}

function urlOf(cell) {
  return linkOf(cell)?.href || textOf(cell);
}

function buildEyebrow(config) {
  const text = textOf(config.eyebrow);
  if (!text) return null;
  const eyebrow = document.createElement('p');
  eyebrow.className = 'form-eyebrow';
  eyebrow.textContent = text;
  return eyebrow;
}

/**
 * Unwrap a cell's single authored paragraph so inline markup can be reused as-is.
 */
function inlineNodesOf(cell) {
  if (!cell) return [];
  const paragraphs = [...cell.querySelectorAll(':scope > p')];
  if (paragraphs.length === 1) return [...paragraphs[0].childNodes];
  return [...cell.childNodes];
}

function buildTitle(config) {
  const title = document.createElement('h2');
  title.className = 'form-title';
  const nodes = inlineNodesOf(config.title);
  if (nodes.length) title.append(...nodes);
  else title.textContent = "Here's what happens after you...";
  return title;
}

/**
 * Read badge items from the Labels cell. Authors sometimes format this as a real
 * bullet list, but often just as separate lines/paragraphs — support both.
 */
function readLabelItems(cell) {
  if (!cell) return [];
  const listItems = [...cell.querySelectorAll('li')];
  const paragraphs = [...cell.querySelectorAll('p')];
  let source = [cell];
  if (listItems.length) source = listItems;
  else if (paragraphs.length) source = paragraphs;

  return source
    .flatMap((element) => {
      const copy = element.cloneNode(true);
      copy.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
      return copy.textContent.split(/\r?\n/);
    })
    .map((text) => text.trim())
    .filter(Boolean);
}

function buildLabels(config) {
  const items = readLabelItems(config.labels);
  if (!items.length) return null;

  const list = document.createElement('ul');
  list.className = 'form-labels';
  items.forEach((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  return list;
}

function buildAfterText(config) {
  const text = textOf(config['after label text']);
  if (!text) return null;
  const paragraph = document.createElement('p');
  paragraph.className = 'form-after-text';
  paragraph.textContent = text;
  return paragraph;
}

function buildIntro(config) {
  const intro = document.createElement('div');
  intro.className = 'form-intro';
  [buildEyebrow(config), buildTitle(config), buildLabels(config), buildAfterText(config)]
    .filter(Boolean)
    .forEach((element) => intro.append(element));
  return intro;
}

function buildField(tag, type, name, labelText, required, instanceId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';
  const fieldId = `form-${instanceId}-${name}`;

  const label = document.createElement('label');
  label.className = 'form-field-label';
  label.textContent = labelText;
  label.htmlFor = fieldId;

  const field = document.createElement(tag);
  field.id = fieldId;
  field.name = name;
  field.className = 'form-input';
  if (tag === 'input') field.type = type;
  field.placeholder = labelText;
  if (required) field.required = true;

  wrapper.append(label, field);
  return wrapper;
}

function buildConsent() {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-consent';

  const label = document.createElement('label');
  label.className = 'form-consent-label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'privacy';
  checkbox.required = true;

  const text = document.createElement('span');
  text.textContent = 'I accept the Privacy Policy and Cookie Terms*';

  label.append(checkbox, text);
  wrapper.append(label);
  return wrapper;
}

function buildFields(instanceId) {
  const fields = document.createElement('div');
  fields.className = 'form-fields';
  fields.append(
    buildField('input', 'text', 'name', 'Full name*', true, instanceId),
    buildField('input', 'tel', 'phone', 'Phone number*', true, instanceId),
    buildField('input', 'email', 'email', 'Enter your email*', true, instanceId),
    buildField('input', 'text', 'industry', 'Enter your project industry', false, instanceId),
    buildField('textarea', null, 'description', 'Describe your project', false, instanceId),
    buildConsent(),
  );
  return fields;
}

function buildActions(config) {
  const actions = document.createElement('div');
  actions.className = 'form-actions';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'form-submit';
  submit.textContent = textOf(config['submit label']) || DEFAULT_SUBMIT_LABEL;
  actions.append(submit);

  const scheduleLink = linkOf(config['schedule link']);
  if (scheduleLink?.href) {
    const schedule = document.createElement('a');
    schedule.className = 'form-schedule';
    schedule.href = scheduleLink.href;
    schedule.target = '_blank';
    schedule.rel = 'noopener noreferrer';
    schedule.textContent = scheduleLink.textContent.trim() || DEFAULT_SCHEDULE_LABEL;
    actions.append(schedule);
  }

  return actions;
}

function buildError() {
  const error = document.createElement('p');
  error.className = 'form-error';
  error.textContent = ERROR_MESSAGE;
  error.hidden = true;
  return error;
}

function buildThankYou(config) {
  const thankYou = document.createElement('div');
  thankYou.className = 'form-thank-you';

  const heading = document.createElement('h3');
  heading.tabIndex = -1;
  heading.textContent = textOf(config['thank you heading']) || DEFAULT_THANK_YOU_HEADING;

  const message = document.createElement('p');
  message.textContent = textOf(config['thank you message']) || DEFAULT_THANK_YOU_MESSAGE;

  thankYou.append(heading, message);
  return { thankYou, heading };
}

function handleSubmit(form, endpoint, config) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('.form-submit');
    const schedule = form.querySelector('.form-schedule');
    const error = form.querySelector('.form-error');
    error.hidden = true;
    submit.disabled = true;
    if (schedule) schedule.setAttribute('aria-disabled', 'true');

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Submission failed: ${response.status}`);

      const { thankYou, heading } = buildThankYou(config);
      form.replaceWith(thankYou);
      heading.focus();
    } catch {
      error.hidden = false;
      submit.disabled = false;
      if (schedule) schedule.removeAttribute('aria-disabled');
    }
  });
}

export default function decorate(block) {
  const config = readConfig(block);
  const endpoint = urlOf(config.endpoint);
  instanceCount += 1;

  const card = document.createElement('div');
  card.className = 'form-card';

  const intro = buildIntro(config);

  const form = document.createElement('form');
  form.className = 'form-panel';
  form.append(buildFields(instanceCount), buildActions(config), buildError());

  const submit = form.querySelector('.form-submit');
  if (!endpoint) {
    submit.disabled = true;
  } else {
    handleSubmit(form, endpoint, config);
  }

  card.append(intro, form);
  block.replaceChildren(card);
}
