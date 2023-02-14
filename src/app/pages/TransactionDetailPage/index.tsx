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
import { AppErrors } from '../../../types/errors'

type TransactionSelectionResult = {
  wantedTransaction?: RuntimeTransaction
  warningMultipleTransactionsSameHash?: boolean
}

/**
 * Find the wanted transaction, in case there are more.
 *
 * Normally we want the successful one. If there is none, then the latest.
 */
function useWantedTransaction(transactions: RuntimeTransaction[]): TransactionSelectionResult {
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
  const hash = useParams().hash!
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { isLoading, data } = useGetEmeraldTransactionsTxHash(hash)

  const transactions = data?.data ? [data.data] : [] // TODO: simplify this when the API is updated to return a list
  const { wantedTransaction: transaction, warningMultipleTransactionsSameHash } =
    useWantedTransaction(transactions)
  const formattedTimestamp = useFormattedTimestampString(transaction?.timestamp)

  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      {warningMultipleTransactionsSameHash && (
        <StyledAlert severity={'error'}>{t('transaction.warningMultipleTransactionsSameHash')}</StyledAlert>
      )}
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

            {transaction.to && (
              <>
                <dt>{t('common.to')}</dt>
                <dd>
                  <AccountLink address={transaction.to} paratime={ParaTime.Emerald} />
                  <CopyToClipboard value={transaction.to} label={' '} />
                </dd>
              </>
            )}

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
