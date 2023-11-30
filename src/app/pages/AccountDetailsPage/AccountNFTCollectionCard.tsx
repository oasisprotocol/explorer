import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link as RouterLink } from 'react-router-dom'
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
import { AppErrors } from 'types/errors'
import { RouteUtils } from 'app/utils/route-utils'
import { COLORS } from 'styles/theme/colors'

export const accountTokenContainerId = 'nftCollection'

export const AccountNFTCollectionCard: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { contractAddress } = useParams()

  if (!contractAddress) {
    throw AppErrors.InvalidAddress
  }

  return (
    <Card>
      <LinkableDiv id={accountTokenTransfersContainerId}>
        <CardHeader
          action={
            <Box sx={{ display: 'flex', alignItems: 'flex-start', paddingY: 3 }}>
              <AccountLink scope={scope} address={contractAddress} />
              <CopyToClipboard value={contractAddress} />
            </Box>
          }
          disableTypography
          title={
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography fontSize={24}>
                <Link
                  component={RouterLink}
                  to={RouteUtils.getAccountTokensRoute(scope, address, 'ERC721', contractAddress)}
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
          <AccountNFTCollection scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const AccountNFTCollection: FC<AccountDetailsContext> = ({ scope, address }) => {
  return <>sub view</>
}
