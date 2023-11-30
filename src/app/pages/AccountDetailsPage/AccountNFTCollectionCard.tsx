import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { AccountDetailsContext } from './index'
import { accountTokenTransfersContainerId } from './AccountTokenTransfersCard'

export const accountTokenContainerId = 'nftCollection'

export const AccountNFTCollectionCard: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  return (
    <Card>
      <LinkableDiv id={accountTokenTransfersContainerId}>
        <CardHeader disableTypography component="h3" title={t('nft.accountCollection')} />
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
