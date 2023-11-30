import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { AccountDetailsContext } from './index'
import { accountTokenTransfersContainerId } from './AccountTokenTransfersCard'
import { AccountLink } from 'app/components/Account/AccountLink'
import { CopyToClipboard } from 'app/components/CopyToClipboard'
import { RouteUtils } from 'app/utils/route-utils'
import { COLORS } from 'styles/theme/colors'
import { ImageListItemImage } from '../TokenDashboardPage/ImageListItemImage'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { TablePagination } from '../../components/Table/TablePagination'
import { useAccountTokenInventory } from '../TokenDashboardPage/hook'

export const accountTokenContainerId = 'nftCollection'

export const AccountNFTCollectionCard: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { ethContractAddress, oasisContractAddress } = useLoaderData() as {
    ethContractAddress: string
    oasisContractAddress: string
  }

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
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography fontSize={24}>
                <Link
                  component={RouterLink}
                  to={RouteUtils.getAccountTokensRoute(scope, address, 'ERC721', ethContractAddress)}
                >
                  {t('nft.accountCollection')}
                </Link>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={2}>
                <Typography color={COLORS.brandExtraDark} fontSize={24}>
                  {t('common.collection')}
                </Typography>
                <Typography>(3)</Typography>
              </Box>
            </Breadcrumbs>
          }
        />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <AccountNFTCollection scope={scope} address={address} tokenAddress={oasisContractAddress} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

type AccountNFTCollectionProps = {
  tokenAddress: string
} & AccountDetailsContext

const AccountNFTCollection: FC<AccountNFTCollectionProps> = ({ address, scope, tokenAddress }) => {
  const { t } = useTranslation()
  const { inventory, isFetched, pagination, totalCount } = useAccountTokenInventory(
    scope,
    address,
    tokenAddress,
  )

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
              <TablePagination {...pagination} totalCount={totalCount} />
            </Box>
          )}
        </>
      )}
    </>
  )
}
