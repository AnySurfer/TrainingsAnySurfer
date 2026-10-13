import type { ImageMetadata } from 'astro'
import type { Locale } from './config'
import { useTranslations } from './utils'
import { getAriaCurrent } from '../utils/navigation'

export function translateDocument(lang: Locale, title: string) {
  const t = useTranslations(lang)
  document.documentElement.lang = lang
  document.title = `${title} — AnySurfer`
  const skip = document.querySelector('.skip-link')
  if (skip) skip.textContent = t('navigation.skip')
  const nav = document.querySelector('.site-header nav')
  nav?.setAttribute('aria-label', t('navigation.label'))
  const home = nav?.querySelector<HTMLAnchorElement>('.home-link')
  if (home) {
    home.setAttribute('aria-label', t('navigation.home'))
    home.title = t('navigation.home')
    home.lang = lang
  }
  nav?.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    const current = getAriaCurrent(
      window.location.pathname,
      new URL(link.href).pathname,
      link.dataset.sectionPath,
    )
    if (current) link.setAttribute('aria-current', current)
    else link.removeAttribute('aria-current')
  })
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
  }
}
