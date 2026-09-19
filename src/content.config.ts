import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    status: z.enum(['Progetto realizzato', 'Studio di progetto']),
    order: z.number(),
    coverImage: z.string().min(1),
    coverAlt: z.string(),
    seoDescription: z.string().max(160),
    credits: z.object({
      design: z.string().optional(),
      lighting: z.string().optional(),
      photography: z.string().optional(),
      rendering: z.string().optional(),
      contractor: z.string().optional(),
      carpentry: z.string().optional(),
    }),
    gallery: z
      .array(
        z.object({
          src: z.string().min(1),
          alt: z.string(),
          category: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects };
