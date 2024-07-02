import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { useScreenSize } from '../../hooks/useScreensize'
import { Block, Layer, useGetConsensusBlockByHeight } from '../../../oasis-nexus/api'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { BlockLink, BlockHashLink } from '../../components/Blocks/BlockLink'
import { ConsensusNextBlockButton, ConsensusPrevBlockButton } from '../../components/BlockNavigationButtons'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'

export type BlockDetailConsensusBlock = Block & {
  markAsNew?: boolean
}

export const ConsensusBlockDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  if (scope.layer !== Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetConsensusBlockByHeight(scope.network, blockHeight)
  if (!data && !isLoading) {
    throw AppErrors.NotFoundBlockHeight
  }
  const block = data?.data
  return (
    <PageLayout>
      <SubPageCard featured title={t('common.block')}>
        <ConsensusBlockDetailView enableBlockNavigation isLoading={isLoading} block={block} />
      </SubPageCard>
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
  const { isMobile } = useScreenSize()
  const formattedTime = useFormattedTimestampStringWithDistance(block?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (!block) return <></>
  const transactionLabel = block.num_transactions.toLocaleString()

  return (
    <StyledDescriptionList
      titleWidth={isMobile ? '100px' : '200px'}
      standalone={standalone}
      highlight={block.markAsNew}
    >
      {showLayer && (
        <>
          <dt>{t('common.paratime')}</dt>
          <dd>
            <DashboardLink scope={block} />
          </dd>
        </>
      )}
      <dt>{t('common.height')}</dt>
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
    </StyledDescriptionList>
  )
}
