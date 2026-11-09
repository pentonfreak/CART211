// All interaction records are kept in browser memory only. Nothing is uploaded.
const state = { chapter: 1, visited: new Set([1]), clicks: 0, started: Date.now(), choices: {}, sliders: { freedom: 50, security: 50, science: 50 } };
const $ = id => document.getElementById(id);
const chapters = [...document.querySelectorAll('.chapter')];
const nav = $('chapterNav');
const menuToggle = $('menuToggle');

function goToChapter(number) {
  const chapter = Math.max(1, Math.min(10, Number(number) || 1));
  state.chapter = chapter;
  state.visited.add(chapter);
  chapters.forEach(section => {
    const current = Number(section.dataset.chapter) === chapter;
    section.classList.toggle('active', current);
    section.setAttribute('aria-hidden', String(!current));
  });
  document.querySelectorAll('[data-nav]').forEach(a => {
    const current = Number(a.dataset.nav) === chapter;
    a.classList.toggle('active', current);
    if (current) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  $('progressBar').style.width = `${chapter * 10}%`;
  $('progressBar').setAttribute('aria-valuenow', chapter);
  $('navProgress').textContent = `${String(chapter).padStart(2,'0')} / 10`;
  $('dockCurrent').textContent = String(chapter).padStart(2,'0');
  $('pagesVisited').textContent = state.visited.size;
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({top: 0, behavior: 'instant'});
  if (chapter === 10) updateSummary();
  history.replaceState(null, '', `#chapter-${chapter}`);
}
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('[data-nav]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); goToChapter(link.dataset.nav);
}));
document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => goToChapter(b.dataset.next)));
document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => goToChapter(b.dataset.prev)));

document.addEventListener('click', e => {
  if (e.target.closest('button, a, input')) { state.clicks++; $('clickCount').textContent = state.clicks; }
});

const responses = {
  value: {
    Freedom: 'Freedom reminds us that a human future must leave room for dissent and independent thought.',
    Knowledge: 'Knowledge can illuminate our choices — but who controls the systems that produce and organize it?',
    Compassion: 'Compassion asks us to consider the people whose lives are affected by our technologies.'
  },
  headline: {
    Hope: 'You selected the quieter story. The framing of an interface may influence attention, but it cannot fully determine your choice.',
    Fear: 'You selected the more sensational headline. Notice how the “TRENDING” badge and dramatic wording competed for your attention.'
  },
  peace: {
    Safety: 'You chose the promise of security. Who decides what counts as dangerous behavior — and what happens when the system gets it wrong?',
    Autonomy: 'You chose autonomy. How might society respond to serious dangers without building systems of constant surveillance?'
  },
  contact: {
    Cooperation: 'You chose cooperation: seeking common ground even when the unknown is frightening.',
    Caution: 'You chose observation: learning before acting, while recognizing the limits of what you know.',
    Isolation: 'You chose isolation: valuing independence, but possibly losing the opportunities that contact could bring.'
  }
};
document.querySelectorAll('[data-choice-group] .choice-card').forEach(btn => btn.addEventListener('click', () => {
  const group = btn.closest('[data-choice-group]').dataset.choiceGroup;
  const value = btn.dataset.value;
  state.choices[group] = value;
  btn.closest('[data-choice-group]').querySelectorAll('.choice-card').forEach(b => {
    const selected = b === btn;
    b.classList.toggle('selected', selected);
    b.setAttribute('aria-pressed', String(selected));
  });
  const result = $(`${group}Response`);
  if (result) result.textContent = responses[group]?.[value] || value;
}));

function sliderSummary() {
  const labels = [['freedom','Individual freedom'],['security','Collective security'],['science','Scientific discovery']];
  const sorted = [...labels].sort((a,b) => state.sliders[b[0]] - state.sliders[a[0]]);
  return state.sliders[sorted[0][0]] === state.sliders[sorted[1][0]] ? 'Balanced priorities' : sorted[0][1];
}
['freedom','security','science'].forEach(name => {
  const input = $(`${name}Slider`);
  input.addEventListener('input', () => {
    const value = Number(input.value);
    state.sliders[name] = value;
    $(`${name}Output`).textContent = value;
    $('civilizationResponse').textContent = `Your highest priority: ${sliderSummary()}. Which values might conflict with that priority?`;
  });
});

document.querySelectorAll('[data-policy]').forEach(btn => btn.addEventListener('click', () => {
  $('policyResponse').textContent = btn.dataset.policy + ' Who benefits, who decides, and who can refuse?';
}));

function updateSummary() {
  $('summaryValue').textContent = state.choices.value || 'Not chosen';
  $('summaryPeace').textContent = state.choices.peace === 'Safety' ? 'Safety first' : state.choices.peace === 'Autonomy' ? 'Autonomy first' : 'Not chosen';
  $('summaryContact').textContent = state.choices.contact || 'Not chosen';
  $('summaryPriority').textContent = sliderSummary();
}

function formatTime(seconds){ const mm = Math.floor(seconds / 60); const ss = seconds % 60; return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }
setInterval(() => { $('sessionTime').textContent = formatTime(Math.floor((Date.now() - state.started) / 1000)); }, 1000);
function updateViewport() { $('screenWidth').textContent = `${window.innerWidth}px`; }
window.addEventListener('resize', updateViewport);
updateViewport();

$('restart').addEventListener('click', () => {
  state.choices = {};
  state.sliders = {freedom:50,security:50,science:50};
  state.visited = new Set([1]);
  state.clicks = 0;
  state.started = Date.now();
  document.querySelectorAll('.choice-card').forEach(b => {b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
  ['freedom','security','science'].forEach(name => { $(`${name}Slider`).value = 50; $(`${name}Output`).textContent = '50'; });
  ['value','headline','peace','contact'].forEach(group => {
    const el = $(`${group}Response`);
    if (el) el.textContent = ({value:'Select a value to begin building your vision.',headline:'What catches your attention?',peace:'There is no perfect answer. Every path carries a trade-off.',contact:'Your choice may reveal the kind of future you imagine.'})[group];
  });
  $('civilizationResponse').textContent = 'Your society begins with balanced priorities.';
  $('policyResponse').textContent = 'Select a policy to examine its trade-off.';
  $('copyStatus').textContent = '';
  $('clickCount').textContent = '0';
  goToChapter(1);
});
$('copySummary').addEventListener('click', async () => {
  updateSummary();
  const reflection = `Redefining Humanism — My Reflection\nFounding value: ${$('summaryValue').textContent}\nFreedom vs safety: ${$('summaryPeace').textContent}\nFirst contact: ${$('summaryContact').textContent}\nCivilization priority: ${$('summaryPriority').textContent}`;
  try { await navigator.clipboard.writeText(reflection); $('copyStatus').textContent = 'Reflection copied.'; }
  catch { $('copyStatus').textContent = 'Copy unavailable in this browser. You can select the summary above.'; }
});
window.addEventListener('hashchange', () => {
  const match = location.hash.match(/^#chapter-(10|[1-9])$/);
  if(match) goToChapter(Number(match[1]));
});
const initial = location.hash.match(/^#chapter-(10|[1-9])$/);
goToChapter(initial ? Number(initial[1]) : 1);
