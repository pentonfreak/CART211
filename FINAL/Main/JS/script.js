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
    state = {}
}