import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams } from 'react-router'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RuntimeBlock, useGetRuntimeBlockByHeight } from '../../../oasis-nexus/api'
import { RouterTabs } from '../../components/RouterTabs'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { AppErrors } from '../../../types/errors'
import { paraTimesConfig } from '../../../config'
import { BlockLink, BlockHashLink } from '../../components/Blocks/BlockLink'
import { RouteUtils } from '../../utils/route-utils'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { RuntimeNextBlockButton, RuntimePrevBlockButton } from '../../components/BlockNavigationButtons'
import { useRuntimeEventTypeParam, useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { eventsContainerId, transactionsContainerId } from '../../utils/tabAnchors'
import { RuntimeBlockDetailsContext } from './types'

export const RuntimeBlockDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()
  const txLink = useHref('')
  const eventsLink = useHref(`events#${eventsContainerId}`)
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetRuntimeBlockByHeight(
    scope.network,
    scope.layer, // This is OK, since consensus is already handled separately
    blockHeight,
  )
  if (!data && !isLoading) {
    throw AppErrors.NotFoundBlockHeight
  }
  const block = data?.data
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()
  const { eventType, setEventType } = useRuntimeEventTypeParam()
  const context: RuntimeBlockDetailsContext = {
    scope,
    blockHeight,
    txMethod,
    setTxMethod,
    eventType,
    setEventType,
  }

  return (
    <PageLayout>
      <SubPageCard featured title={t('common.block')} mainTitle>
        <RuntimeBlockDetailView enableBlockNavigation={true} isLoading={isLoading} block={block} />
      </SubPageCard>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          { label: t('common.events'), to: eventsLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}

export type BlockDetailRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export const RuntimeBlockDetailView: FC<{
  isLoading?: boolean
  block: BlockDetailRuntimeBlock | undefined
  showLayer?: boolean
  standalone?: boolean
  enableBlockNavigation?: boolean
}> = ({ enableBlockNavigation, isLoading, block, showLayer, standalone = false }) => {
  const { t } = useTranslation()
  const formattedTime = useFormattedTimestampStringWithDistance(block?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (!block) return <></>

  const transactionsAnchor = `${RouteUtils.getBlockRoute(block, block.round)}#${transactionsContainerId}`
  const transactionLabel = block.num_transactions.toLocaleString()
  const blockGasLimit = paraTimesConfig[block.layer]?.[block.network]?.blockGasLimit
  if (!blockGasLimit) throw new Error('blockGasLimit is not configured')
  return (
    <StyledDescriptionList standalone={standalone} highlight={block.markAsNew}>
      {showLayer && (
        <>
          <dt>{t('common.chain')}</dt>
          <dd>
            <DashboardLink scope={block} />
          </dd>
        </>
      )}
      <dt>{t('common.block')}</dt>
      <dd>
        <BlockLink scope={block} height={block.round} />
        <CopyToClipboard value={block.round.toString()} />
        {enableBlockNavigation && (
          <>
            <RuntimePrevBlockButton
              scope={{ network: block.network, layer: block.layer }}
              currentRound={block.round}
            />
            <RuntimeNextBlockButton
              scope={{ network: block.network, layer: block.layer }}
              currentRound={block.round}
            />
          </>
        )}
      </dd>

      <dt>{t('common.hash')}</dt>
      <dd>
        <BlockHashLink scope={block} hash={block.hash} height={block.round} />
        <CopyToClipboard value={block.hash.toString()} />
      </dd>

      <dt>{t('common.timestamp')}</dt>
      <dd>{formattedTime}</dd>

      <dt>{t('common.size')}</dt>
      <dd>
        {t('common.bytes', {
          value: block.size,
          formatParams: {
            value: {
              style: 'unit',
              unit: 'byte',
              unitDisplay: 'long',
            } satisfies Intl.NumberFormatOptions,
          },
        })}
      </dd>

      <dt>{t('common.transactions')}</dt>
      <dd>
        {block.num_transactions ? (
          <Link className="font-medium" href={transactionsAnchor}>
            {transactionLabel}
          </Link>
        ) : (
          transactionLabel
        )}
      </dd>

      <dt>{t('common.gasUsed')}</dt>
      <dd>
        {t('block.gasUsed', {
          value: block.gas_used,
          percentage: block.gas_used / blockGasLimit,
          formatParams: {
            percentage: {
              style: 'percent',
              maximumFractionDigits: 2,
            } satisfies Intl.NumberFormatOptions,
          },
        })}
      </dd>

      <dt>{t('common.gasLimit')}</dt>
      <dd>{blockGasLimit.toLocaleString()}</dd>
    </StyledDescriptionList>
  )
}
