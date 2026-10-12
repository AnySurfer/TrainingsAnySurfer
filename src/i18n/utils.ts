import { ui } from './ui'
import { i18n, defaultLang, type Locale } from './config'

export function getPreferredLang(preferences: readonly string[]): Locale {
  for (const preference of preferences) {
    const locale = preference.toLowerCase().split('-')[0]
    if (i18n.locales.includes(locale as Locale)) return locale as Locale
  }
  return defaultLang
}

export function getLangFromUrl(url: URL, base = '/'): Locale {
  const prefix = base.replace(/\/$/, '')
  const pathname =
    prefix && url.pathname.startsWith(`${prefix}/`)
      ? url.pathname.slice(prefix.length)
      : url.pathname
  const locale = pathname.split('/')[1]
  return i18n.locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLang
}

export function useTranslations(lang: Locale) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}
