import { z } from 'astro/zod'

const text = z.string().trim().min(1)
const linkSchema = z
  .object({
    href: text,
    label: text,
    subtitle: text.optional(),
    lang: text.optional(),
    hreflang: text.optional(),
    target: text.optional(),
    rel: text.optional(),
    download: z.string().optional(),
  })
  .strict()

const groupSchema = z
  .object({
    title: text.optional(),
    type: z.enum(['links', 'slides', 'bookmarks']).default('links'),
    ordered: z.boolean().default(false),
    paragraphs: z.array(text).default([]),
    links: z.array(linkSchema).default([]),
    linksFrom: z
      .object({
        file: text.regex(/^[\w-]+\.json$/),
        key: text,
      })
      .strict()
      .optional(),
    slot: text.optional(),
  })
  .strict()
  .refine((group) => !group.linksFrom || group.links.length === 0, {
    message: 'Use either links or linksFrom, not both.',
  })

const sectionSchema = groupSchema
  .safeExtend({
    id: text.regex(/^[a-zA-Z][\w-]*$/),
    navigationTitle: text.optional(),
    fullWidth: z.boolean().default(false),
    columns: z.boolean().default(false),
    groups: z.array(groupSchema).optional(),
    title: text,
  })
  .refine(
    (section) =>
      !section.groups ||
      (section.links.length === 0 &&
        !section.linksFrom &&
        !section.slot &&
        section.paragraphs.length === 0),
    { message: 'Use groups or section content, not both.' },
  )

const trainingSchema = z
  .object({
    title: text,
    lang: z.enum(['fr', 'en', 'nl']),
    eyebrow: text,
    navigationLabel: text,
    source: z.url().optional(),
    sections: z.array(sectionSchema),
  })
  .strict()
  .superRefine((training, ctx) => {
    const ids = new Set<string>()
    training.sections.forEach((section, index) => {
      if (ids.has(section.id))
        ctx.addIssue({
          code: 'custom',
          path: ['sections', index, 'id'],
          message: `Duplicate section id: ${section.id}`,
        })
      ids.add(section.id)
    })
  })

type Group = z.infer<typeof groupSchema>

function resolveGroup(
  group: Group,
  location: string,
  sharedFiles: Record<string, unknown>,
) {
  if (!group.linksFrom) return group
  const { file, key } = group.linksFrom
  const source = sharedFiles[file]
  const value =
    source && typeof source === 'object' && key in source
      ? (source as Record<string, unknown>)[key]
      : undefined
  const parsed = z.array(linkSchema).safeParse(value)
  if (!parsed.success)
    throw new Error(
      `${location}: invalid shared list ${file}#${key}: ${parsed.error.message}`,
    )
  return { ...group, links: parsed.data }
}

/** Validate resource data and derive visible sections from their content. */
export function parseTrainingResources(
  input: unknown,
  sharedFiles: Record<string, unknown> = {},
) {
  const training = trainingSchema.parse(input)
  return {
    ...training,
    sections: training.sections
      .map((section, index) => {
        const groups: Group[] = section.groups ?? [
          {
            type: section.type,
            ordered: section.ordered,
            paragraphs: section.paragraphs,
            links: section.links,
            linksFrom: section.linksFrom,
            slot: section.slot,
          },
        ]
        return {
          ...section,
          groups: groups
            .map((group, groupIndex) =>
              resolveGroup(
                group,
                `${training.title}: sections[${index}].groups[${groupIndex}]`,
                sharedFiles,
              ),
            )
            .filter(
              (group) =>
                group.links.length > 0 ||
                group.paragraphs.length > 0 ||
                group.slot,
            ),
        }
      })
      .filter((section) => section.groups.length > 0),
  }
}

/** Prefix site-relative resource links with the deployment base. */
export function resourceHref(href: string, base: string) {
  return href.startsWith('/') && !href.startsWith('//')
    ? `${base.replace(/\/$/, '')}${href}`
    : href
}
