import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Skeleton from '@mui/material/Skeleton'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'

// TODO: replace with an appropriate API
function useGetEmeraldBlockByHeight(blockHeight: number) {
  const blockQuery = useGetEmeraldBlocks({ to: blockHeight, limit: 1 })
  const block = blockQuery.data?.data?.blocks?.[0]!
  return {
    ...blockQuery,
    data: { data: block },
  }
}

export const BlockDetailPage: FC = () => {
  const { t } = useTranslation()
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetEmeraldBlockByHeight(blockHeight)
  const block = data.data

  return (
    <PageLayout>
      <SubPageCard title={t('common.table.block')}>
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
          <StyledDescriptionList titleWidth="200px">
            <dt>{t('common.table.block')}</dt>
            <dd>{block.round}</dd>

            <dt>{t('common.table.age')}</dt>
            <dd>
              {formatDistanceStrict(new Date(block.timestamp!), new Date(), {
                addSuffix: true,
              })}
            </dd>

            <dt>{t('common.table.size')}</dt>
            <dd>{t('common.table.bytes', { value: block.size_bytes?.toLocaleString() })}</dd>

            <dt>{t('common.table.transactions')}</dt>
            <dd>{t('common.table.transactionsNumber', { value: block.num_transactions })}</dd>

            <dt>{t('common.table.hash')}</dt>
            <dd>
              <CopyToClipboard value={`0x${block.hash}`} />
            </dd>

            <dt>{t('common.table.gasUsed')}</dt>
            <dd>{block.gas_used?.toLocaleString()}</dd>
          </StyledDescriptionList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
