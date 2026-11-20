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
    function setChapterNavigationOpen(isOpen) {
        chapterNavigation.hidden = !isOpen;
        chapterMenuButton.setAttribute('aria-expanded', String(isOpen));
        chapterMenuButton.setAttribute(
            'aria-label',
            isOpen ? 'Close chapter navigation' : 'Open chapter navigation',
        );
    }

    chapterMenuButton.addEventListener('click', () => {
        setChapterNavigationOpen(chapterNavigation.hidden);
    });

    document.addEventListener('click', (event) => {
        if (
            !chapterNavigation.hidden
            && !chapterNavigation.contains(event.target)
            && !chapterMenuButton.contains(event.target)
        ) {
            setChapterNavigationOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !chapterNavigation.hidden) {
            setChapterNavigationOpen(false);
            chapterMenuButton.focus();
        }
    });
}
