import { FC, PropsWithChildren, useState } from 'react'
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
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AccountLink } from '../../components/Account/AccountLink'
import Alert from '@mui/material/Alert'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { BlockLink } from '../../components/Blocks/BlockLink'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { TransactionLogs } from '../../components/Transactions/Logs'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { DashboardLink } from '../DashboardPage/DashboardLink'
import { getNameForTicker, getTickerForNetwork, Ticker } from '../../../types/ticker'
import { TokenPriceInfo, useTokenPrice } from '../../../coin-gecko/api'
import { CurrentFiatValue } from './CurrentFiatValue'
import { AddressSwitch, AddressSwitchOption } from '../../components/AddressSwitch'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip from '@mui/material/Tooltip'
import { isValidTxOasisHash } from '../../utils/helpers'

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

  const scope = useRequiredScopeParam()
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Displaying consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactionsTxHash()
  }

  const hash = useParams().hash!

  const [addressSwitchOption, setAddressSwitchOption] = useState<
    AddressSwitchOption.Oasis | AddressSwitchOption.ETH
  >(() => {
    if (isValidTxOasisHash(hash)) {
      return AddressSwitchOption.Oasis
    }

    return AddressSwitchOption.ETH
  })

  const { isLoading, data } = useGetRuntimeTransactionsTxHash(
    scope.network,
    scope.layer, // This is OK since consensus has been handled separately
    hash,
  )

  const { wantedTransaction: transaction, warningMultipleTransactionsSameHash } = useWantedTransaction(
    data?.data,
  )

  const tokenPriceInfo = useTokenPrice(getTickerForNetwork(scope.network))

  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }
  return (
    <PageLayout>
      {warningMultipleTransactionsSameHash && (
        <StyledAlert severity={'error'}>{t('transaction.warningMultipleTransactionsSameHash')}</StyledAlert>
      )}
      <SubPageCard
        featured
        title={t('transaction.header')}
        action={
          <AddressSwitch
            selected={addressSwitchOption}
            onSelectionChange={addressSwitch => setAddressSwitchOption(addressSwitch)}
          />
        }
      >
        <TransactionDetailView
          isLoading={isLoading}
          transaction={transaction}
          tokenPriceInfo={tokenPriceInfo}
          addressSwitchOption={addressSwitchOption}
        />
      </SubPageCard>
      {transaction && (
        <SubPageCard title={t('common.logs')}>
          <TransactionLogs transaction={transaction} addressSwitchOption={addressSwitchOption} />
        </SubPageCard>
      )}
    </PageLayout>
  )
}

export type TransactionDetailRuntimeBlock = RuntimeTransaction & {
  markAsNew?: boolean
}

const TransactionInfoTooltip: FC<PropsWithChildren<{ label: string }>> = ({ label, children }) => {
  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InfoIcon />
          {label}
        </Box>
      }
    >
      <Box>{children}</Box>
    </Tooltip>
  )
}

export const TransactionDetailView: FC<{
  isLoading?: boolean
  transaction: TransactionDetailRuntimeBlock | undefined
  showLayer?: boolean
  standalone?: boolean
  tokenPriceInfo: TokenPriceInfo
  addressSwitchOption?: AddressSwitchOption
}> = ({
  isLoading,
  transaction,
  showLayer,
  standalone = false,
  tokenPriceInfo,
  addressSwitchOption = AddressSwitchOption.ETH,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTimestamp = useFormattedTimestampString(transaction?.timestamp)

  const isOasisAddressFormat = addressSwitchOption === AddressSwitchOption.Oasis
  const hash = isOasisAddressFormat ? transaction?.hash : transaction?.eth_hash
  const from = isOasisAddressFormat ? transaction?.sender_0 : transaction?.sender_0_eth
  const to = isOasisAddressFormat ? transaction?.to : transaction?.to_eth

  const ticker = transaction?.ticker || Ticker.ROSE
  const tickerName = getNameForTicker(t, ticker)

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
              <dd>
                <DashboardLink scope={transaction} />
              </dd>
            </>
          )}

          {hash && (
            <>
              <dt>{t('common.hash')}</dt>
              <dd>
                <TransactionInfoTooltip
                  label={
                    isOasisAddressFormat
                      ? t('transaction.tooltips.txTooltipOasis')
                      : t('transaction.tooltips.txTooltipEth')
                  }
                >
                  <TransactionLink scope={transaction} hash={hash} />
                </TransactionInfoTooltip>
                <CopyToClipboard value={hash} />
              </dd>
            </>
          )}

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
            <BlockLink scope={transaction} height={transaction.round} />
          </dd>

          <dt>{t('common.type')}</dt>
          <dd>
            <RuntimeTransactionLabel method={transaction.method} />
          </dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>{formattedTimestamp}</dd>

          {from && (
            <>
              <dt>{t('common.from')}</dt>
              <dd>
                <TransactionInfoTooltip
                  label={
                    isOasisAddressFormat
                      ? t('transaction.tooltips.senderTooltipOasis')
                      : t('transaction.tooltips.senderTooltipEth')
                  }
                >
                  <AccountLink scope={transaction} address={from} />
                </TransactionInfoTooltip>
                <CopyToClipboard value={from} />
              </dd>
            </>
          )}

          {to && (
            <>
              <dt>{t('common.to')}</dt>
              <dd>
                <TransactionInfoTooltip
                  label={
                    isOasisAddressFormat
                      ? t('transaction.tooltips.recipientTooltipOasis')
                      : t('transaction.tooltips.recipientTooltipEth')
                  }
                >
                  <AccountLink scope={transaction} address={to} />
                </TransactionInfoTooltip>
                <CopyToClipboard value={to} />
              </dd>
            </>
          )}

          <dt>{t('common.value')}</dt>
          <dd>{t('common.valueInToken', { value: transaction.amount, ticker: tickerName })}</dd>

          {transaction.amount !== undefined &&
            !!tokenPriceInfo &&
            !tokenPriceInfo.isLoading &&
            !tokenPriceInfo.isFree &&
            tokenPriceInfo.price !== undefined && (
              <>
                <dt>{t('currentFiatValue.title')}</dt>
                <dd>
                  <CurrentFiatValue amount={parseFloat(transaction.amount)} {...tokenPriceInfo} />
                </dd>
              </>
            )}

          <dt>{t('common.txnFee')}</dt>
          <dd>{t('common.valueInToken', { value: transaction.fee, ticker: tickerName })}</dd>

          <dt>{t('common.gasLimit')}</dt>
          <dd>{transaction.gas_limit.toLocaleString()}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
