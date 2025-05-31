import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RuntimeTransaction, useGetRuntimeTransactionsTxHash } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { StatusIcon } from '../../components/StatusIcon'
import { RuntimeTransactionMethod } from '../../components/RuntimeTransactionMethod'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { useScreenSize } from '../../hooks/useScreensize'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import { BlockLink } from '../../components/Blocks/BlockLink'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { RuntimeTransactionEvents } from '../../components/Transactions/RuntimeTransactionEvents'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { AllTokenPrices, useAllTokenPrices } from '../../../coin-gecko/api'
import { CurrentFiatValue } from '../../components/CurrentFiatValue'
import { TransactionEncryptionStatus } from '../../components/TransactionEncryptionStatus'
import Typography from '@mui/material/Typography'
import { LongDataDisplay } from '../../components/LongDataDisplay'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { base64ToHex } from '../../utils/helpers'
import { DappBanner } from '../../components/DappBanner'
import { getFiatCurrencyForScope, showFiatValues } from '../../../config'
import { convertToNano, getGasPrice } from '../../utils/number-utils'
import { useWantedTransaction } from '../../hooks/useWantedTransaction'
import { MultipleTransactionsWarning } from '../../components/Transactions/MultipleTransactionsWarning'
import { SimpleJsonCode } from '../../components/CodeDisplay/SimpleJsonCode'
import { isRoflTransaction } from '../../utils/transaction'
import Box from '@mui/material/Box'
import { RoundedBalance } from 'app/components/RoundedBalance'
import { useTokenTransfers } from '../TokenDashboardPage/hook'
import { TokenTypeTag } from 'app/components/Tokens/TokenList'
import { LinkableDiv } from 'app/components/PageLayout/LinkableDiv'
import { EventBalance } from 'app/components/Tokens/TokenTransfers'
import { transactionEventsContainerId } from '../../utils/tabAnchors'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { RouteUtils } from '../../utils/route-utils'

export const RuntimeTransactionDetailPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRuntimeScope()
  const hash = useParams().hash!

  const { isLoading, data } = useGetRuntimeTransactionsTxHash(
    scope.network,
    scope.layer, // This is OK since consensus has been handled separately
    hash,
  )

  const { wantedTransaction: transaction, warningMultipleTransactionsSameHash } = useWantedTransaction(
    data?.data,
  )

  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))

  if (!transaction && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      <MultipleTransactionsWarning enable={warningMultipleTransactionsSameHash} />
      <SubPageCard featured title={t('transaction.header')} mainTitle>
        <RuntimeTransactionDetailView
          isLoading={isLoading}
          transaction={transaction}
          tokenPrices={tokenPrices}
        />
      </SubPageCard>
      {(transaction?.signers ?? []).map((signer, index) => (
        <DappBanner
          key={`signer-${index}`}
          scope={scope}
          ethOrOasisAddress={signer.address_eth ?? signer.address}
        />
      ))}
      {transaction?.to && <DappBanner scope={scope} ethOrOasisAddress={transaction?.to} />}
      {transaction && (
        <LinkableDiv id={transactionEventsContainerId}>
          <SubPageCard title={t('common.events')}>
            <RuntimeTransactionEvents transaction={transaction} />
          </SubPageCard>
        </LinkableDiv>
      )}
    </PageLayout>
  )
}

export type TransactionDetailRuntimeBlock = RuntimeTransaction & {
  markAsNew?: boolean
}

export const RuntimeTransactionDetailView: FC<{
  isLoading?: boolean
  transaction: TransactionDetailRuntimeBlock | undefined
  showLayer?: boolean
  standalone?: boolean
  tokenPrices: AllTokenPrices
}> = ({ isLoading, transaction, showLayer, standalone = false, tokenPrices }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const formattedTimestamp = useFormattedTimestampStringWithDistance(transaction?.timestamp)
  // @ts-expect-error Ignore index type error
  const amountSymbolPriceInfo = tokenPrices[transaction?.amount_symbol]
  const gasPrice = getGasPrice({ fee: transaction?.charged_fee, gasUsed: transaction?.gas_used.toString() })
  const envelope = transaction?.encryption_envelope ?? transaction?.oasis_encryption_envelope

  const transferEventsQuery = useTokenTransfers(
    transaction,
    transaction?.hash
      ? {
          tx_hash: transaction.hash,
          limit: 10,
          offset: 0,
        }
      : undefined,
  )
  const transfers = transferEventsQuery?.results?.data
  const totalTransfers = transferEventsQuery?.results?.tablePaginationProps?.totalCount

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

          {(transaction?.hash || transaction?.eth_hash) && (
            <>
              <dt>{t('common.hash')}</dt>
              <dd>
                <TransactionLink
                  scope={transaction}
                  hash={(transaction?.eth_hash || transaction?.hash) as string}
                />
                <CopyToClipboard value={transaction?.eth_hash || transaction?.hash} />
              </dd>
            </>
          )}

          <dt>{t('common.status')}</dt>
          <dd style={{ flexWrap: 'wrap', gap: '10px' }}>
            <StatusIcon
              success={transaction.success}
              error={transaction.error}
              withText={true}
              method={transaction.method}
            />
          </dd>

          <dt>{t('common.block')}</dt>
          <dd>
            <BlockLink scope={transaction} height={transaction.round} />
            <CopyToClipboard value={transaction.round.toString()} />
          </dd>

          <dt>{t('common.type')}</dt>
          <dd>
            <RuntimeTransactionMethod transaction={transaction} />
          </dd>

          <dt>{t('transactions.encryption.format')}</dt>
          <dd>
            <TransactionEncryptionStatus envelope={envelope} withText={true} />
          </dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>{formattedTimestamp}</dd>

          {!!transaction?.signers.length && (
            <>
              <dt>{t('common.from')}</dt>
              <dd style={{ columnGap: '1em', rowGap: '3px' }}>
                {(transaction?.signers ?? []).map((signer, index) => (
                  <Box key={`signer-${index}-link`} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <AccountLink
                      scope={transaction}
                      address={(signer.address_eth ?? signer.address) as string}
                    />
                    <CopyToClipboard value={signer.address_eth ?? signer.address} />
                  </Box>
                ))}
              </dd>
            </>
          )}

          {(transaction?.to || transaction?.to_eth) && (
            <>
              <dt>{t('common.to')}</dt>
              <dd>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <AccountLink
                    scope={transaction}
                    address={(transaction?.to_eth || transaction?.to) as string}
                  />
                  <CopyToClipboard value={(transaction?.to_eth || transaction?.to) as string} />
                </Box>
              </dd>
            </>
          )}

          {transfers && transfers.length > 0 && (
            <>
              <dt>{t('transaction.eventsSummary')}</dt>
              <dd>
                <Box sx={{ overflowX: 'auto', paddingTop: '1px' }}>
                  {transfers.map((transfer, i) => {
                    const params = transfer.evm_log_params
                    if (!params) return null

                    const from = params.find(p => p.name === 'from')?.value as string | undefined
                    const to = params.find(p => p.name === 'to')?.value as string | undefined

                    return (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          alignItems: isMobile ? 'flex-start' : 'center',
                          columnGap: 2,
                          mb: isMobile ? 4 : 2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <TokenTypeTag tokenType={transfer.evm_token?.type} />
                        <Typography variant="body2">
                          {t('common.from')}{' '}
                          {from ? <AccountLink scope={transaction} address={from} alwaysTrim /> : '?'}
                        </Typography>

                        <Typography variant="body2">
                          {t('common.to')}{' '}
                          {to ? <AccountLink scope={transaction} address={to} alwaysTrim /> : '?'}
                        </Typography>

                        <Typography variant="body2">
                          {t('common.for')} <EventBalance event={transfer} tickerAsLink={false} />
                        </Typography>
                      </Box>
                    )
                  })}
                  {(totalTransfers ?? 0) > transfers.length && (
                    <Link
                      component={RouterLink}
                      to={`${RouteUtils.getTransactionRoute(transaction, transaction.hash)}#${transactionEventsContainerId}`}
                      sx={{ mt: 1, textDecoration: 'underline' }}
                    >
                      {t('common.seeMore')}
                    </Link>
                  )}
                </Box>
              </dd>
            </>
          )}

          <dt>{t('common.amount')}</dt>
          <dd>
            {transaction.amount != null
              ? t('common.valueInToken', {
                  ...getPreciseNumberFormat(transaction.amount),
                  ticker: transaction.amount_symbol,
                })
              : t('common.missing')}
          </dd>

          {transaction?.body?.shares && (
            <>
              <dt>{t('common.shares')}</dt>
              <dd>
                <RoundedBalance
                  compactLargeNumbers
                  value={transaction?.body?.shares}
                  ticker={t('common.shares')}
                />
              </dd>
            </>
          )}

          {showFiatValues &&
            transaction.amount !== undefined &&
            !!amountSymbolPriceInfo &&
            !amountSymbolPriceInfo.isLoading &&
            !amountSymbolPriceInfo.isFree &&
            amountSymbolPriceInfo.price !== undefined && (
              <>
                <dt>{t('currentFiatValue.title')}</dt>
                <dd>
                  <CurrentFiatValue amount={transaction.amount} {...amountSymbolPriceInfo} />
                </dd>
              </>
            )}

          <dt>{t('common.fee')}</dt>
          <dd>
            {t('common.valueInToken', {
              ...getPreciseNumberFormat(transaction.charged_fee),
              ticker: transaction.fee_symbol,
            })}
          </dd>

          {gasPrice && (
            <>
              <dt>{t('common.gasPrice')}</dt>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(convertToNano(gasPrice)),
                  ticker: `n${transaction.fee_symbol}`,
                })}
              </dd>
            </>
          )}

          <dt>{t('common.gasUsed')}</dt>
          <dd>{transaction.gas_used.toLocaleString()}</dd>

          <dt>{t('common.gasLimit')}</dt>
          <dd>{transaction.gas_limit.toLocaleString()}</dd>

          <dt>{t('common.nonce')}</dt>
          <dd>
            <>{transaction.signers[0].nonce.toLocaleString()}</>
          </dd>

          {!!transaction.body?.data && (
            <>
              <dt>{t('transaction.rawData')}</dt>
              <dd>
                <LongDataDisplay data={base64ToHex(transaction.body.data)} />
              </dd>
            </>
          )}

          {isRoflTransaction(transaction.method) && !!transaction.body && (
            <>
              <dt>{t('transaction.rawData')}</dt>
              <dd>
                <SimpleJsonCode data={transaction.body} />
              </dd>
            </>
          )}

          {!envelope && transaction.body?.init_code && (
            <>
              <dt>{t('transaction.rawData')}</dt>
              <dd>
                <LongDataDisplay data={base64ToHex(transaction.body.init_code)} />
              </dd>
            </>
          )}

          {envelope && (
            <>
              {envelope.public_key !== undefined && (
                <>
                  <dt>{t('transactions.encryption.publicKey')}</dt>
                  <dd>
                    <Typography variant="mono" sx={{ overflowWrap: 'anywhere' }}>
                      {envelope.public_key}
                    </Typography>
                  </dd>
                </>
              )}

              {envelope.data_nonce !== undefined && (
                <>
                  <dt>{t('transactions.encryption.dataNonce')}</dt>
                  <dd>
                    <Typography variant="mono" sx={{ overflowWrap: 'anywhere' }}>
                      {envelope.data_nonce}
                    </Typography>
                  </dd>
                </>
              )}

              {envelope.data !== undefined && (
                <>
                  <dt>{t('transactions.encryption.encryptedData')}</dt>
                  <dd>
                    <LongDataDisplay data={envelope.data} />
                  </dd>
                </>
              )}

              {envelope.result_nonce !== undefined && (
                <>
                  <dt>{t('transactions.encryption.resultNonce')}</dt>
                  <dd>
                    <Typography variant="mono" sx={{ fontWeight: 400 }}>
                      {envelope.result_nonce}
                    </Typography>
                  </dd>
                </>
              )}

              {envelope.result !== undefined && (
                <>
                  <dt>{t('transactions.encryption.encryptedResult')}</dt>
                  <dd>
                    <LongDataDisplay data={envelope.result} fontWeight={400} />
                  </dd>
                </>
              )}
            </>
          )}
        </StyledDescriptionList>
      )}
    </>
  )
}
