import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, Link as RouterLink, To } from 'react-router-dom'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
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
    <Card variant="layout">
      <LinkableDiv id={nftCollectionContainerId}>
        <div className="flex items-center p-4" role="heading" aria-level={3}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Typography variant="h3" className="text-lg font-medium">
                      <Link asChild className="hover:underline">
                        <RouterLink
                          preventScrollReset
                          to={RouteUtils.getAccountTokensRoute(scope, address, 'ERC721', '')}
                        >
                          {t('nft.accountCollection')}
                        </RouterLink>
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
            </div>
          </div>

          {isFetched && firstToken ? (
            <div className="flex items-start gap-2 py-6 self-start">
              <AccountLink scope={scope} address={firstToken.eth_contract_addr} alwaysTrim />
              <CopyToClipboard value={firstToken.eth_contract_addr} />
            </div>
          ) : null}
        </div>
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
            <div className="flex justify-center">
              <TablePagination
                {...pagination}
                totalCount={totalCount}
                isTotalCountClipped={isTotalCountClipped}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}
