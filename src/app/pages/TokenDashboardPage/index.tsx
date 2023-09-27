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

  const { isError } = useTokenInfo(scope, address)

  if (isError) {
    throw AppErrors.InvalidAddress
  }

  const tokenTransfersLink = useHref(``)
  const tokenHoldersLink = useHref(`holders#${tokenHoldersContainerId}`)
  const codeLink = useHref(`code#${contractCodeContainerId}`)
  const inventoryLink = useHref(`inventory#${contractCodeContainerId}`)

  const context: TokenDashboardContext = {
    scope,
    address,
  }

  return (
    <PageLayout>
      <TokenTitleCard scope={scope} address={address} />
      <TokenSnapshot scope={scope} address={address} />
      {!isMobile && <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />}
      <TokenDetailsCard scope={scope} address={address} />
      <RouterTabs
        tabs={[
          { label: t('tokens.transfers'), to: tokenTransfersLink },
          { label: t('tokens.holders'), to: tokenHoldersLink },
          { label: t('common.inventory'), to: inventoryLink },
          { label: t('contract.code'), to: codeLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}
