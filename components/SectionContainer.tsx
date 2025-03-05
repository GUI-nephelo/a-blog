import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="xl:max-w-9xl mx-auto max-w-6xl px-2 sm:px-4 lg:max-w-screen-xl xl:mx-3 xl:px-0">
      {children}
    </section>
  )
}
