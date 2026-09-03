import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  children: ReactNode
}

/** Shared section wrapper: consistent max-width, spacing and heading. */
export default function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-2xl px-6 py-16">
      <h2 className="mb-8 text-xs font-bold tracking-widest text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
