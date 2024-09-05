import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Transaction } from '../../../oasis-nexus/api'
import { RoundedBalance } from '../RoundedBalance'

type ConsensusAmountProps = {
  transaction: Transaction
}

export const ConsensusAmount: FC<ConsensusAmountProps> = ({ transaction }) => {
  const { t } = useTranslation()

  if (transaction?.amount) {
    return <RoundedBalance value={transaction.amount} ticker={transaction.ticker} />
  }

  if (transaction?.body?.shares) {
    return <RoundedBalance compactLargeNumbers value={transaction.body.shares} ticker={t('common.shares')} />
  }

  return null
}
