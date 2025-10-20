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
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
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
import { RoundedBalance } from 'app/components/RoundedBalance'
import * as oasis from '@oasisprotocol/client'
import { useTokenTransfers } from '../TokenDashboardPage/hook'
import { TokenTypeTag } from 'app/components/Tokens/TokenList'
import { LinkableDiv } from 'app/components/PageLayout/LinkableDiv'
import { EventBalance } from 'app/components/Tokens/TokenTransfers'
import { transactionEventsContainerId } from '../../utils/tabAnchors'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { RouteUtils } from '../../utils/route-utils'
import Tooltip from '@mui/material/Tooltip'
import { yamlDump } from '../../utils/yamlDump'
import { useRuntimeEventTypeParam } from '../../hooks/useCommonParams'
import { RuntimeEventTypeFilter } from '../../components/RuntimeEvents/RuntimeEventTypeFilter'
import { CardDivider } from '../../components/Divider'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const RuntimeTransactionDetailPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const scope = useRuntimeScope()
  const hash = useParams().hash!
  const { eventType, setEventType } = useRuntimeEventTypeParam()

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
          <SubPageCard
            title={t('common.events')}
            action={
              !isMobile && (
                <RuntimeEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
              )
            }
          >
            {isMobile && (
              <>
                <RuntimeEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
                <CardDivider />
              </>
            )}
            <ErrorBoundary light>
              <RuntimeTransactionEvents transaction={transaction} eventType={eventType} />
            </ErrorBoundary>
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
    'workaroundQueryParamOverwrittenByOffset',
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
          {transaction.evm_fn_params && (
            <>
              <dt>{t('transactions.method.evm.call')}</dt>
              <dd>
                <LongDataDisplay
                  data={`${transaction.evm_fn_name}(\n${yamlDump(transaction.evm_fn_params.map(a => ({ [a.name]: a.value })))})`}
                  collapsedLinesNumber={8}
                  fontWeight={400}
                />
              </dd>
            </>
          )}
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
                  <div key={`signer-${index}-link`} className="inline-flex items-center">
                    <AccountLink
                      scope={transaction}
                      address={(signer.address_eth ?? signer.address) as string}
                    />
                    <CopyToClipboard value={signer.address_eth ?? signer.address} />
                  </div>
                ))}
              </dd>
            </>
          )}

          {(transaction?.to || transaction?.to_eth) && (
            <>
              <dt>{t('common.to')}</dt>
              <dd>
                <div className="inline-flex items-center">
                  <AccountLink
                    scope={transaction}
                    address={(transaction?.to_eth || transaction?.to) as string}
                  />
                  <CopyToClipboard value={(transaction?.to_eth || transaction?.to) as string} />
                </div>
              </dd>
            </>
          )}

          {transfers && transfers.length > 0 && (
            <>
              <dt>{t('transaction.eventsSummary')}</dt>
              <dd>
                <div className="overflow-x-auto">
                  {transfers.map((transfer, i) => {
                    const params = transfer.evm_log_params
                    if (!params) return null

                    const from = params.find(p => p.name === 'from')?.value as string | undefined
                    const to = params.find(p => p.name === 'to')?.value as string | undefined

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-start mb-4 gap-0.5 whitespace-nowrap sm:flex-row sm:items-center sm:mb-1 sm:gap-1"
                      >
                        <TokenTypeTag tokenType={transfer.evm_token?.type} />
                        <Typography className="inline-flex items-center gap-1">
                          {t('common.from')}{' '}
                          {from ? <AccountLink scope={transaction} address={from} alwaysTrim /> : '?'}
                        </Typography>

                        <Typography className="inline-flex items-center gap-1">
                          {t('common.to')}{' '}
                          {to ? <AccountLink scope={transaction} address={to} alwaysTrim /> : '?'}
                        </Typography>

                        <Typography>
                          {t('common.for')} <EventBalance event={transfer} tickerAsLink={false} />
                        </Typography>
                      </div>
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
                </div>
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
            (amountSymbolPriceInfo.hasFailed ||
              (!amountSymbolPriceInfo.isFree && amountSymbolPriceInfo.price !== undefined)) && (
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

          {transaction.fee_proxy_module && transaction.fee_proxy_id && (
            <>
              <dt>{t('common.feeProxy')}</dt>
              <dd>
                {transaction.fee_proxy_module === 'rofl' ? (
                  <Tooltip title={t('common.feeProxyTooltip')} arrow placement="top">
                    <span>
                      <Link
                        component={RouterLink}
                        to={RouteUtils.getRoflAppRoute(
                          transaction.network,
                          oasis.address.toBech32('rofl', Buffer.from(transaction.fee_proxy_id, 'base64')),
                        )}
                      >
                        {oasis.address.toBech32('rofl', Buffer.from(transaction.fee_proxy_id, 'base64'))}
                      </Link>
                    </span>
                  </Tooltip>
                ) : (
                  <>
                    {t('common.module')}: {transaction.fee_proxy_module}, {t('common.id')}:&nbsp;
                    <Tooltip title={t('common.feeProxyTooltip')} arrow placement="top">
                      <span> {base64ToHex(transaction.fee_proxy_id)}</span>
                    </Tooltip>
                  </>
                )}
              </dd>
            </>
          )}

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
                    <span className="font-normal">{envelope.public_key}</span>
                  </dd>
                </>
              )}

              {envelope.data_nonce !== undefined && (
                <>
                  <dt>{t('transactions.encryption.dataNonce')}</dt>
                  <dd>
                    <span className="font-normal">{envelope.data_nonce}</span>
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
                    <span className="font-normal">{envelope.result_nonce}</span>
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
