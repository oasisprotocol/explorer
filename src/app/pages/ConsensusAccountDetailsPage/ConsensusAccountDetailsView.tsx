import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../../components/CardEmptyState'
import { ConsensusAccountData, ConsensusAccountDataProps } from '../../components/Account'

type ConsensusAccountDetailsViewProps = ConsensusAccountDataProps & {
  isError?: boolean | undefined
}

export const ConsensusAccountDetailsView: FC<ConsensusAccountDetailsViewProps> = ({
  account,
  isError,
  isLoading,
  showLayer,
  standalone,
  highlightedPartOfName,
}) => {
  const { t } = useTranslation()

  if (isError || (!isLoading && !account)) return <CardEmptyState label={t('account.cantLoadDetails')} />

  return (
    <ConsensusAccountData
      isLoading={!!isLoading}
      account={account}
      showLayer={showLayer}
      standalone={standalone}
      highlightedPartOfName={highlightedPartOfName}
    />
  )
}
