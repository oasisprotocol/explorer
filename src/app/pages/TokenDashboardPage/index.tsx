import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import Divider from '@mui/material/Divider'
import { TokenTitleCard } from './TokenTitleCard'
import { TokenSnapshot } from './TokenSnapshot'
import { TokenDetailsCard } from './TokenDetailsCard'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useHref, useLoaderData, useOutletContext } from 'react-router-dom'
import { useTokenInfo } from './hook'
import { AppErrors } from '../../../types/errors'
import { RouterTabs } from '../../components/RouterTabs'
import { useTranslation } from 'react-i18next'
import { contractCodeContainerId } from '../AccountDetailsPage/ContractCodeCard'
import { tokenHoldersContainerId } from './TokenHoldersCard'
import { SearchScope } from '../../../types/searchScope'
import { tokenInventoryContainerId } from './TokenInventoryCard'
import { DappBanner } from '../../components/DappBanner'

export type TokenDashboardContext = {
  scope: SearchScope
  address: string
}

export const useTokenDashboardProps = () => useOutletContext<TokenDashboardContext>()

export const TokenDashboardPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string

  const { token, isError, errorCode } = useTokenInfo(scope, address)

  if (isError) {
    switch (errorCode) {
      case 'ERR_NETWORK':
        throw AppErrors.CannotLoadData
      case 'ERR_BAD_REQUEST':
        throw AppErrors.NotFoundTokenAddress
      default:
        // TODO: look for other error codes, too
        // (Currently we are not aware of anything else.)
        console.log('Error code is', errorCode)
        throw AppErrors.NotFoundTokenAddress
    }
  }

  const tokenTransfersLink = useHref(``)
  const tokenHoldersLink = useHref(`holders#${tokenHoldersContainerId}`)
  const codeLink = useHref(`code#${contractCodeContainerId}`)
  const inventoryLink = useHref(`inventory#${tokenInventoryContainerId}`)

  const context: TokenDashboardContext = {
    scope,
    address,
  }

  return (
    <PageLayout>
      <TokenTitleCard scope={scope} address={address} />
      <DappBanner scope={scope} ethAddress={token?.eth_contract_addr} />
      <TokenSnapshot scope={scope} address={address} />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <TokenDetailsCard scope={scope} address={address} />
      <RouterTabs
        tabs={[
          { label: t('tokens.transfers'), to: tokenTransfersLink },
          { label: t('tokens.holders'), to: tokenHoldersLink },
          { label: t('tokens.inventory'), to: inventoryLink },
          { label: t('contract.code'), to: codeLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}
