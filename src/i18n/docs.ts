import type { Locale } from './config'

export const docsLanguages = [
  { lang: 'fr', label: 'Français' },
  { lang: 'en', label: 'English' },
  { lang: 'nl', label: 'Nederlands' },
] as const

export const docsUi = {
  fr: {
    documentation: 'Documentation',
    brand: 'Documentation AnySurfer',
    guides: 'Les guides',
    skip: 'Aller au contenu',
    languages: 'Langues du document',
    unavailable: 'Traduction indisponible',
    all: 'Toute la documentation',
    index: 'Documentation du projet',
    missing: 'Guide introuvable',
    choose: 'Choisissez un guide dans la navigation pour commencer.',
    notFound:
      'Ce guide n’existe pas. Choisissez un document dans la navigation.',
    pagination: 'Guides précédent et suivant',
    previous: 'Précédent',
    next: 'Suivant',
  },
  en: {
    documentation: 'Documentation',
    brand: 'AnySurfer documentation',
    guides: 'Guides',
    skip: 'Skip to content',
    languages: 'Document languages',
    unavailable: 'Translation unavailable',
    all: 'All documentation',
    index: 'Project documentation',
    missing: 'Guide not found',
    choose: 'Choose a guide from the navigation to get started.',
    notFound:
      'This guide does not exist. Choose a document from the navigation.',
    pagination: 'Previous and next guides',
    previous: 'Previous',
    next: 'Next',
  },
  nl: {
    documentation: 'Documentatie',
    brand: 'AnySurfer-documentatie',
    guides: 'Handleidingen',
    skip: 'Ga naar de inhoud',
    languages: 'Documenttalen',
    unavailable: 'Vertaling niet beschikbaar',
    all: 'Alle documentatie',
    index: 'Projectdocumentatie',
    missing: 'Handleiding niet gevonden',
    choose: 'Kies een handleiding in het menu om te beginnen.',
    notFound: 'Deze handleiding bestaat niet. Kies een document in het menu.',
    pagination: 'Vorige en volgende handleiding',
    previous: 'Vorige',
    next: 'Volgende',
  },
} satisfies Record<Locale, Record<string, string>>
