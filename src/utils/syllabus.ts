/** Add a table of contents to the top-level sections rendered by a slide deck. */
export function addSyllabusChapters(html: string) {
  const usedIds = new Set(
    [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
  )
  const chapters: { id: string; title: string }[] = []
  let depth = 0
  let sectionStart = 0
  let sectionId = ''
  let position = 0
  let content = ''
  let count = 0
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  }

  const plainText = (text: string) =>
    text
      .replace(/<[^>]*>/g, '')
      .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) =>
        String.fromCodePoint(
          code.toLowerCase().startsWith('x')
            ? parseInt(code.slice(1), 16)
            : Number(code),
        ),
      )
      .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, entity) => entities[entity])
      .replace(/\s+/g, ' ')
      .trim()

  for (const match of html.matchAll(/<\/?section\b[^>]*>/gi)) {
    content += html.slice(position, match.index)
    let tag = match[0]
    if (tag.startsWith('</')) {
      depth--
      content += tag
      if (depth === 0) {
        const section = content.slice(sectionStart)
        const titles = [
          ...section.matchAll(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi),
        ].map((heading) => plainText(heading[1]))
        const title = titles.find(
          (text) => text && !/^\d+(?:re|er|e)?\s+partie$/i.test(text),
        )
        if (title) chapters.push({ id: sectionId, title })
      }
    } else {
      if (depth === 0) {
        sectionStart = content.length
        sectionId = tag.match(/\bid="([^"]+)"/)?.[1] ?? ''
        if (!sectionId) {
          do {
            sectionId = `syllabus-chapter-${++count}`
          } while (usedIds.has(sectionId))
          usedIds.add(sectionId)
          tag = tag.replace(/>$/, ` id="${sectionId}">`)
        }
      }
      depth++
      content += tag
    }
    position = match.index + match[0].length
  }
  content += html.slice(position)
  return { content, chapters }
}
