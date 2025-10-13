import React from 'react'

type Props = { data: unknown }

export function StructuredData({ data }: Props) {
  const json = JSON.stringify(data)
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  )
}

