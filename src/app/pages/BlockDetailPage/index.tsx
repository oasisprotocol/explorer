import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { Layer, RuntimeBlock, useGetRuntimeBlockByHeight } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { TransactionsCard } from './TransactionsCard'
import { AppErrors } from '../../../types/errors'
import { paraTimesConfig } from '../../../config'
import { transactionsContainerId } from './TransactionsCard'
import { useLayerParam } from '../../hooks/useLayerParam'
import { BlockLink, BlockHashLink } from '../../components/Blocks/BlockLink'
import { RouteUtils } from '../../utils/route-utils'
import { useFormatNumber } from '../../hooks/useNumberFormatter'

export const BlockDetailPage: FC = () => {
  const { t } = useTranslation()
  const layer = useLayerParam()
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading the details of consensus blocks is not yet supported.
    // We should use useGetConsensusBlocksHeight()
  }
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetRuntimeBlockByHeight(
    layer, // This is OK, since consensus is already handled separately
    blockHeight,
  )
  if (!data && !isLoading) {
    throw AppErrors.NotFoundBlockHeight
  }
  const block = data?.data

  return (
    <PageLayout>
      <SubPageCard featured title={t('common.block')}>
        <BlockDetailView isLoading={isLoading} block={block} />
      </SubPageCard>
      <TransactionsCard layer={layer} blockHeight={blockHeight} />
    </PageLayout>
  )
}

export type BlockDetailRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export const BlockDetailView: FC<{
  isLoading?: boolean
  block: BlockDetailRuntimeBlock | undefined
  showLayer?: boolean
  standalone?: boolean
}> = ({ isLoading, block, showLayer, standalone = false }) => {
  const { t } = useTranslation()
  const formatNumber = useFormatNumber()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTime = useFormattedTimestampString(block?.timestamp)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (!block) return <></>

  const transactionsAnchor = `${RouteUtils.getBlockRoute(
    block.round,
    block.layer,
  )}#${transactionsContainerId}`
  const blockGasLimit = paraTimesConfig[block.layer]?.mainnet.blockGasLimit
  if (!blockGasLimit) throw new Error('blockGasLimit is not configured')
  return (
    <StyledDescriptionList
      titleWidth={isMobile ? '100px' : '200px'}
      standalone={standalone}
      highlight={block.markAsNew}
    >
      {showLayer && (
        <>
          <dt>{t('common.paratime')}</dt>
          <dd>{t(`common.${block.layer}`)}</dd>
        </>
      )}
      <dt>{t('common.height')}</dt>
      <dd>
        <BlockLink height={block.round} layer={block.layer} />
        <CopyToClipboard value={block.round.toString()} />
      </dd>

      <dt>{t('common.hash')}</dt>
      <dd>
        <BlockHashLink hash={block.hash} height={block.round} layer={block.layer} />
        <CopyToClipboard value={block.round.toString()} />
      </dd>

      <dt>{t('common.timestamp')}</dt>
      <dd>{formattedTime}</dd>

      <dt>{t('common.size')}</dt>
      <dd>
        {formatNumber(block.size, {
          unit: 'byte',
        })}
      </dd>

      <dt>{t('common.transactions')}</dt>
      <dd>
        <Link href={transactionsAnchor}>
          {formatNumber(block.num_transactions, { countKey: 'common.transactionsNumber' })}
        </Link>
      </dd>

      <dt>{t('common.gasUsed')}</dt>
      <dd>
        {t('block.gasUsed', {
          value: formatNumber(block.gas_used),
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
      <dd>{formatNumber(blockGasLimit)}</dd>
    </StyledDescriptionList>
  )
}
