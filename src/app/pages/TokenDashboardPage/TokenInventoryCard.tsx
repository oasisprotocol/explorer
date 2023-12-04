import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { TokenDashboardContext } from './index'
import { AccountLink } from '../../components/Account/AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { TablePagination } from '../../components/Table/TablePagination'
import { useTokenInventory } from './hook'
import { ImageListItemImage } from './ImageListItemImage'
import { NFTInstanceLink } from './NFTLinks'

export const tokenInventoryContainerId = 'inventory'

export const TokenInventoryCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={tokenInventoryContainerId}>
        <CardHeader disableTypography component="h3" title={t('tokens.inventory')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <TokenInventoryView scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const TokenInventoryView: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { inventory, isFetched, pagination, totalCount } = useTokenInventory(scope, address)

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
                    subtitle={
                      owner ? <AccountLink scope={scope} address={owner} alwaysTrim={true} /> : undefined
                    }
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
