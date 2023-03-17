import { FC } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
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
import { RouteUtils } from '../../utils/route-utils'
import Link from '@mui/material/Link'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AccountLink } from '../../components/Account/AccountLink'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { trimLongString } from '../../utils/trimLongString'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useLayerParam } from '../../hooks/useLayerParam'

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

export const TransactionDetailPage: FC = () => {
  const { t } = useTranslation()

  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_PARA_TIMES, just some preparation
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
    </PageLayout>
  )
}

export const TransactionDetailView: FC<{
  isLoading: boolean
  transaction: RuntimeTransaction | undefined
}> = ({ isLoading, transaction }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTimestamp = useFormattedTimestampString(transaction?.timestamp)

  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {transaction && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          <dt>{t('common.hash')}</dt>
          <dd>
            <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
              {isMobile ? trimLongString(transaction.hash) : transaction.hash}
            </Typography>
            <CopyToClipboard value={transaction.hash} label={' '} />
          </dd>

          <dt>{t('common.status')}</dt>
          <dd>
            <TransactionStatusIcon success={transaction.success} withText={true} />
          </dd>

          <dt>{t('common.block')}</dt>
          <dd>
            <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
              <Link
                component={RouterLink}
                to={RouteUtils.getBlockRoute(transaction.round, transaction.layer)}
              >
                {transaction.round.toLocaleString()}
              </Link>
            </Typography>
          </dd>

          <dt>{t('common.type')}</dt>
          <dd>
            <RuntimeTransactionLabel method={transaction.method} />
          </dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>{formattedTimestamp}</dd>

          <dt>{t('common.from')}</dt>
          <dd>
            <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
              <AccountLink address={transaction.sender_0} layer={transaction.layer} />
            </Typography>
            <CopyToClipboard value={transaction.sender_0} label={' '} />
          </dd>

          {transaction.to && (
            <>
              <dt>{t('common.to')}</dt>
              <dd>
                <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
                  <AccountLink address={transaction.to} layer={transaction.layer} />
                </Typography>
                <CopyToClipboard value={transaction.to} label={' '} />
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
