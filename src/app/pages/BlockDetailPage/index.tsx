import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { RuntimeBlock, useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { Transactions } from '../../components/Transactions'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'

// TODO: replace with an appropriate API
function useGetEmeraldBlockByHeight(blockHeight: number) {
  const blockQuery = useGetEmeraldBlocks({ to: blockHeight, limit: 1 })
  const block = blockQuery.data?.data.blocks[0]
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
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetEmeraldTransactions({
    block: blockHeight,
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
  })

  return (
    <PageLayout>
      <BlockDetailView isLoading={isLoading} block={block}></BlockDetailView>
      <Card>
        <CardHeader disableTypography component="h3" title={t('common.transactions')} />
        <CardContent>
          <Transactions
            transactions={transactionsQuery.data?.data.transactions}
            isLoading={transactionsQuery.isLoading}
            limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
            pagination={{
              selectedPage: txsPagination.selectedPage,
              linkToPage: txsPagination.linkToPage,
            }}
          />
        </CardContent>
      </Card>
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
          <dt>{t('common.block')}</dt>
          <dd>{block.round}</dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>
            {t('common.formattedBlockTimestamp', {
              timestamp: new Date(block.timestamp),
              distance: formatDistanceStrict(new Date(block.timestamp), new Date(), {
                addSuffix: true,
              }),
              formatParams: {
                timestamp: {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  timeZoneName: 'short',
                },
              },
            })}
          </dd>

          <dt>{t('common.size')}</dt>
          <dd>
            {t('common.bytes', {
              value: block.size_bytes,
              formatParams: {
                value: {
                  style: 'unit',
                  unit: 'byte',
                  unitDisplay: 'long',
                },
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
