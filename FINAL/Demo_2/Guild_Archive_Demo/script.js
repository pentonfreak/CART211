const STORAGE = 'guild_archive_demo_v1';
const defaults = {
  hero: 'Wanderer',
  role: 'guardian',
  contract: false,
  contractRead: false,
  quest: '',
  purchase: '',
  gold: 150,
  signals: [],
};

const recommendedItems = new Map([
  ['save', 'Aegis Shield'],
  ['treasure', 'Silver Dagger'],
  ['investigate', 'Seer Lens'],
]);

const merchants = new Map([
  ['save', {
    text: 'You chose to protect strangers. A shield would suit someone so willing to put themselves in danger.',
    item: 'shield',
  }],
  ['treasure', {
    text: 'I hear you know the value of silver. Perhaps a precise blade would be worth your investment.',
    item: 'dagger',
  }],
  ['investigate', {
    text: 'I have something for those who cannot leave a mystery untouched. Take a closer look.',
    item: 'lens',
  }],
]);

let state;
try {
  state = {
    ...defaults,
    ...JSON.parse(sessionStorage.getItem(STORAGE) || '{}'),
  };
} catch {
  state = { ...defaults };
}

function save() {
  sessionStorage.setItem(STORAGE, JSON.stringify(state));
  refresh();
}

function updateText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function refresh() {
  updateText('[data-hero]', state.hero);
  updateText('[data-role]', state.role.toUpperCase());
  updateText('[data-gold]', state.gold);
  updateText('[data-signals]', state.signals.length);
  updateText('[data-contract]', state.contract ? 'SIGNED' : 'PENDING');
  updateText('[data-quest]', state.quest || 'UNDECIDED');
  updateText('[data-recommendation]', recommendedItems.get(state.quest) || 'Unknown');
}

function signal(type, value) {
  state.signals.push({
    type,
    value,
    at: new Date().toISOString().slice(11, 19),
  });
  save();
}

// Shared navigation and chapter state
const page = Number(document.body.dataset.page || 1);
document.querySelector('#mobile-menu')?.addEventListener('click', () => {
  document.querySelector('.left').classList.toggle('open');
});

document.querySelectorAll('[data-chapter]').forEach((link) => {
  if (+link.dataset.chapter === page) {
    link.classList.add('active');
  }
});

// Chapter 1: adventurer registration
if (page === 1) {
  document.querySelectorAll('[data-role-option]').forEach((button) => {
    button.addEventListener('click', () => {
      state.role = button.dataset.roleOption;
      document.querySelectorAll('[data-role-option]').forEach((option) => {
        option.classList.toggle('selected', option === button);
        option.setAttribute('aria-pressed', String(option === button));
      });
      save();
    });

    if (button.dataset.roleOption === state.role) {
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
    }
  });

  const field = document.querySelector('#hero-name');
  field.value = state.hero === 'Wanderer' ? '' : state.hero;

  document.querySelector('#start')?.addEventListener('click', () => {
    state.hero = field.value.trim().slice(0, 22) || 'Wanderer';
    signal('registration', state.role);
    location.href = 'page-02.html';
  });
}

// Chapter 2: contract review and acceptance
if (page === 2) {
  const contract = document.querySelector('#contract-text');
  contract.addEventListener('scroll', () => {
    if (contract.scrollTop + contract.clientHeight >= contract.scrollHeight - 15) {
      state.contractRead = true;
      save();
      document.querySelector('#read-state').textContent = 'DOCUMENT REVIEWED';
    }
  }, { passive: true });

  document.querySelector('#contract-check').addEventListener('change', (event) => {
    document.querySelector('#accept').disabled = !event.target.checked;
  });

  document.querySelector('#accept').addEventListener('click', () => {
    state.contract = true;
    signal('agreement', 'guild membership');
    location.href = 'page-03.html';
  });

  document.querySelector('#read-state').textContent = state.contractRead
    ? 'DOCUMENT REVIEWED'
    : 'DOCUMENT UNREAD';
}

// Chapter 3: quest choices and consequences
if (page === 3) {
  const results = {
    save: {
      title: 'A debt of gratitude',
      body: 'You rush into the burning square and carry a trapped child to safety. The villagers speak your name with relief. An unseen Guild scribe quietly records how quickly you acted without the promise of a reward.',
      reaction: 'COMPASSION / HIGH — You appear motivated by protecting others.',
    },
    treasure: {
      title: 'The abandoned strongbox',
      body: 'You slip through the smoke and recover a locked strongbox from the deserted mill. Inside: a few silver crowns. As you turn, you notice the Guild messenger watching from the road, making notes.',
      reaction: 'REWARD / HIGH — Financial incentives may influence future choices.',
    },
    investigate: {
      title: 'A suspicious pattern',
      body: 'You trace the tracks beyond the village and discover that the monsters fled before the fire began. Someone had arranged the attack. The Guild seal appears on a torn dispatch nearby.',
      reaction: 'CURIOSITY / HIGH — Secrets and unanswered questions hold your attention.',
    },
  };

  function displayQuest() {
    const result = results[state.quest];
    if (!result) {
      return;
    }

    document.querySelector('#quest-result').classList.remove('hidden');
    document.querySelector('#result-title').textContent = result.title;
    document.querySelector('#result-body').textContent = result.body;
    document.querySelector('#guild-inference').textContent = result.reaction;
    document.querySelectorAll('[data-quest-option]').forEach((button) => {
      button.classList.toggle('selected', button.dataset.questOption === state.quest);
    });
  }

  document.querySelectorAll('[data-quest-option]').forEach((button) => {
    button.addEventListener('click', () => {
      state.quest = button.dataset.questOption;
      signal('quest choice', state.quest);
      displayQuest();
    });
  });

  displayQuest();

  document.querySelector('#next-quest').addEventListener('click', () => {
    if (!state.quest) {
      alert('Choose your response before continuing.');
      return;
    }
    location.href = 'page-04.html';
  });
}

// Chapter 4: personalized merchant and purchases
if (page === 4) {
  const quest = state.quest;
  const merchant = merchants.get(quest) || {
    text: 'Every adventurer has a preference. I simply try to guess yours.',
    item: '',
  };

  document.querySelector('#merchant-line').textContent = merchant.text;
  document.querySelector('#merchant-hint').textContent = quest
    ? 'RECOMMENDATION BASED ON A PREVIOUS QUEST CHOICE'
    : 'NO PRIOR QUEST RECORD FOUND';

  if (merchant.item) {
    document.querySelector(`[data-item="${merchant.item}"]`)?.classList.add('recommended');
  }

  if (state.purchase) {
    document.querySelector('#purchase-status').textContent =
      `Previously acquired: ${state.purchase}. The Guild remembers.`;
  }

  document.querySelectorAll('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => {
      const cost = Number(button.dataset.price);
      const item = button.dataset.buy;

      if (state.purchase) {
        document.querySelector('#purchase-status').textContent =
          'You have already made your purchase in this demo.';
        return;
      }
      if (state.gold < cost) {
        document.querySelector('#purchase-status').textContent = 'Not enough gold.';
        return;
      }

      state.gold -= cost;
      state.purchase = item;
      signal('purchase', item);
      document.querySelector('#purchase-status').textContent =
        `Purchased ${item} for ${cost} gold. A new preference has been added to your Guild record.`;
    });
  });

  document.querySelector('#ledger')?.addEventListener('click', () => {
    const records = state.signals
      .map((entry, index) => `${index + 1}. ${entry.type}: ${entry.value}`)
      .join('\n') || 'No records';
    alert(`YOUR LOCAL GUILD LEDGER\n\n${records}\n\nStored only in this browser tab.`);
  });
}

// Shared local-record reset
document.querySelector('#clear-data')?.addEventListener('click', () => {
  sessionStorage.removeItem(STORAGE);
  location.href = 'page-01.html';
});

refresh();
