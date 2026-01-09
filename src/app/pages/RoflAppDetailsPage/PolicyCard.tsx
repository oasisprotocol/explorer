import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { RoflAppPolicy, Runtime, useGetRuntimeRoflAppsIdTransactions } from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { EmptyStateCard } from './EmptyStateCard'
import { GridRow } from './GridRow'

type PolicyCardProps = {
  id: string
  isFetched: boolean
  network: Network
  layer: Runtime
  policy: RoflAppPolicy | undefined
}

// Nexus is not parsing ROFL app policy, but we can expect object to be similar to this:
// https://github.com/oasisprotocol/oasis-sdk/blame/main/tests/runtimes/components-ronl/src/lib.rs#L120

// feePolicy can be 1 for InstancePays and 2 for EndorsingNodePays
// https://github.com/oasisprotocol/oasis-sdk/blob/41480106d585debd33391cb0dfcad32d2f3cdc9d/runtime-sdk/src/modules/rofl/policy.rs#L48

export const PolicyCard: FC<PolicyCardProps> = ({ id, isFetched, network, layer, policy }) => {
  const { t } = useTranslation()
  const { data } = useGetRuntimeRoflAppsIdTransactions(network, layer, id, {
    limit: 1,
    method: 'rofl.Update',
  })
  const transaction = data?.data.transactions[0]
  const feePolicy =
    policy?.fees === 1 ? t('rofl.replicaPays') : policy?.fees === 2 ? t('rofl.endorsingNodePays') : undefined

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3" className="mb-4">
            {t('rofl.policy')}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isFetched && !policy && <EmptyStateCard />}
        {policy && (
          <>
            <div className="grid grid-cols-3">
              <GridRow label={t('rofl.validity')}>
                {policy.quotes?.pcs?.tcb_validity_period
                  ? t('rofl.validityPeriodDays', { value: policy.quotes?.pcs?.tcb_validity_period })
                  : undefined}
              </GridRow>
              <GridRow label={t('rofl.evaluation')}>
                {policy.quotes?.pcs?.min_tcb_evaluation_data_number ? (
                  <>
                    {policy.quotes?.pcs?.min_tcb_evaluation_data_number}
                    <span className="pl-1">{t('rofl.min')}</span>
                  </>
                ) : undefined}
              </GridRow>
              <GridRow label={t('rofl.feePolicy')}>{feePolicy}</GridRow>
              <GridRow label={t('rofl.update')}>
                {transaction ? (
                  <>
                    {t('common.formattedDateTime', {
                      timestamp: new Date(transaction.timestamp),
                      formatParams: {
                        timestamp: {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        } satisfies Intl.DateTimeFormatOptions,
                      },
                    })}
                    <br />
                    <TransactionLink
                      scope={transaction}
                      alwaysTrim
                      hash={transaction.eth_hash || transaction.hash}
                    />
                  </>
                ) : undefined}
              </GridRow>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
