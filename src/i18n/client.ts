import type { ImageMetadata } from 'astro'
import type { Locale } from './config'
import { useTranslations } from './utils'

export function translateDocument(lang: Locale, title: string) {
  const t = useTranslations(lang)
  document.documentElement.lang = lang
  document.title = `${title} — AnySurfer`
  const skip = document.querySelector('.skip-link')
  if (skip) skip.textContent = t('navigation.skip')
  const nav = document.querySelector('.site-header nav')
  nav?.setAttribute('aria-label', t('navigation.label'))
  const home = nav?.querySelector('a')
  if (home) {
    home.textContent = t('navigation.home')
    home.lang = lang
  }
  const brand = document.querySelector<HTMLAnchorElement>('.brand')
  const logo = brand?.querySelector('img')
  if (logo && brand?.dataset.logos) {
    const logos = JSON.parse(brand.dataset.logos) as Record<
      Locale,
      { image: ImageMetadata; alt: string }
    >
    const selected = logos[lang]
    logo.src = selected.image.src
    logo.width = selected.image.width
    logo.height = selected.image.height
    logo.alt = selected.alt
    brand.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${lang}/training/`
  }
}
