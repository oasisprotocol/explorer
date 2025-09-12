import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
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
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" className="inline">
          {title}
        </Typography>
      </Box>
      {results.map((item, i) => (
        <div key={i}>
          {resultComponent(item)}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Button variant="contained" color="primary" component={RouterLink} to={link(item)}>
              {linkLabel}
            </Button>
          </Box>
          {i < results.length - 1 && <CardDivider />}
        </div>
      ))}
    </>
  )
}
