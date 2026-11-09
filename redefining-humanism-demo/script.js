// Redefining Humanism — small, beginner-friendly JavaScript enhancements.
// Page content and styling are in index.html and style.css.
const pages = [...document.querySelectorAll('.page')];
const previousButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#chapter-menu');
const links = document.querySelector('#chapter-links');
let currentPage = 1;
let foundingValue = null;
let contactChoice = null;

pages.forEach((page, i) => {
  const link = document.createElement('a');
  link.href = `#page-${i + 1}`;
  link.textContent = `${String(i + 1).padStart(2, '0')}  /  ${page.dataset.title}`;
  links.appendChild(link);
});

function openPage(number) {
  const target = Math.max(1, Math.min(pages.length, number));
  currentPage = target;
  pages.forEach((page, i) => {
    const active = (i + 1) === target;
    page.hidden = !active;
    page.classList.toggle('is-active', active);
  });
  document.querySelector('#page-number').textContent = String(target).padStart(2, '0');
  document.querySelector('#progress-fill').style.width = `${target * 10}%`;
  previousButton.disabled = target === 1;
  nextButton.disabled = target === pages.length;
  [...links.children].forEach((link, i) => {
    if (i + 1 === target) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  document.title = `${pages[target - 1].dataset.title} — Redefining Humanism`;
  if (window.location.hash !== `#page-${target}`) history.replaceState(null, '', `#page-${target}`);
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function pageFromHash() {
  const match = location.hash.match(/^#page-(\d+)$/);
  openPage(match ? Number(match[1]) : 1);
}
previousButton.addEventListener('click', () => openPage(currentPage - 1));
nextButton.addEventListener('click', () => openPage(currentPage + 1));
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => openPage(currentPage + 1)));
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  menuButton.setAttribute('aria-expanded', String(!menu.hidden));
});
links.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link) { event.preventDefault(); openPage(Number(link.hash.replace('#page-', ''))); }
});
window.addEventListener('hashchange', pageFromHash);

const borderButton = document.querySelector('#toggle-borders');
borderButton.addEventListener('click', () => {
  const removed = document.querySelector('#world-globe').classList.toggle('no-borders');
  borderButton.textContent = removed ? 'Restore the borders →' : 'Remove the borders →';
  document.querySelector('#borders-feedback').textContent = removed ? 'The planet has not changed. Only the lines have.' : 'The same planet, with or without our lines.';
});

const valueDescriptions = {
  Knowledge: 'A commitment to asking questions, learning, and sharing discoveries.',
  Freedom: 'A commitment to individual dignity, liberty, and responsibility.',
  Cooperation: 'A commitment to building solutions across our differences.'
};
document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
  foundingValue = button.dataset.choice;
  document.querySelectorAll('[data-choice]').forEach(b => b.classList.toggle('selected', b === button));
  document.querySelector('#priority-display').textContent = foundingValue.toUpperCase();
  document.querySelector('#priority-description').textContent = valueDescriptions[foundingValue];
  document.querySelector('#summary-priority').textContent = foundingValue;
}));
const contactDescriptions = {
  Listen: 'You chose to begin by listening and learning.',
  'Reach out': 'You chose to reach out with care and humility.',
  Wait: 'You chose to observe before making contact.'
};
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  contactChoice = button.dataset.contact;
  document.querySelectorAll('[data-contact]').forEach(b => b.classList.toggle('selected', b === button));
  document.querySelector('#contact-feedback').textContent = contactDescriptions[contactChoice];
  document.querySelector('#summary-contact').textContent = contactChoice;
}));
document.querySelector('#restart').addEventListener('click', () => openPage(1));
pageFromHash();
