import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import { useGetEmeraldTransactionsTxHash } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'

export const TransactionDetailPage: FC = () => {
  const { t } = useTranslation()
  const hash = useParams().hash!
  const { isLoading, data } = useGetEmeraldTransactionsTxHash(hash)
  // It feels unnatural, but I will wrap this in a list now, so that we can handle the
  // "multiple txs with the same hash" situation later.
  const transactions = data?.data ? [data.data] : []

  return (
    <PageLayout>
      {isLoading && (
        <SubPageCard title={t('transaction.header')}>
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
        </SubPageCard>
      )}
      {transactions?.map(transaction => (
        <SubPageCard title={t('transaction.header')} key={`${transaction.round}_${transaction.index}`}>
          <StyledDescriptionList titleWidth="200px">
            <dt>{t('common.hash')}</dt>
            <dd>{transaction.hash}</dd>

            <dt>{t('common.status')}</dt>
            <dd>
              <TransactionStatusIcon success={transaction.success} />
            </dd>

            <dt>{t('common.block')}</dt>
            <dd>{transaction.round}</dd>

            <dt>{t('common.type')}</dt>
            <dd>
              <RuntimeTransactionLabel method={transaction.method} />
            </dd>

            <dt>{t('common.from')}</dt>
            <dd>{transaction.sender_0}</dd>

            <dt>{t('common.to')}</dt>
            <dd>{transaction.to}</dd>

            <dt>{t('common.txnFee')}</dt>
            <dd>{t('common.valueInRose', { value: transaction.fee })}</dd>

            <dt>{t('common.value')}</dt>
            <dd>{t('common.valueInRose', { value: transaction.amount })}</dd>
          </StyledDescriptionList>
        </SubPageCard>
      ))}
    </PageLayout>
  )
}
