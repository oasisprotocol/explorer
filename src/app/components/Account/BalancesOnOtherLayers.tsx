import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Account,
  isAccountEmpty,
  RuntimeAccount,
  useGetConsensusAccountsAddress,
  useGetRuntimeAccountsAddress,
} from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { Link as RouterLink } from 'react-router'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { RuntimeBalanceDisplay } from '../Balance/RuntimeBalanceDisplay'
import { RoundedBalance } from '../RoundedBalance'

/** Ignoring pontus-x and cipher */
export const BalancesOnOtherLayers: FC<{ account: Account | RuntimeAccount }> = ({ account }) => {
  const { t } = useTranslation()
  const layerLabels = getLayerLabels(t)

  const queries = [
    useGetConsensusAccountsAddress(account.network, account.address),
    useGetRuntimeAccountsAddress(account.network, 'sapphire', account.address),
    useGetRuntimeAccountsAddress(account.network, 'emerald', account.address),
  ]

  const activeOnLayers = queries
    .filter(query => query.data?.data.layer !== account.layer)
    .filter(query => query.data?.data && !isAccountEmpty(query.data.data))
    .map((query, i) => {
      const account = query.data!.data

      // TODO: switch both to totalBalance when runtime API returns it
      const printBalance =
        account.layer === 'consensus' ? (
          <>
            {t('account.totalBalance')}: <RoundedBalance value={account.total} ticker={account.ticker} />
          </>
        ) : (
          <>
            {t('account.availableBalance')}:{' '}
            <RuntimeBalanceDisplay balances={account.balances} scope={account} className="inline-block" />
          </>
        )

      return (
        <span key={account.layer}>
          {i > 0 && ' and '}

          <Tooltip title={printBalance}>
            <Link asChild className="font-medium">
              <RouterLink
                to={RouteUtils.getAccountRoute(
                  account,
                  (account as RuntimeAccount).address_eth ?? account.address,
                )}
              >
                {layerLabels[account.layer]}
              </RouterLink>
            </Link>
          </Tooltip>
        </span>
      )
    })

  if (activeOnLayers.length <= 0) return null

  return (
    <span className="text-muted-foreground">
      &nbsp; ({`${t('account.hasBalancesOnOtherLayers')} `} {activeOnLayers})
    </span>
  )
}
