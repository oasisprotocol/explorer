import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { Block } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { BlockLink, BlockHashLink } from '../../components/Blocks/BlockLink'

import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'

export type BlockDetailConsensusBlock = Block & {
  markAsNew?: boolean
}

export const ConsensusBlockDetailView: FC<{
  isLoading?: boolean
  block: BlockDetailConsensusBlock | undefined
  showLayer?: boolean
  standalone?: boolean
}> = ({ isLoading, block, showLayer, standalone = false }) => {
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
