import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { CardDivider } from '../../components/Divider'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

interface Props<T> {
  title: string
  results: T[] | undefined
  resultComponent: (item: T) => React.ReactNode
  link: (item: T) => string
  linkLabel: string
}

/**
 * Component for displaying search results of the same type, from the same network.
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export function ResultsGroupByType<T>({ title, results, resultComponent, link, linkLabel }: Props<T>) {
  if (!results || results.length <= 0) {
    return <></>
  }

  return (
    <>
      <div className="mb-7">
        <Typography variant="h4" className="inline">
          {title}
        </Typography>
      </div>
      {results.map((item, i) => (
        <div key={i}>
          {resultComponent(item)}
          <div className="flex justify-center mt-2">
            <Button asChild size="lg">
              <RouterLink to={link(item)}>{linkLabel}</RouterLink>
            </Button>
          </div>
          {i < results.length - 1 && <CardDivider />}
        </div>
      ))}
    </>
  )
}
