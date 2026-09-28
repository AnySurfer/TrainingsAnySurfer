import { type RevealApi } from 'reveal.js'

export default function initAnySurferWave(RevealAPI: RevealApi) {
  'use strict'

  const revealElement = RevealAPI.getRevealElement()

  if (!RevealAPI || !revealElement) {
    console.warn('AnySurfer : Reveal.js is not available')
    return
  }

  /* Prevent duplicated init  */
  if (revealElement.querySelector('.as-navigation-dock')) {
    return
  }

  /* Remove unnecessary role & aria-status announcement */
  function removeBadAria() {
    const StatusElement = revealElement && revealElement.querySelector('.aria-status')
    StatusElement && StatusElement.remove()
    revealElement && revealElement.removeAttribute('role')
  }

  removeBadAria()

  function getVerticalSlides(horizontalSlide: HTMLElement) {
    if (!horizontalSlide) {
      return [];
    }

    return Array.prototype.filter.call(
      horizontalSlide.children,
      function (child) {
        return child.tagName === "SECTION";
      }
    );
  }

  function createDock() {
    const dock = document.createElement('nav')

    dock.className = 'as-navigation-dock'

    dock.innerHTML =
      '<div class="as-navigation-dock__group">' +
        '<button type="button"' +
        ' class="as-navigation-dock__button"' +
        ' data-as-action="previous-chapter"' +
        ' aria-label="Chapitre précédent">' +
          '<span aria-hidden="true">←</span>' +
        '</button>' +

        '<output class="as-navigation-dock__position">' +
          '<span class="as-sr-only">Chapitre </span>' +
          '<span data-as-chapter-current>1</span>' +
          '<span aria-hidden="true">/</span>' +
          '<span class="as-sr-only"> sur </span>' +
          '<span data-as-chapter-total>1</span>' +
        '</output>' +

        '<button type="button"' +
        ' class="as-navigation-dock__button"' +
        ' data-as-action="next-chapter"' +
        ' aria-label="Chapitre suivant">' +
          '<span aria-hidden="true">→</span>' +
        '</button>' +

      '</div>' +

      '<span class="as-navigation-dock__separator"' +
      ' aria-hidden="true"></span>' +

      '<div class="as-navigation-dock__group"' +
      ' aria-label="Navigation dans le chapitre">' +

        '<button type="button"' +
        ' class="as-navigation-dock__button"' +
        ' data-as-action="previous-slide"' +
        ' aria-label="Diapositive précédente">' +
          '<span aria-hidden="true">↑</span>' +
        '</button>' +

        '<output class="as-navigation-dock__position">' +
          '<span class="as-sr-only">Diapositive </span>' +
          '<span data-as-slide-current>1</span>' +
          '<span aria-hidden="true">/</span>' +
          '<span class="as-sr-only"> sur </span>' +
          '<span data-as-slide-total>1</span>' +
        '</output>' +

        '<button type="button"' +
        ' class="as-navigation-dock__button"' +
        ' data-as-action="next-slide"' +
        ' aria-label="Diapositive suivante">' +
          '<span aria-hidden="true">↓</span>' +
        '</button>' +

      '</div>'

    revealElement && revealElement.appendChild(dock)

    return dock
  }

  const dock = createDock()

  const chapterCurrent = dock.querySelector('[data-as-chapter-current]')
  const chapterTotal = dock.querySelector('[data-as-chapter-total]')

  const slideCurrent = dock.querySelector('[data-as-slide-current]')
  const slideTotal = dock.querySelector('[data-as-slide-total]')

  const announcement = dock.querySelector('[data-as-announcement]')

  const previousChapterButton:HTMLButtonElement | null  = dock.querySelector('button[data-as-action="previous-chapter"]')
  const nextChapterButton:HTMLButtonElement | null = dock.querySelector('button[data-as-action="next-chapter"]')

  const previousSlideButton:HTMLButtonElement | null = dock.querySelector('[data-as-action="previous-slide"]')
  const nextSlideButton:HTMLButtonElement | null = dock.querySelector('[data-as-action="next-slide"]')

  function updateDock(announceChange: boolean) {
    const indices = RevealAPI.getIndices()
    const horizontalSlides = RevealAPI.getHorizontalSlides()
    const horizontalSlide = horizontalSlides[indices.h]
    const verticalSlides = getVerticalSlides(horizontalSlide)

    const totalChapters = Math.max(horizontalSlides.length, 1)
    const totalSlides = Math.max(verticalSlides.length, 1)

    const currentChapter = Math.min(indices.h + 1, totalChapters)
    const currentSlide = Math.min((indices.v || 0) + 1, totalSlides)

    if (chapterCurrent) chapterCurrent.textContent = `${currentChapter}`
    if (chapterTotal) chapterTotal.textContent = `${totalChapters}`

    if (slideCurrent) slideCurrent.textContent = `${currentSlide}`
    if (slideTotal) slideTotal.textContent = `${totalSlides}`

    if (previousChapterButton) (previousChapterButton).disabled = indices.h <= 0
    if (nextChapterButton) nextChapterButton.disabled = indices.h >= totalChapters - 1

    if (previousSlideButton) previousSlideButton.disabled = totalSlides <= 1 || indices.v <= 0
    if (nextSlideButton) nextSlideButton.disabled = totalSlides <= 1 || indices.v >= totalSlides - 1

    if (announceChange && announcement) {

      announcement.textContent =
        `Chapitre ${currentChapter} sur ${totalChapters}, diapositive ${currentSlide} sur ${totalSlides}`
    }
  }

  /* add key binding */
type navigationAction = string | null
  function navigate(action: navigationAction) {
    if (action === 'previous-chapter') { RevealAPI.navigateLeft() }

    if ( action === 'next-chapter' ) { RevealAPI.navigateRight() }

    if (action === 'previous-slide') { RevealAPI.navigateUp() }
    
    if (action === 'next-slide') { RevealAPI.navigateDown() }
  }

  dock.addEventListener('click', function (event) {
    let button:HTMLButtonElement | null  = null
    if(event.target) {
      button = (event.target as Element).closest('button[data-as-action]')
    }

    if (!button || button.disabled) {
      return
    }
    navigate(button.getAttribute('data-as-action'))
  })


  RevealAPI.on('slidechanged', () => updateDock(true))

  /*
   * fix navigation dock display if reveal not ready
   */
  if (
    !(typeof RevealAPI.isReady === 'function' && RevealAPI.isReady()) ||
    revealElement.classList.contains('ready')
  ) {
    updateDock(false)
  }
}
