import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, Link as RouterLink, To } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { RuntimeAccountDetailsContext } from './index'
import { AccountLink } from 'app/components/Account/AccountLink'
import { CopyToClipboard } from 'app/components/CopyToClipboard'
import { AddressLoaderData, RouteUtils } from 'app/utils/route-utils'
import { ImageListItemImage } from '../TokenDashboardPage/ImageListItemImage'
import { CardEmptyState } from '../../components/CardEmptyState'
import { TablePagination } from '../../components/Table/TablePagination'
import { useAccountTokenInventory } from '../TokenDashboardPage/hook'
import { EvmNft } from 'oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { NFTCollectionLink, NFTInstanceLink } from '../TokenDashboardPage/NFTLinks'
import { CardHeaderWithCounter } from 'app/components/CardHeaderWithCounter'
import { nftCollectionContainerId } from '../../utils/tabAnchors'
import { ImageList, ImageListItem } from '../../components/ImageList'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@oasisprotocol/ui-library/src/components/ui/breadcrumb'

export const AccountNFTCollectionCard: FC<RuntimeAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { address: contractAddress } = useLoaderData() as AddressLoaderData
  const { inventory, isFetched, isLoading, isTotalCountClipped, pagination, totalCount } =
    useAccountTokenInventory(scope, address, contractAddress)
  const firstToken = inventory?.length ? inventory?.[0].token : undefined

  return (
    <Card>
      <LinkableDiv id={nftCollectionContainerId}>
        <CardHeader
          action={
            isFetched &&
            firstToken && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', paddingY: 3 }}>
                <AccountLink scope={scope} address={firstToken?.eth_contract_addr} alwaysTrim />
                <CopyToClipboard value={firstToken?.eth_contract_addr} />
              </Box>
            )
          }
          disableTypography
          component="h3"
          title={
            <Box sx={{ display: 'flex' }} gap={4}>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Typography fontSize={18}>
                      <Link
                        preventScrollReset={true}
                        component={RouterLink}
                        to={RouteUtils.getAccountTokensRoute(scope, address, 'ERC721', '')}
                      >
                        {t('nft.accountCollection')}
                      </Link>
                    </Typography>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-lg">
                    {isFetched && (
                      <CardHeaderWithCounter
                        label={firstToken?.name ? inventory?.[0].token.name : t('common.collection')}
                        totalCount={totalCount}
                        isTotalCountClipped={isTotalCountClipped}
                      />
                    )}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {isLoading && <Skeleton className="w-1/2 h-4" />}
            </Box>
          }
        />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <AccountNFTCollection
            inventory={inventory}
            isFetched={isFetched}
            isLoading={isLoading}
            totalCount={totalCount}
            isTotalCountClipped={isTotalCountClipped}
            pagination={pagination}
            scope={scope}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

type AccountNFTCollectionProps = {
  inventory: EvmNft[] | undefined
  isLoading: boolean
  isFetched: boolean
  isTotalCountClipped: boolean | undefined
  totalCount: number | undefined
  pagination: {
    rowsPerPage: number
    selectedPage: number
    linkToPage: (pageNumber: number) => To
  }
  scope: SearchScope
}

const AccountNFTCollection: FC<AccountNFTCollectionProps> = ({
  inventory,
  isLoading,
  isFetched,
  isTotalCountClipped,
  pagination,
  scope,
  totalCount,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {isLoading && <Skeleton className="h-[200px]" />}
      {isFetched && !totalCount && <CardEmptyState label={t('tokens.emptyInventory')} />}
      {!!inventory?.length && (
        <>
          <ImageList>
            {inventory?.map(instance => {
              const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.contract_addr, instance.id)
              return (
                <ImageListItem
                  key={instance.id}
                  title={<NFTCollectionLink instance={instance} scope={scope} />}
                  subtitle={<NFTInstanceLink instance={instance} scope={scope} />}
                >
                  <ImageListItemImage instance={instance} to={to} />
                </ImageListItem>
              )
            })}
          </ImageList>
          {pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                {...pagination}
                totalCount={totalCount}
                isTotalCountClipped={isTotalCountClipped}
              />
            </Box>
          )}
        </>
      )}
    </>
  )
}
