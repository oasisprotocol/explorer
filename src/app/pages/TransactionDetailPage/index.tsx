import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Layer,
  RuntimeTransaction,
  RuntimeTransactionList,
  useGetRuntimeTransactionsTxHash,
} from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AccountLink } from '../../components/Account/AccountLink'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { useLayerParam } from '../../hooks/useLayerParam'
import { BlockLink } from '../../components/Blocks/BlockLink'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { TransactionLogs } from '../../components/Transactions/Logs'

type TransactionSelectionResult = {
  wantedTransaction?: RuntimeTransaction
  warningMultipleTransactionsSameHash?: boolean
}

/**
 * Find the wanted transaction, in case there are more.
 *
 * Normally we want the successful one. If there is none, then the latest.
 */
function useWantedTransaction(
  transactionsList: RuntimeTransactionList | undefined,
): TransactionSelectionResult {
  const transactions = transactionsList?.transactions ?? []

  if (!transactions.length) {
    // Loading or error
    return {}
  } else if (transactions.length === 1) {
    return {
      wantedTransaction: transactions[0],
    }
  } else {
    const successfulOne = transactions.find(transaction => transaction.success)
    const latestOne = transactions.sort((a, b) => b.round - a.round)[0]
    return {
      warningMultipleTransactionsSameHash: true,
      wantedTransaction: successfulOne ?? latestOne,
    }
  }
}

const StyledAlert = styled(Alert)(() => ({
  marginBottom: '1em',
}))

const ErrorBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '28px',
  fontSize: '12px',
  backgroundColor: COLORS.grayLight,
  color: COLORS.errorIndicatorBackground,
  borderRadius: 10,
  paddingLeft: 12,
  paddingRight: 12,
}))

export const TransactionDetailPage: FC = () => {
  const { t } = useTranslation()

  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Displaying consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactionsTxHash()
  }

  const hash = useParams().hash!

  const { isLoading, data } = useGetRuntimeTransactionsTxHash(
    layer, // This is OK since consensus has been handled separately
    hash,
  )

  const { wantedTransaction: transaction, warningMultipleTransactionsSameHash } = useWantedTransaction(
    data?.data,
  )

  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }
  return (
    <PageLayout>
      {warningMultipleTransactionsSameHash && (
        <StyledAlert severity={'error'}>{t('transaction.warningMultipleTransactionsSameHash')}</StyledAlert>
      )}
      <SubPageCard featured title={t('transaction.header')}>
        <TransactionDetailView isLoading={isLoading} transaction={transaction} />
      </SubPageCard>
      {transaction && (
        <SubPageCard title={t('common.logs')}>
          <TransactionLogs transaction={transaction} />
        </SubPageCard>
      )}
    </PageLayout>
  )
}

export type TransactionDetailRuntimeBlock = RuntimeTransaction & {
  markAsNew?: boolean
}

export const TransactionDetailView: FC<{
  isLoading?: boolean
  transaction: TransactionDetailRuntimeBlock | undefined
  showLayer?: boolean
  standalone?: boolean
}> = ({ isLoading, transaction, showLayer, standalone = false }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTimestamp = useFormattedTimestampString(transaction?.timestamp)

  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {transaction && (
        <StyledDescriptionList
          titleWidth={isMobile ? '100px' : '200px'}
          standalone={standalone}
          highlight={transaction.markAsNew}
        >
          {showLayer && (
            <>
              <dt>{t('common.paratime')}</dt>
              <dd>{t(`common.${transaction.layer}`)}</dd>
            </>
          )}
          <dt>{t('common.hash')}</dt>
          <dd>
            <TransactionLink hash={transaction.eth_hash || transaction.hash} layer={transaction.layer} />
            <CopyToClipboard value={transaction.eth_hash || transaction.hash} />
          </dd>

          <dt>{t('common.status')}</dt>
          <dd style={{ flexWrap: 'wrap', gap: '10px' }}>
            <TransactionStatusIcon success={transaction.success} withText={true} />
            {transaction.error && (
              <ErrorBox>
                {transaction.error.message} ({t('errors.code')} {transaction.error.code})
              </ErrorBox>
            )}
          </dd>

          <dt>{t('common.block')}</dt>
          <dd>
            <BlockLink layer={transaction.layer} height={transaction.round} />
          </dd>

          <dt>{t('common.type')}</dt>
          <dd>
            <RuntimeTransactionLabel method={transaction.method} />
          </dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>{formattedTimestamp}</dd>

          <dt>{t('common.from')}</dt>
          <dd>
            <AccountLink
              address={transaction.sender_0_eth || transaction.sender_0}
              layer={transaction.layer}
            />
            <CopyToClipboard value={transaction.sender_0_eth || transaction.sender_0} />
          </dd>

          {transaction.to && (
            <>
              <dt>{t('common.to')}</dt>
              <dd>
                <AccountLink address={transaction.to_eth || transaction.to} layer={transaction.layer} />
                <CopyToClipboard value={transaction.to_eth || transaction.to} />
              </dd>
            </>
          )}

          <dt>{t('common.value')}</dt>
          <dd>{t('common.valueInRose', { value: transaction.amount })}</dd>

          <dt>{t('common.txnFee')}</dt>
          <dd>{t('common.valueInRose', { value: transaction.fee })}</dd>

          <dt>{t('common.gasLimit')}</dt>
          <dd>{transaction.gas_limit.toLocaleString()}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
