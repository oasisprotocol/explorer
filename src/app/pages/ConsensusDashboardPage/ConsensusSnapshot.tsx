import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { SearchScope } from '../../../types/searchScope'
import { Snapshot } from '../../components/Snapshots/Snapshot'

const StyledGrid = styled(Grid)(() => ({
  display: 'flex',
}))

export const ConsensusSnapshot: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Snapshot title={t('consensusSnapshot')} scope={scope}>
      <StyledGrid item xs={22} md={5} />
      <StyledGrid item xs={22} md={6} />
      <StyledGrid item xs={22} md={5} />
      <StyledGrid item xs={22} md={6} />
    </Snapshot>
  )
}
