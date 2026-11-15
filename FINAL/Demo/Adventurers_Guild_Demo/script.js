(() => {
  'use strict';

  // State and storage
  const KEY = 'adventurers-guild-demo-v1';
  const defaults = {
    name: 'Wanderer',
    storage: false,
    contract: false,
    quest: null,
    item: null,
    recommend: null,
    morality: null,
    finalchoice: null,
    ending: null,
    clicks: 0,
    events: [],
  };

  let memory = { ...defaults };
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      memory = { ...defaults, ...saved };
    }
  } catch (e) {}

  const page = Number(document.body.dataset.page);

  // Shared helpers
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));

  function persist() {
    if (memory.storage) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(memory));
      } catch (e) {}
    }
  }

  function record(key, value) {
    memory[key] = value;
    memory.clicks++;
    memory.events.push({ chapter: page, action: key, value });
    if (memory.events.length > 40) {
      memory.events.shift();
    }
    persist();
    paint();
  }

  function feedback(text) {
    const element = $('feedback');
    if (element) {
      element.textContent = text;
    }
  }

  function go(number) {
    location.href = `page-${String(number).padStart(2, '0')}.html`;
  }

  // Page rendering
  function recommended() {
    if (memory.quest === 'villagers' || memory.morality === 'compassion') {
      return {
        title: 'Protect the Lantern Village',
        why: 'You have shown an interest in helping others. The guild predicts you will accept a rescue mission.',
      };
    }
    if (memory.quest === 'monsters' || memory.item === 'sword') {
      return {
        title: 'The Crimson Beast Hunt',
        why: 'You seem drawn to combat and rewards. The guild predicts you will choose this hunt.',
      };
    }
    if (memory.item === 'potion' || memory.item === 'shield') {
      return {
        title: 'Guard the Northern Pass',
        why: 'Your equipment choices suggest caution. The guild recommends a defensive mission.',
      };
    }
    return {
      title: 'The Old Forest Expedition',
      why: 'You are new here. The guild starts with its most popular quest.',
    };
  }

  function renderRecommendation() {
    const recommendation = recommended();
    const element = $('recommendation');
    if (element) {
      element.innerHTML = `<span class="eyebrow">THE GUILD RECOMMENDS</span><h3>${esc(recommendation.title)}</h3><p>${esc(recommendation.why)}</p>`;
    }
  }

  function predictedChoice() {
    if (['villagers'].includes(memory.quest) || memory.morality === 'compassion') {
      return 'help';
    }
    if (memory.quest === 'monsters' || memory.morality === 'wealth' || memory.item === 'sword') {
      return 'gold';
    }
    return 'gold';
  }

  function renderPrediction() {
    const element = $('prediction');
    if (element) {
      element.textContent = `GUILDMASTER PREDICTION: You will choose to ${
        predictedChoice() === 'gold' ? 'take the gold' : 'help a stranger'
      }.`;
    }
  }

  function renderLedger() {
    const element = $('ledger-records');
    if (!element) {
      return;
    }

    const values = [
      ['Adventurer', memory.name],
      ['Contract accepted', memory.contract ? 'Yes' : 'No'],
      ['First quest', memory.quest || 'Not chosen'],
      ['Item preference', memory.item || 'Not chosen'],
      ['Followed recommendation', memory.recommend || 'Not chosen'],
      ['Moral priority', memory.morality || 'Not chosen'],
      ['Final choice', memory.finalchoice || 'Not chosen'],
      ['Recorded game selections', memory.clicks],
    ];
    element.innerHTML = values
      .map(([key, value]) => `<div class="ledger-row"><span>${esc(key)}</span><span>${esc(value)}</span></div>`)
      .join('');
  }

  function renderEndingSummary() {
    const element = $('ending-summary');
    if (element) {
      element.innerHTML = `<span class="eyebrow">YOUR ADVENTURE AT A GLANCE</span>
        <div class="ledger-row"><span>Hero</span><span>${esc(memory.name)}</span></div>
        <div class="ledger-row"><span>First quest</span><span>${esc(memory.quest || 'None')}</span></div>
        <div class="ledger-row"><span>Merchant preference</span><span>${esc(memory.item || 'None')}</span></div>
        <div class="ledger-row"><span>Following advice</span><span>${esc(memory.recommend || 'None')}</span></div>
        <div class="ledger-row"><span>Guild's recorded selections</span><span>${memory.clicks}</span></div>`;
    }
  }

  function paint() {
    const name = $('hero-label');
    if (name) {
      name.textContent = memory.name || 'Wanderer';
    }

    const gold = $('gold');
    if (gold) {
      gold.textContent = String(
        150
          + (memory.quest === 'monsters' ? 50 : 0)
          - (memory.item === 'sword'
            ? 100
            : memory.item === 'potion'
              ? 40
              : memory.item === 'shield'
                ? 75
                : 0),
      );
    }

    document.querySelectorAll('[data-pick]').forEach((element) => {
      const selected = memory[element.dataset.pick] === element.dataset.value;
      element.classList.toggle('selected', selected);
      element.setAttribute('aria-pressed', String(selected));
    });

    if (page === 5) renderRecommendation();
    if (page === 7) renderPrediction();
    if (page === 8) renderLedger();
    if (page === 10) renderEndingSummary();
  }

  // Event handlers
  const menu = $('menu-toggle');
  if (menu) {
    menu.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    if (+link.dataset.nav === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('[data-pick]').forEach((element) => {
    element.addEventListener('click', () => {
      const key = element.dataset.pick;
      const value = element.dataset.value;
      record(key, value);

      const messages = {
        quest: value === 'villagers'
          ? 'You chose compassion. The guild has taken notice.'
          : 'You chose glory and gold. The guild has taken notice.',
        item: `Merchant's note: you showed interest in ${value}.`,
        recommend: value === 'follow'
          ? 'You followed the suggested route. The guild considers this a useful signal.'
          : 'You ignored the recommendation. Independence is a signal, too.',
        morality: `You placed ${value} first. What might that say about your values?`,
        finalchoice: `Your choice ${value === predictedChoice() ? 'matched' : 'challenged'} the guildmaster's prediction. A profile is not destiny.`,
      };
      feedback(messages[key] || 'Choice recorded.');
    });
  });

  document.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', () => {
      const action = element.dataset.action;

      if (action === 'start') {
        const input = $('hero-name');
        memory.name = (input?.value.trim().slice(0, 24) || 'Wanderer').replace(/[<>]/g, '');
        location.href = `page-02.html?hero=${encodeURIComponent(memory.name)}`;
      }

      if (action === 'accept') {
        if (!$('contract-check').checked) {
          alert('Please check the agreement, or choose Continue without saving.');
          return;
        }
        memory.storage = true;
        memory.contract = true;
        memory.name = (new URLSearchParams(location.search).get('hero') || memory.name).slice(0, 24);
        persist();
        go(3);
      }

      if (action === 'skip-storage') {
        memory.storage = false;
        memory.contract = false;
        try {
          sessionStorage.removeItem(KEY);
        } catch (e) {}
        go(3);
      }

      if (action === 'erase') {
        memory = { ...defaults, storage: true };
        try {
          sessionStorage.removeItem(KEY);
        } catch (e) {}
        paint();
      }

      if (action === 'ending') {
        const value = element.dataset.value;
        if (value === 'erase') {
          memory = { ...defaults };
          try {
            sessionStorage.removeItem(KEY);
          } catch (e) {}
          feedback('Your locally stored ledger has been erased. You can now begin again.');
        } else {
          record('ending', value);
          feedback(value === 'leave'
            ? 'You leave the guild with your autonomy intact. The adventure is yours to define.'
            : 'You stay, but no longer confuse convenience with an equal bargain.');
        }
        paint();
      }
    });
  });

  // Page initialization
  if (page === 1) {
    const name = $('hero-name');
    if (name) {
      name.value = memory.name === 'Wanderer' ? '' : memory.name;
    }
  }

  paint();
})();
