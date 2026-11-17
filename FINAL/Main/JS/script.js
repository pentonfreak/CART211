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

const chapterMenuButton = document.querySelector('#mobile-menu');
const chapterNavigation = document.querySelector('#chapter-select');

if (chapterMenuButton && chapterNavigation) {
    chapterMenuButton.addEventListener('click', () => {
        const isOpen = chapterNavigation.hidden;
        chapterNavigation.hidden = !isOpen;
        chapterMenuButton.setAttribute('aria-expanded', String(isOpen));
        chapterMenuButton.setAttribute(
            'aria-label',
            isOpen ? 'Close chapter navigation' : 'Open chapter navigation',
        );
    });
}
