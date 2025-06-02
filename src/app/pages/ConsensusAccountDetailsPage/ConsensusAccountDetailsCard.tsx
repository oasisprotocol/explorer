import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../../oasis-nexus/api'
import { SubPageCard } from '../../components/SubPageCard'
import { ConsensusAccountDetailsView } from '../../components/Account/ConsensusAccountDetailsView'
import { HighlightPattern } from "../.../../../components/HighlightedText"

type ConsensusAccountDetailsCardProps = {
  account: Account | undefined
  isError: boolean
  isLoading: boolean
  highlightPattern: HighlightPattern,
}

export const ConsensusAccountDetailsCard: FC<ConsensusAccountDetailsCardProps> = ({
  account,
  isError,
  isLoading,
  highlightPattern,
}) => {
  const { t } = useTranslation()

  return (
    <SubPageCard featured isLoadingTitle={isLoading} title={t('account.title')} mainTitle>
      <ConsensusAccountDetailsView
        isError={isError}
        isLoading={isLoading}
        account={account}
        highlightPattern={highlightPattern}
      />
    </SubPageCard>
  )
}
