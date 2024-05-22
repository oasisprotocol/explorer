import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../../oasis-nexus/api'
import { SubPageCard } from '../../components/SubPageCard'
import { ConsensusAccountDetailsView } from '../../components/Account/ConsensusAccountDetailsView'

type ConsensusAccountDetailsCardProps = {
  account: Account | undefined
  isError: boolean
  isLoading: boolean
  highlightedPartOfName?: string | undefined
}

export const ConsensusAccountDetailsCard: FC<ConsensusAccountDetailsCardProps> = ({
  account,
  isError,
  isLoading,
  highlightedPartOfName,
}) => {
  const { t } = useTranslation()

  return (
    <SubPageCard featured isLoadingTitle={isLoading} title={t('account.title')} mainTitle>
      <ConsensusAccountDetailsView
        isError={isError}
        isLoading={isLoading}
        account={account}
        highlightedPartOfName={highlightedPartOfName}
      />
    </SubPageCard>
  )
}
