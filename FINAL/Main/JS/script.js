const STORAGE = 'archive-state';
const defaults = {
    hero: 'Adventurer',
    role: 'explorer',
    contract: false,
    contractRead: false,
    quest: '',
    purchase: '',
    gold: 100,
    signals: [],
};

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
