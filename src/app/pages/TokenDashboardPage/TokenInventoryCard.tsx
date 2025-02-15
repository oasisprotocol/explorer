import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { CardEmptyState } from '../../components/CardEmptyState'
import { TokenDashboardContext } from './index'
import { RouteUtils } from '../../utils/route-utils'
import { TablePagination } from '../../components/Table/TablePagination'
import { useTokenInventory } from './hook'
import { ImageListItemImage } from './ImageListItemImage'
import { NFTInstanceLink, NFTOwnerLink } from './NFTLinks'
import { EvmNft } from 'oasis-nexus/api'
import { To } from 'react-router-dom'
import { SearchScope } from 'types/searchScope'
import { inventoryContainerId } from '../../utils/tabAnchors'

export const TokenInventoryCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { inventory, isFetched, pagination, totalCount } = useTokenInventory(scope, address)

  return (
    <LinkableCardLayout containerId={inventoryContainerId} title="">
      <TokenInventoryView
        inventory={inventory}
        isFetched={isFetched}
        pagination={pagination}
        scope={scope}
        totalCount={totalCount}
      />
    </LinkableCardLayout>
  )
}

type TokenInventoryViewProps = {
  inventory: EvmNft[] | undefined
  isFetched: boolean
  totalCount: number | undefined
  pagination: {
    isTotalCountClipped: boolean | undefined
    rowsPerPage: number
    selectedPage: number
    linkToPage: (pageNumber: number) => To
  }
  scope: SearchScope
}

const TokenInventoryView: FC<TokenInventoryViewProps> = ({
  inventory,
  isFetched,
  pagination,
  scope,
  totalCount,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {isFetched && !totalCount && <CardEmptyState label={t('tokens.emptyInventory')} />}
      {!!inventory?.length && (
        <>
          <ImageList gap={10}>
            {inventory?.map(instance => {
              const owner = instance?.owner_eth ?? instance?.owner
              const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.contract_addr, instance.id)
              return (
                <ImageListItem key={instance.id}>
                  <ImageListItemImage instance={instance} to={to} />
                  <ImageListItemBar
                    title={<NFTInstanceLink scope={scope} instance={instance} />}
                    subtitle={owner ? <NFTOwnerLink scope={scope} owner={owner} /> : undefined}
                    position="below"
                  />
                </ImageListItem>
              )
            })}
          </ImageList>
          {pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TablePagination {...pagination} totalCount={totalCount} />
            </Box>
          )}
        </>
      )}
    </>
  )
}
