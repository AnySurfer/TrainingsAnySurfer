export const languages = {
    en: 'English',
    fr: 'Français',
    nl: 'Nederlands',
};

export const defaultLang = 'fr';

export const ui = {
    en: {
        'navigation-dock.previous': 'previous chapter',
        'navigation-dock.next': 'next chapter',
        'navigation-dock.above': 'previous slide',
        'navigation-dock.below': 'next slide',
        'navigation-dock.chapter': 'Chapter',
        'navigation-dock.slide': 'Slide',
        'navigation-dock.of': 'of',
    },
    fr: {
        'navigation-dock.previous': 'chapitre précédent',
        'navigation-dock.next': 'chapitre suivant',
        'navigation-dock.above': 'diapositive précédente',
        'navigation-dock.below': 'diapositive suivante',
        'navigation-dock.chapter': 'Chapitre',
        'navigation-dock.slide': 'Diapositive',
        'navigation-dock.of': 'sur',
    },
    nl: {
        'navigation-dock.previous': 'vorig hoofdstuk',
        'navigation-dock.next': 'volgend hoofdstuk',
        'navigation-dock.above': 'vorige dia',
        'navigation-dock.below': 'volgende dia',
        'navigation-dock.chapter': 'Hoofdstuk',
        'navigation-dock.slide': 'Dia',
        'navigation-dock.of': 'van',
    },
} as const;
