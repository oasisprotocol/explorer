import { FC } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useTranslation } from 'react-i18next'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { TokenSupplyCard } from './TokenSupplyCard'
import { TokenHoldersCountCard } from './TokenHoldersCountCard'
import { TokenTypeCard } from './TokenTypeCard'
import { TokenTotalTransactionsCard } from './TokenTotalTransactionsCard'
import { RuntimeScope } from '../../../types/searchScope'

export const TokenSnapshot: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-full px-4 md:px-0">
          <AppendMobileSearch scope={scope}>
            <div className="flex flex-col md:flex-row mb-2">
              <Typography variant="h3">{t('tokenSnapshot.header')}</Typography>
            </div>
          </AppendMobileSearch>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 w-full pb-8">
        <div className="col-span-12 lg:col-span-3">
          <TokenTotalTransactionsCard scope={scope} address={address} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <TokenSupplyCard scope={scope} address={address} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <TokenHoldersCountCard scope={scope} address={address} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <TokenTypeCard scope={scope} address={address} />
          {/*<TokenGasUsedCard /> TODO: use this when gas used becomes available */}
        </div>
      </div>
    </>
  )
}
