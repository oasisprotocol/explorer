import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { RuntimeBlock, useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'

import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { TransactionsCard } from './TransactionsCard'
import { AppErrors } from '../../../types/errors'

// TODO: replace with an appropriate API
function useGetEmeraldBlockByHeight(blockHeight: number) {
  const blockQuery = useGetEmeraldBlocks({ to: blockHeight, limit: 1 })
  const block = blockQuery.data?.data.blocks[0]
  if (block && block.round !== blockHeight) {
    throw AppErrors.NotFoundBlockHeight
  }
  return {
    ...blockQuery,
    data: { data: block },
  }
}

export const BlockDetailPage: FC = () => {
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetEmeraldBlockByHeight(blockHeight)
  const block = data.data

  return (
    <PageLayout>
      <BlockDetailView isLoading={isLoading} block={block}></BlockDetailView>
      <TransactionsCard blockHeight={blockHeight} />
    </PageLayout>
  )
}

export const BlockDetailView: FC<{
  isLoading: boolean
  block: RuntimeBlock | undefined
}> = ({ isLoading, block }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTime = useFormattedTimestampString(block?.timestamp)
  return (
    <SubPageCard featured title={t('common.block')}>
      {isLoading && (
        <>
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          <Skeleton variant="text" height={30} sx={{ my: 4 }} />
        </>
      )}
      {block && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          <dt>{t('common.height')}</dt>
          <dd>{block.round}</dd>

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
          <dd>{t('common.transactionsNumber', { value: block.num_transactions })}</dd>

          <dt>{t('common.hash')}</dt>
          <dd>
            <CopyToClipboard value={`0x${block.hash}`} />
          </dd>

          <dt>{t('common.gasUsed')}</dt>
          <dd>{block.gas_used.toLocaleString()}</dd>
        </StyledDescriptionList>
      )}
    </SubPageCard>
  )
}
