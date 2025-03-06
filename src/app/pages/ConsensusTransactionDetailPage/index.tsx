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
import { ConsensusAccountLink } from 'app/components/Account/ConsensusAccountLink'
import { getPreciseNumberFormat } from 'locales/getPreciseNumberFormat'
import { CurrentFiatValue } from '../../components/CurrentFiatValue'
import { ConsensusTransactionEvents } from '../../components/Transactions/ConsensusTransactionEvents'
import { AllTokenPrices, useAllTokenPrices } from 'coin-gecko/api'
import { getFiatCurrencyForScope } from '../../../config'
import { useWantedTransaction } from '../../hooks/useWantedTransaction'
import { MultipleTransactionsWarning } from '../../components/Transactions/MultipleTransactionsWarning'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'

const StyledDescriptionDetails = styled('dd')({
  '&&': { padding: 0 },
})

export const ConsensusTransactionDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const hash = useParams().hash!
  const { isLoading, data } = useGetConsensusTransactionsTxHash(scope.network, hash)
  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))
  const { wantedTransaction: transaction, warningMultipleTransactionsSameHash } = useWantedTransaction(
    data?.data,
  )
  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      <MultipleTransactionsWarning enable={warningMultipleTransactionsSameHash} />
      <SubPageCard featured title={t('transaction.header')}>
        <ConsensusTransactionDetailView
          detailsPage
          isLoading={isLoading}
          tokenPrices={tokenPrices}
          transaction={transaction}
        />
      </SubPageCard>
      {transaction && (
        <SubPageCard title={t('common.events')}>
          <ConsensusTransactionEvents transaction={transaction} />
        </SubPageCard>
      )}
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
  tokenPrices?: AllTokenPrices
  showLayer?: boolean
}> = ({ detailsPage, isLoading, showLayer, transaction, tokenPrices }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const formattedTimestamp = useFormattedTimestampStringWithDistance(transaction?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 13 : 7} />
  if (!transaction) return <></>

  const tokenPriceInfo = tokenPrices?.[transaction.ticker]

  return (
    <StyledDescriptionList
      titleWidth={isMobile ? '100px' : '200px'}
      standalone={!detailsPage}
      highlight={transaction.markAsNew}
    >
      {showLayer && (
        <>
          <dt>{t('common.paratime')}</dt>
          <dd>
            <DashboardLink scope={transaction} />
          </dd>
        </>
      )}
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
        <CopyToClipboard value={transaction.block.toString()} />
      </dd>
      <dt>{t('common.from')}</dt>
      <dd>
        <ConsensusAccountLink network={transaction.network} address={transaction.sender} alwaysTrim={false} />
        <CopyToClipboard value={transaction.sender} />
      </dd>
      {transaction.to && (
        <>
          <dt>{t('common.to')}</dt>
          <dd>
            <ConsensusAccountLink network={transaction.network} address={transaction.to} alwaysTrim={false} />
            <CopyToClipboard value={transaction.to} />
          </dd>
        </>
      )}
      {transaction.amount && (
        <>
          <dt>{t('common.amount')}</dt>
          <dd>
            {t('common.valueInToken', {
              ...getPreciseNumberFormat(transaction.amount),
              ticker: transaction.ticker,
            })}
          </dd>
        </>
      )}
      {detailsPage && (
        <>
          {transaction.amount &&
            !!tokenPriceInfo &&
            !tokenPriceInfo.isLoading &&
            !tokenPriceInfo.isFree &&
            tokenPriceInfo.price !== undefined && (
              <>
                <dt>{t('currentFiatValue.title')}</dt>
                <dd>
                  <CurrentFiatValue amount={transaction.amount} {...tokenPriceInfo} />
                </dd>
              </>
            )}
          {transaction.body?.shares && (
            <>
              <dt>{t('common.shares')}</dt>
              <dd>
                <RoundedBalance compactLargeNumbers value={transaction.body?.shares} />
              </dd>
            </>
          )}
          <dt>{t('common.fee')}</dt>
          <dd>
            {t('common.valueInToken', {
              ...getPreciseNumberFormat(transaction.fee),
              ticker: transaction.ticker,
            })}
          </dd>

          {/* TODO: gasUsed field will be available for Nexus with the next oasis-core release  */}

          {transaction.gas_limit && (
            <>
              <dt>{t('common.gasLimit')}</dt>
              <dd>
                {t('common.valuePair', {
                  value: transaction.gas_limit,
                })}
              </dd>
            </>
          )}
          <dt>{t('common.nonce')}</dt>
          <dd>
            <>{transaction.nonce.toLocaleString()}</>
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
