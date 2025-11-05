import { FC } from 'react'
import { RuntimeSdkBalance } from '../../../oasis-nexus/api'
import { RoundedBalance } from '../RoundedBalance'
import { getTokensForScope } from '../../../config'
import { RuntimeScope } from '../../../types/searchScope'

export const RuntimeBalanceDisplay: FC<{
  scope: RuntimeScope
  balances: RuntimeSdkBalance[] | undefined
  className?: string
}> = ({ scope, balances = [], className = '' }) => {
  const balancesOrZero =
    balances.length === 0 || balances[0].balance === undefined
      ? [{ balance: '0', token_symbol: getTokensForScope(scope)[0].ticker }]
      : balances

  return (
    <div className={className}>
      {balancesOrZero.map(balance => (
        <div key={balance.token_symbol}>
          <RoundedBalance value={balance.balance} ticker={balance.token_symbol} />
        </div>
      ))}
    </div>
  )
}
