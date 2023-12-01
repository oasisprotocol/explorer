import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, Link as RouterLink, To } from 'react-router-dom'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Skeleton from '@mui/material/Skeleton'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { AccountDetailsContext } from './index'
import { accountTokenTransfersContainerId } from './AccountTokenTransfersCard'
import { AccountLink } from 'app/components/Account/AccountLink'
import { CopyToClipboard } from 'app/components/CopyToClipboard'
import { RouteUtils } from 'app/utils/route-utils'
import { COLORS } from 'styles/theme/colors'
import { ImageListItemImage } from '../TokenDashboardPage/ImageListItemImage'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { TablePagination } from '../../components/Table/TablePagination'
import { useAccountTokenInventory } from '../TokenDashboardPage/hook'
import { EvmNft } from 'oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'

export const accountTokenContainerId = 'nftCollection'

export const AccountNFTCollectionCard: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { ethContractAddress, oasisContractAddress } = useLoaderData() as {
    ethContractAddress: string
    oasisContractAddress: string
  }
  const { inventory, isFetched, isLoading, isTotalCountClipped, pagination, totalCount } =
    useAccountTokenInventory(scope, address, oasisContractAddress)

  return (
    <Card>
      <LinkableDiv id={accountTokenTransfersContainerId}>
        <CardHeader
          action={
            <Box sx={{ display: 'flex', alignItems: 'flex-start', paddingY: 3 }}>
              <AccountLink scope={scope} address={ethContractAddress} />
              <CopyToClipboard value={ethContractAddress} />
            </Box>
          }
          disableTypography
          title={
            <Box sx={{ display: 'flex' }} gap={4}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Typography fontSize={24}>
                  <Link
                    component={RouterLink}
                    to={RouteUtils.getAccountTokensRoute(scope, address, 'ERC721', ethContractAddress)}
                  >
                    {t('nft.accountCollection')}
                  </Link>
                </Typography>
                {isFetched && (
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={2}>
                    <Typography color={COLORS.brandExtraDark} fontSize={24}>
                      {inventory?.[0].token.name ? inventory?.[0].token.name : t('common.collection')}
                    </Typography>
                    {totalCount && (
                      <Typography>({`${isTotalCountClipped ? ' > ' : ''}${totalCount}`})</Typography>
                    )}
                  </Box>
                )}
              </Breadcrumbs>
              {isLoading && <Skeleton variant="text" sx={{ width: '50%' }} />}
            </Box>
          }
        />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <AccountNFTCollection
            inventory={inventory}
            isFetched={isFetched}
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
  isFetched,
  isTotalCountClipped,
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
              const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.contract_addr, instance.id)
              return (
                <ImageListItem key={instance.id}>
                  <ImageListItemImage instance={instance} to={to} />
                  <ImageListItemBar title={'TODO'} subtitle={'TODO'} position="below" />
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
