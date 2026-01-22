import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { useScreenSize } from '../../hooks/useScreensize'
import { Block, EntityMetadata, useGetConsensusBlockByHeight } from '../../../oasis-nexus/api'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { useConsensusScope } from '../../hooks/useScopeParam'
import { RouterTabs } from '../../components/RouterTabs'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { BlockLink, BlockHashLink } from '../../components/Blocks/BlockLink'
import { ConsensusNextBlockButton, ConsensusPrevBlockButton } from '../../components/BlockNavigationButtons'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { AdaptiveTrimmer } from '../../components/AdaptiveTrimmer/AdaptiveTrimmer'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { ValidatorLink } from '../../components/Validators/ValidatorLink'
import { eventsContainerId } from '../../utils/tabAnchors'
import { ConsensusBlockDetailsContext } from './types'

export type BlockDetailConsensusBlock = Block & {
  markAsNew?: boolean
}

export const ConsensusBlockDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useConsensusScope()
  const txLink = useHref('')
  const eventsLink = useHref(`events#${eventsContainerId}`)
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetConsensusBlockByHeight(scope.network, blockHeight)
  if (!data && !isLoading) {
    throw AppErrors.NotFoundBlockHeight
  }
  const block = data?.data
  const context: ConsensusBlockDetailsContext = { scope, blockHeight }

  return (
    <PageLayout>
      <SubPageCard featured title={t('common.block')}>
        <ConsensusBlockDetailView enableBlockNavigation isLoading={isLoading} block={block} />
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

export const ConsensusBlockDetailView: FC<{
  isLoading?: boolean
  block: BlockDetailConsensusBlock | undefined
  showLayer?: boolean
  standalone?: boolean
  enableBlockNavigation?: boolean
}> = ({ enableBlockNavigation, isLoading, block, showLayer, standalone = false }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()
  const formattedTime = useFormattedTimestampStringWithDistance(block?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (!block) return <></>
  const transactionLabel = block.num_transactions.toLocaleString()

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
        <BlockLink scope={block} height={block.height} />
        <CopyToClipboard value={block.height.toString()} />
        {enableBlockNavigation && (
          <>
            <ConsensusPrevBlockButton
              scope={{ network: block.network, layer: block.layer }}
              currentRound={block.height}
            />
            <ConsensusNextBlockButton
              scope={{ network: block.network, layer: block.layer }}
              currentRound={block.height}
            />
          </>
        )}
      </dd>

      <dt>{t('common.hash')}</dt>
      <dd>
        <BlockHashLink scope={block} hash={block.hash} height={block.height} />
        <CopyToClipboard value={block.hash.toString()} />
      </dd>

      {block.state_root && (
        <>
          <dt>{t('common.stateRoot')}</dt>
          <dd>
            {isTablet ? (
              <span className="font-mono max-w-full overflow-x-hidden">
                <AdaptiveTrimmer text={block.state_root} strategy="middle" minLength={13} />
              </span>
            ) : (
              <span className="font-mono">{block.state_root}</span>
            )}
            <CopyToClipboard value={block.state_root} />
          </dd>
        </>
      )}

      {!!block.proposer?.entity_address && (
        <>
          <dt>{t('common.proposer')}</dt>
          <dd>
            <ValidatorLink
              name={(block.proposer?.entity_metadata as EntityMetadata)?.name}
              address={block.proposer?.entity_address}
              alwaysTrim
              network={block.network}
            />
          </dd>
        </>
      )}
      <dt>{t('common.timestamp')}</dt>
      <dd>{formattedTime}</dd>

      <dt>{t('common.transactions')}</dt>
      <dd>
        {/*{block.num_transactions ? (*/}
        {/*  <Link href={transactionsAnchor}>{transactionLabel}</Link>*/}
        {/*) : (*/}
        {transactionLabel}
        {/*)}*/}
      </dd>

      {!!block.epoch && (
        <>
          <dt>{t('common.epoch')}</dt>
          <dd>{block.epoch}</dd>
        </>
      )}

      {!!block.gas_limit && (
        <>
          <dt>{t('common.gasLimit')}</dt>
          <dd>
            {t('common.valuePair', {
              value: block.gas_limit,
            })}
            {block.gas_limit === 0 && ` ${t('block.unlimited')}`}
          </dd>
        </>
      )}

      {block.size_limit && (
        <>
          <dt>{t('common.blockSizeLimit')}</dt>
          <dd>
            {t('common.bytes', {
              value: block.size_limit,
              formatParams: {
                value: {
                  style: 'unit',
                  unit: 'byte',
                  unitDisplay: 'long',
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
