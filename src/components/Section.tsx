import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

/** Shared section wrapper: consistent max-width, spacing and heading. */
export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mx-auto w-full max-w-content px-6 py-16">
      <h2 className="mb-8 text-xs font-bold tracking-widest text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
