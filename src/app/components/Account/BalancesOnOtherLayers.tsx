import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Account,
  RuntimeAccount,
  useGetConsensusAccountsAddress,
  useGetRuntimeAccountsAddress,
} from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

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
    .filter(query => query.data?.data.stats.num_txns)
    .map((query, i) => {
      const account = query.data!.data
      return (
        <span key={account.layer}>
          {i > 0 && ' and '}

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
