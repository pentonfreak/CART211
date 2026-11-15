(() => {
  'use strict';

  // Shared session data and defaults used by all chapters.
  const page = Number(document.body.dataset.page || 1),
    key = 'rh_demo_v2',
    initial = {
      start: Date.now(),
      clicks: 0,
      visited: [],
      values: [],
      choice: '',
      moral: '',
      diplomacy: '',
      civilization: { Freedom: 25, Security: 25, Knowledge: 25, Cooperation: 25 },
      contact: '',
    };
  let data;
  try {
    data = { ...initial, ...JSON.parse(sessionStorage.getItem(key) || '{}') };
  } catch {
    data = { ...initial };
  }
  const save = () => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };
  const $ = (id) => document.getElementById(id);
  const esc = (t) =>
    String(t).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  const mark = (node, selector) => {
    document.querySelectorAll(selector).forEach((b) => {
      const yes = b === node;
      b.classList.toggle('selected', yes);
      b.setAttribute('aria-pressed', String(yes));
    });
  };

  // Shared visit tracking and chapter-menu behavior.
  if (!data.visited.includes(page)) data.visited.push(page);
  save();
  document.addEventListener(
    'click',
    () => {
      data.clicks++;
      save();
    },
    true,
  );
  const menu = $('chapter-menu'),
    menubtn = $('menu-button');
  if (menubtn && menu) {
    menubtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menubtn.setAttribute('aria-expanded', String(open));
    });
    $('close-menu').addEventListener('click', () => {
      menu.classList.remove('open');
      menubtn.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.classList.remove('open');
        menubtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Chapter 2: collect the visitor's selected human qualities.
  if (page === 2) {
    const cards = [...document.querySelectorAll('[data-value]')],
      update = () => {
        cards.forEach((b) => {
          const yes = data.values.includes(b.dataset.value);
          b.classList.toggle('selected', yes);
          b.setAttribute('aria-pressed', String(yes));
        });
        $('value-count').innerHTML = data.values.length + '<span>/5</span>';
        $('value-summary').textContent = data.values.length
          ? 'You selected: ' + data.values.join(', ') + '.'
          : 'Select one or more qualities to start defining your perspective.';
      };
    cards.forEach((b) =>
      b.addEventListener('click', () => {
        const v = b.dataset.value;
        data.values = data.values.includes(v)
          ? data.values.filter((x) => x !== v)
          : [...data.values, v];
        save();
        update();
      }),
    );
    update();
  }

  // Chapter 3: record a choice and reveal how the interface nudges attention.
  if (page === 3) {
    const buttons = [...document.querySelectorAll('[data-choice]')];
    buttons.forEach((b) => {
      b.classList.toggle('selected', b.dataset.choice === data.choice);
      b.setAttribute('aria-pressed', String(b.dataset.choice === data.choice));
      b.addEventListener('click', () => {
        data.choice = b.dataset.choice;
        mark(b, '[data-choice]');
        save();
      });
    });
    $('reveal-nudge').addEventListener('click', () => {
      $('nudge-result').textContent =
        'Notice the "recommended" badge, brighter color, and stronger visual weight on Proposal A. This is a simple example of a nudge: the design shapes attention before you decide.';
    });
  }

  // Chapter 4: display local activity metrics and a deliberately limited profile.
  if (page === 4) {
    const fmt = (s) =>
      String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    const render = () => {
      $('stat-clicks').textContent = String(data.clicks).padStart(2, '0');
      $('stat-time').textContent = fmt(Math.floor((Date.now() - data.start) / 1000));
      $('stat-pages').textContent = String(data.visited.length).padStart(2, '0');
      $('stat-choices').textContent = String(
        [data.values.length > 0, data.choice, data.moral, data.diplomacy, data.contact].filter(
          Boolean,
        ).length,
      ).padStart(2, '0');
    };
    render();
    setInterval(render, 1000);
    const profile = [
      ['Possible priority', data.values[0] || 'Not enough information'],
      ['Decision preference', data.choice || 'Unknown'],
      ['Interest inferred', 'Philosophy / digital society'],
      ['Confidence', 'LOW — tiny sample'],
    ];
    $('profile-rows').innerHTML = profile
      .map(
        ([a, b]) => `<div class="profile-row"><span>${esc(a)}</span><span>${esc(b)}</span></div>`,
      )
      .join('');
    $('compare-profile').addEventListener('click', () => {
      $('profile-reveal').textContent =
        'This profile draws exaggerated conclusions from only a few interactions. A data profile is not the whole person. We cannot know your identity, beliefs, or intent from this demonstration.';
    });
  }

  // Chapter 5: explain the imbalance between data collection and data access.
  if (page === 5)
    $('power-reveal').addEventListener('click', () => {
      $('power-result').textContent =
        'The power imbalance is not just more data. It is unequal access to what is known, how predictions are made, and how those predictions can be used to shape behavior.';
    });

  // Chapter 6: save the visitor's choice in the ethical dilemma.
  if (page === 6) {
    document.querySelectorAll('[data-moral]').forEach((b) => {
      b.classList.toggle('selected', b.dataset.moral === data.moral);
      b.setAttribute('aria-pressed', String(b.dataset.moral === data.moral));
      b.addEventListener('click', () => {
        data.moral = b.dataset.moral;
        mark(b, '[data-moral]');
        save();
        $('moral-result').textContent = {
          'Protect civil liberty':
            'This protects personal autonomy but may leave some risks harder to anticipate.',
          'Prioritize public safety':
            'This may reduce some threats, but grants powerful institutions broader oversight.',
          'Seek limited oversight':
            'This asks for clear limits, accountability and safeguards — all difficult to enforce.',
        }[data.moral];
      });
    });
    if (data.moral) $('moral-result').textContent = 'Previous selection: ' + data.moral;
  }

  // Chapter 7: record a diplomacy approach for the divided civilization.
  if (page === 7) {
    const map = {
      Cooperation:
        'The regions share resources and build trust, but must coordinate burdens fairly.',
      Competition:
        'Each region protects its interests, increasing the possibility of distrust and unequal outcomes.',
      Negotiation:
        'The regions create a forum for compromise. Progress may be slower, but disagreement remains possible.',
    };
    document.querySelectorAll('[data-diplomacy]').forEach((b) => {
      b.classList.toggle('selected', b.dataset.diplomacy === data.diplomacy);
      b.setAttribute('aria-pressed', String(b.dataset.diplomacy === data.diplomacy));
      b.addEventListener('click', () => {
        data.diplomacy = b.dataset.diplomacy;
        mark(b, '[data-diplomacy]');
        save();
        $('diplomacy-result').textContent = map[data.diplomacy];
      });
    });
    if (data.diplomacy) $('diplomacy-result').textContent = map[data.diplomacy];
  }

  // Chapter 8: keep the civilization priorities balanced to a total of 100 points.
  if (page === 8) {
    const names = ['Freedom', 'Security', 'Knowledge', 'Cooperation'];
    let vals = { ...data.civilization };
    if (
      names.some((n) => !Number.isFinite(vals[n])) ||
      names.reduce((sum, n) => sum + vals[n], 0) !== 100
    )
      vals = { Freedom: 25, Security: 25, Knowledge: 25, Cooperation: 25 };
    const sliders = $('civ-sliders');
    sliders.innerHTML = names
      .map(
        (n) =>
          `<label class="slider-row"><span>${esc(n)}</span><input aria-label="${esc(n)} priority" type="range" min="0" max="100" step="1" value="${vals[n]}" data-slider="${esc(n)}"><output>${vals[n]}</output></label>`,
      )
      .join('');
    const visual = document.createElement('div');
    visual.className = 'civ-visual-bars';
    visual.setAttribute('aria-label', 'Civilization priorities visualization');
    $('civ-outcome').after(visual);
    const refresh = () => {
      sliders.querySelectorAll('input').forEach((input) => {
        const n = input.dataset.slider;
        input.value = vals[n];
        input.nextElementSibling.textContent = vals[n];
      });
      $('civ-total').textContent = names.reduce((sum, n) => sum + vals[n], 0);
      const ordered = [...names].sort((x, y) => vals[y] - vals[x]);
      $('civ-outcome').textContent =
        `Your model prioritizes ${ordered[0].toLowerCase()} and ${ordered[1].toLowerCase()}. These priorities do not predict real social outcomes.`;
      visual.innerHTML = names
        .map(
          (n) =>
            `<div class="barline"><span>${esc(n)}</span><div class="track"><div class="fill" style="width:${vals[n]}%"></div></div><strong>${vals[n]}</strong></div>`,
        )
        .join('');
    };
    sliders.addEventListener('input', (event) => {
      const input = event.target;
      if (!input.matches('[data-slider]')) return;
      const name = input.dataset.slider,
        target = Number(input.value),
        old = vals[name],
        delta = target - old;
      const others = names.filter((n) => n !== name);
      if (delta > 0) {
        let need = delta;
        for (const n of [...others].sort((x, y) => vals[y] - vals[x])) {
          const take = Math.min(vals[n], need);
          vals[n] -= take;
          need -= take;
          if (need === 0) break;
        }
        vals[name] = target - need;
      } else if (delta < 0) {
        let extra = -delta;
        vals[name] = target;
        for (const n of [...others].sort((x, y) => vals[x] - vals[y])) {
          const add = Math.min(100 - vals[n], extra);
          vals[n] += add;
          extra -= add;
          if (extra === 0) break;
        }
      }
      data.civilization = { ...vals };
      save();
      refresh();
    });
    refresh();
    $('save-civ').addEventListener('click', () => {
      data.civilization = { ...vals };
      save();
      $('civ-saved').textContent =
        'Saved for your reflection on page 10. You can change these values at any time.';
    });
  }

  // Chapter 9: record the response to hypothetical first contact.
  if (page === 9) {
    const responses = {
      Observe:
        'Caution gives us time to learn, but silence could be interpreted in unexpected ways.',
      Respond:
        "Openness may begin cooperation, but we cannot predict the other civilization's intentions.",
      Withdraw: 'Non-engagement may limit immediate risk, but also closes the door to discovery.',
    };
    document.querySelectorAll('[data-contact]').forEach((b) => {
      b.classList.toggle('selected', b.dataset.contact === data.contact);
      b.setAttribute('aria-pressed', String(b.dataset.contact === data.contact));
      b.addEventListener('click', () => {
        data.contact = b.dataset.contact;
        mark(b, '[data-contact]');
        save();
        $('contact-result').textContent = responses[data.contact];
      });
    });
    if (data.contact) $('contact-result').textContent = responses[data.contact];
  }

  // Chapter 10: summarize saved choices and offer copy/restart controls.
  if (page === 10) {
    const entries = [
      ['Human qualities', data.values.join(', ') || 'Not selected'],
      ['Peace and choice', data.choice || 'Not selected'],
      ['Moral priority', data.moral || 'Not selected'],
      ['Divided civilization', data.diplomacy || 'Not selected'],
      [
        'Ideal civilization',
        Object.entries(data.civilization)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map((x) => x[0] + ': ' + x[1])
          .join(' / '),
      ],
      ['First contact', data.contact || 'Not selected'],
    ];
    $('reflection-list').innerHTML = entries
      .map(
        ([name, v]) =>
          `<div class="reflection-item"><small>${esc(name)}</small><span>${esc(v)}</span></div>`,
      )
      .join('');
    const copy = $('copy-reflection');
    if (copy)
      copy.addEventListener('click', async () => {
        const message =
          'REDEFINING HUMANISM — MY REFLECTION\n' +
          entries.map(([k, v]) => k + ': ' + v).join('\n') +
          '\nWhat kind of civilization should we become?';
        try {
          await navigator.clipboard.writeText(message);
          $('reflection-copy-status').textContent = 'Copied your reflection.';
        } catch {
          const field = document.createElement('textarea');
          field.value = message;
          document.body.append(field);
          field.select();
          const copied = document.execCommand('copy');
          field.remove();
          $('reflection-copy-status').textContent = copied
            ? 'Copied your reflection.'
            : 'Copy unavailable in this browser; you can select the text above.';
        }
      });
    $('restart').addEventListener('click', () => {
      if (confirm('Restart the experience and erase your locally saved choices?')) {
        sessionStorage.removeItem(key);
        location.href = 'page-01.html';
      }
    });
  }
})();
