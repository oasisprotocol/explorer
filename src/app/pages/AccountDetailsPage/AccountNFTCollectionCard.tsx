import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { EvmTokenType } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { AccountLink } from '../../components/Account/AccountLink'
import { getTokenTypeCollectionTitle } from '../../../types/tokens'
import { AccountDetailsContext } from './index'
import { isValidEthAddress } from '../../utils/helpers'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { RouteUtils } from '../../utils/route-utils'

type AccountNFTCollectionCardProps = AccountDetailsContext & {
  type: EvmTokenType
}

export const accountTokenContainerId = 'tokens'

const AccountNFTCollectionView: FC<AccountNFTCollectionCardProps & { contractAddress: string }> = props => {
  const { scope, address: accountAddress, type, contractAddress } = props

  const { t } = useTranslation()
  if (!isValidEthAddress(contractAddress!)) {
    throw AppErrors.InvalidAddress
  }

  const backToListPath = RouteUtils.getAccountTokensRoute(scope, accountAddress, type, contractAddress)
  const backToListText = getTokenTypeCollectionTitle(t, type)

  const collectionName = 'Whatever' // TODO: load this data
  const collectionBalance = 42 // TODO: load this data

  return (
    <LinkableDiv id={accountTokenContainerId}>
      <CardHeader
        disableTypography
        component="h3"
        title={
          <span>
            <Link
              component={RouterLink}
              to={backToListPath}
              // sx={{ color: COLORS.brandDark }}
            >
              {backToListText}
            </Link>
            &nbsp;
            {'>'}
            &nbsp;
            {collectionName}
            &nbsp; ({collectionBalance})
          </span>
        }
        action={
          <span>
            <AccountLink scope={scope} address={contractAddress} />
            <CopyToClipboard value={contractAddress} />
          </span>
        }
      />
      <CardContent>Under construction</CardContent>
    </LinkableDiv>
  )
}

// TODO: implement gallery view

export const AccountNFTCollectionCard: FC<AccountNFTCollectionCardProps> = props => {
  const { contractAddress } = useParams()

  return (
    <Card>
      <ErrorBoundary light={true}>
        <AccountNFTCollectionView {...props} contractAddress={contractAddress!} />
      </ErrorBoundary>
    </Card>
  )
}
