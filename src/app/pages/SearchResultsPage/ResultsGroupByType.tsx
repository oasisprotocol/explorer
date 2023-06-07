import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

interface Props<T> {
  title: string
  results: T[] | undefined
  resultComponent: (item: T) => React.ReactNode
  link: (item: T) => string
  linkLabel: string
}

export const ViewResultButton = (() => {
  const ViewResultButton = styled(Button)({})
  ViewResultButton.defaultProps = {
    variant: 'contained',
    color: 'primary',
  }
  // Type cast is needed because styled type breaks `<ViewResultButton component={RouterLink}`
  return ViewResultButton as typeof Button
})()

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
        <Typography
          variant="h4"
          component="h4"
          sx={{
            display: 'inline',
          }}
        >
          {title}
        </Typography>
      </Box>
      {results.map((item, i) => (
        <div key={i}>
          {resultComponent(item)}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ViewResultButton component={RouterLink} to={link(item)}>
              {linkLabel}
            </ViewResultButton>
          </Box>
          {i < results.length - 1 && <Divider variant="card" />}
        </div>
      ))}
    </>
  )
}
