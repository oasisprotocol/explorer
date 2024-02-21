import { FC } from 'react'
import { RuntimeSdkBalance } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

export const RuntimeBalanceDisplay: FC<{ balances: RuntimeSdkBalance[] | undefined }> = ({
  balances = [],
}) => {
  const { t } = useTranslation()
  if (balances.length === 0 || balances[0].balance === undefined) {
    return t('common.missing')
  }
  return (
    <>
      {balances.map(balance => (
        <span key={balance.token_symbol}>
          {t('common.valueInToken', {
            ...getPreciseNumberFormat(balance.balance),
            ticker: balance.token_symbol,
          })}
        </span>
      ))}
    </>
  )
}
