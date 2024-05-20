import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { Account } from '../../../oasis-nexus/api'
import { SubPageCard } from '../../components/SubPageCard'
import { ConsensusAccountDetailsView } from './ConsensusAccountDetailsView'

export const StyledListTitle = styled('dt')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}))

type ConsensusAccountDetailsCardProps = {
  account: Account | undefined
  isError: boolean
  isLoading: boolean
}

export const ConsensusAccountDetailsCard: FC<ConsensusAccountDetailsCardProps> = ({
  account,
  isError,
  isLoading,
}) => {
  const { t } = useTranslation()

  return (
    <SubPageCard featured isLoadingTitle={isLoading} title={t('account.title')} mainTitle>
      <ConsensusAccountDetailsView isError={isError} isLoading={isLoading} account={account} />
    </SubPageCard>
  )
}
