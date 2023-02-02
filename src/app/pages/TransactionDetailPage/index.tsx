import { FC } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
import { RuntimeTransaction, useGetEmeraldTransactionsTxHash } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { ParaTime } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import Link from '@mui/material/Link'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AccountLink } from '../../components/Account/AccountLink'
import { Divider } from '@mui/material'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { trimLongString } from '../../utils/trimLongString'
import { CopyToClipboard } from '../../components/CopyToClipboard'

type TransactionSelectionResult = {
  wantedTransaction?: RuntimeTransaction
  warningFlag?: boolean
}

/**
 * Compare transactions according to their age (for sorting)
 */
function compareTxAge(a: RuntimeTransaction, b: RuntimeTransaction) {
  // As per definition, the timestamp of a transaction gives the time when
  // the block was proposed, so we can't tell the age within the block.
  // So we can just as well look for the block round number instead.

  const roundA = a.round
  const roundB = b.round

  if (roundA > roundB) {
    return 1
  } else if (roundB > roundA) {
    return -1
  } else {
    return 0
  }
}

/**
 * Find the wanted transaction, in case there are more.
 *
 * Normally we want the successful one. If there is none, then the latest.
 */
function useWantedTransaction(transactions: RuntimeTransaction[]): TransactionSelectionResult {
  if (!transactions.length) {
    return {}
  } else if (transactions.length === 1) {
    return {
      wantedTransaction: transactions[0],
    }
  } else {
    let wantedTransaction = transactions.find(transaction => transaction.success)
    if (!wantedTransaction) {
      wantedTransaction = transactions.sort(compareTxAge).at(-1)
    }
    return {
      warningFlag: true,
      wantedTransaction,
    }
  }
}

const StyledAlert = styled(Alert)(() => ({
  marginBottom: '1em',
}))

export const TransactionDetailPage: FC = () => {
  const { t } = useTranslation()
  const hash = useParams().hash!
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { isLoading, data } = useGetEmeraldTransactionsTxHash(hash)

  const transactions = data?.data ? [data.data] : [] // TODO: simplify this when the API is updated to return a list
  const { wantedTransaction: transaction, warningFlag } = useWantedTransaction(transactions)
  const formattedTimestamp = useFormattedTimestampString(transaction?.timestamp)

  if (!transaction && !isLoading) {
    // TODO use proper error page
    return (
      <PageLayout>
        <h1>404 - Transaction not found</h1>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {warningFlag && <StyledAlert severity={'error'}>{t('transaction.multiWarning')}</StyledAlert>}
      {isLoading && (
        <SubPageCard title={t('transaction.header')}>
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
        </SubPageCard>
      )}
      {transaction && (
        <SubPageCard title={t('transaction.header')} key={`${transaction.round}_${transaction.index}`}>
          {!isMobile && <Divider variant="fullWidth" />}
          <StyledDescriptionList titleWidth="200px">
            <dt>{t('common.hash')}</dt>
            <dd>
              {isMobile ? trimLongString(transaction.hash) : transaction.hash}
              <CopyToClipboard value={transaction.hash} label={' '} />
            </dd>

            <dt>{t('common.status')}</dt>
            <dd>
              <TransactionStatusIcon success={transaction.success} withText={true} />
            </dd>

            <dt>{t('common.block')}</dt>
            <dd>
              <Link component={RouterLink} to={RouteUtils.getBlockRoute(transaction.round, ParaTime.Emerald)}>
                {transaction.round}
              </Link>
            </dd>

            <dt>{t('common.type')}</dt>
            <dd>
              <RuntimeTransactionLabel method={transaction.method} />
            </dd>

            <dt>{t('common.timestamp')}</dt>
            <dd>{formattedTimestamp}</dd>

            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink address={transaction.sender_0} paratime={ParaTime.Emerald} />
              <CopyToClipboard value={transaction.sender_0} label={' '} />
            </dd>

            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink address={transaction.to!} paratime={ParaTime.Emerald} />
              <CopyToClipboard value={transaction.to!} label={' '} />
            </dd>

            <dt>{t('common.value')}</dt>
            <dd>{t('common.valueInRose', { value: transaction.amount })}</dd>

            <dt>{t('common.txnFee')}</dt>
            <dd>{t('common.valueInRose', { value: transaction.fee })}</dd>

            <dt>{t('common.gasLimit')}</dt>
            <dd>{t('common.valueInRose', { value: transaction.gas_limit })}</dd>
          </StyledDescriptionList>
        </SubPageCard>
      )}
    </PageLayout>
  )
}
