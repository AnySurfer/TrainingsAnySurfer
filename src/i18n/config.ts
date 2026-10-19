export const i18n = {
  locales: ['en', 'fr', 'nl'],
  defaultLocale: 'fr',
} as const

export type Locale = (typeof i18n.locales)[number]
export const defaultLang = i18n.defaultLocale
