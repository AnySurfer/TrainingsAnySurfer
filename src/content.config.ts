import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const docs = defineCollection({
  loader: glob({ base: './src/docs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    slug: z
      .string()
      .regex(
        /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*(?:\/[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*)*$/,
      )
      .optional(),
    order: z.number().int().default(0),
    lang: z.enum(['fr', 'en', 'nl']).default('fr'),
    translationKey: z.string().trim().min(1),
  }),
})

export const collections = { docs }
