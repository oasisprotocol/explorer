import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { SubPageCard } from '../../components/SubPageCard'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

interface Props<T> {
  title: string
  results: T[] | undefined
  resultComponent: (item: T) => React.ReactNode
  link: (item: T) => string
  linkLabel: string
}

export function ResultsGroup<T>({ title, results, resultComponent, link, linkLabel }: Props<T>) {
  const { t } = useTranslation()

  if (!results || results.length <= 0) {
    return <></>
  }

  return (
    <SubPageCard
      featured
      title={title}
      subheader={t('search.results.count', {
        count: results.length,
      })}
    >
      {results.map((item, i) => (
        <div key={i}>
          {resultComponent(item)}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button component={RouterLink} to={link(item)} variant="outlined" color="secondary">
              {linkLabel}
            </Button>
          </Box>
          {i < results.length - 1 && <Divider variant="card" />}
        </div>
      ))}
    </SubPageCard>
  )
}
