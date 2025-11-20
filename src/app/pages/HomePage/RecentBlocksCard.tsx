import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useGetRecentBlocks } from '../../../oasis-nexus/api'
import { RecentBlocks } from '../../components/Blocks/RecentBlocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const RecentBlocksContent: FC = () => {
  const recentBlocksQuery = useGetRecentBlocks('mainnet')
  const recentBlocks = recentBlocksQuery.data?.data.blocks
  const filteredBlocks = recentBlocks?.slice(0, 5)

  return <RecentBlocks isLoading={recentBlocksQuery.isLoading} blocks={filteredBlocks} limit={limit} />
}

export const RecentBlocksCard: FC = () => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3" className="text-lg">
            {t('blocks.latest')}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light minHeight={400}>
          <RecentBlocksContent />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
