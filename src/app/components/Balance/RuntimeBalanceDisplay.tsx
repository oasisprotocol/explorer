import { FC } from 'react'
import { RuntimeSdkBalance } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { RoundedBalance } from '../RoundedBalance'

export const RuntimeBalanceDisplay: FC<{ balances: RuntimeSdkBalance[] | undefined; className?: string }> = ({
  balances = [],
  className = '',
}) => {
  const { t } = useTranslation()
  if (balances.length === 0 || balances[0].balance === undefined) {
    return t('common.missing')
  }
  return (
    <div className={className}>
      {balances.map(balance => (
        <div key={balance.token_symbol}>
          <RoundedBalance value={balance.balance} ticker={balance.token_symbol} />
        </div>
      ))}
    </div>
  )
}
