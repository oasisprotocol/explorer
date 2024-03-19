import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { Transaction, useGetConsensusTransactionsTxHash } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useScreenSize } from '../../hooks/useScreensize'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { TransactionLink } from 'app/components/Transactions/TransactionLink'
import { CopyToClipboard } from 'app/components/CopyToClipboard'
import { StatusIcon } from 'app/components/StatusIcon'
import { BlockLink } from 'app/components/Blocks/BlockLink'
import { ConsensusTransactionMethod } from 'app/components/ConsensusTransactionMethod'
import { useFormattedTimestampStringWithDistance } from 'app/hooks/useFormattedTimestamp'
import { RoundedBalance } from 'app/components/RoundedBalance'
import { AccountLink } from 'app/components/Account/AccountLink'

const StyledDescriptionDetails = styled('dd')({
  '&&': { padding: 0 },
})

export const ConsensusTransactionDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const hash = useParams().hash!
  const { isLoading, data } = useGetConsensusTransactionsTxHash(scope.network, hash)
  const transaction = data?.data
  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      <SubPageCard featured title={t('transaction.header')}>
        <ConsensusTransactionDetailView isLoading={isLoading} transaction={transaction} />
      </SubPageCard>
    </PageLayout>
  )
}

export type TransactionDetailConsensusBlock = Transaction & {
  markAsNew?: boolean
}

export const ConsensusTransactionDetailView: FC<{
  isLoading?: boolean
  transaction: TransactionDetailConsensusBlock | undefined
  detailsPage?: boolean
}> = ({ detailsPage, isLoading, transaction }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const formattedTimestamp = useFormattedTimestampStringWithDistance(transaction?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 13 : 7} />
  if (!transaction) return <></>

  return (
    <StyledDescriptionList
      titleWidth={isMobile ? '100px' : '200px'}
      standalone={!detailsPage}
      highlight={transaction.markAsNew}
    >
      <dt>{t('common.hash')}</dt>
      <dd>
        <TransactionLink scope={transaction} hash={transaction.hash} />
        <CopyToClipboard value={transaction.hash} />
      </dd>
      <dt>{t('common.status')}</dt>
      <dd style={{ flexWrap: 'wrap', gap: '10px' }}>
        <StatusIcon success={transaction.success} error={transaction.error} withText={true} />
      </dd>
      <dt>{t('common.type')}</dt>
      <StyledDescriptionDetails>
        <ConsensusTransactionMethod method={transaction.method} />
      </StyledDescriptionDetails>
      <dt>{t('common.timestamp')}</dt>
      <dd>{formattedTimestamp}</dd>
      <dt>{t('common.height')}</dt>
      <dd>
        <BlockLink scope={transaction} height={transaction.block} />
      </dd>
      <dt>{t('common.from')}</dt>
      <dd>
        <AccountLink scope={transaction} address={transaction.sender} />
      </dd>
      <dt>{t('common.to')}</dt>
      <dd>
        {/* TODO: show recipients address when props is added to API */}
        <>-</>
      </dd>
      <dt>{t('common.value')}</dt>
      <dd>
        {/* TODO: getPreciseNumberFormat when API returns amount prop */}
        <>-</>
      </dd>
      {detailsPage && (
        <>
          <dt>{t('currentFiatValue.title')}</dt>
          <dd>
            {/* TODO: show CurrentFiatValue when API returns amount prop */}
            <>-</>
          </dd>
          <dt>{t('common.transactionFee')}</dt>
          <dd>
            <RoundedBalance value={transaction.fee} ticker={transaction.ticker} />
          </dd>
          <dt>{t('common.gasUsed')}</dt>
          <dd>
            {/* TODO: show when API returns gas_used prop */}
            <>-</>
          </dd>
          <dt>{t('common.nonce')}</dt>
          <dd>
            <>{transaction.nonce.toLocaleString()}</>
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
