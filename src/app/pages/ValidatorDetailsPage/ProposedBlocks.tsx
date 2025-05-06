import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { SearchScope } from 'types/searchScope'
import { useGetConsensusBlocks, Validator } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusBlocks } from '../../components/Blocks'

type ProposedBlocksProps = {
  scope: SearchScope
  validator: Validator | undefined
}

export const ProposedBlocks: FC<ProposedBlocksProps> = ({ scope, validator }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('proposedBlocks')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const blocksQuery = useGetConsensusBlocks(scope.network, {
    limit: PAGE_SIZE,
    offset,
    proposed_by: validator?.entity_address,
  })

  const { isLoading, data } = blocksQuery
  const blocks = data?.data.blocks

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('validator.proposedBlocks')} />
      <CardContent>
        <ConsensusBlocks
          isLoading={isLoading}
          blocks={blocks}
          limit={PAGE_SIZE}
          pagination={{
            selectedPage: pagination.selectedPage,
            linkToPage: pagination.linkToPage,
            totalCount: data?.data.total_count,
            isTotalCountClipped: data?.data.is_total_count_clipped,
            rowsPerPage: PAGE_SIZE,
          }}
          showEpoch
        />
      </CardContent>
    </Card>
  )
}
