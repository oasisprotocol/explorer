import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import { DashboardDivider } from '../../components/Divider'
import { TokenTitleCard } from './TokenTitleCard'
import { TokenSnapshot } from './TokenSnapshot'
import { TokenDetailsCard } from './TokenDetailsCard'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useHref, useLoaderData } from 'react-router-dom'
import { useTokenInfo } from './hooks'
import { AppErrors } from '../../../types/errors'
import { RouterTabs } from '../../components/RouterTabs'
import { useTranslation } from 'react-i18next'
import { DappBanner } from '../../components/DappBanner'
import { AddressLoaderData } from '../../utils/route-utils'
import { codeContainerId, holdersContainerId, inventoryContainerId } from '../../utils/tabAnchors'
import { TokenDashboardContext } from './types'

export const TokenDashboardPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()
  const { address } = useLoaderData() as AddressLoaderData
  const { isError } = useTokenInfo(scope, address)

  if (isError) {
    throw AppErrors.InvalidAddress
  }

  const tokenTransfersLink = useHref(``)
  const tokenHoldersLink = useHref(`holders#${holdersContainerId}`)
  const codeLink = useHref(`code#${codeContainerId}`)
  const inventoryLink = useHref(`inventory#${inventoryContainerId}`)

  const context: TokenDashboardContext = {
    scope,
    address,
  }

  return (
    <PageLayout>
      <TokenTitleCard scope={scope} address={address} />
      <DappBanner scope={scope} ethOrOasisAddress={address} />
      <TokenSnapshot scope={scope} address={address} />
      <DashboardDivider />
      <TokenDetailsCard scope={scope} address={address} />
      <RouterTabs
        tabs={[
          { label: t('common.transfers'), to: tokenTransfersLink },
          { label: t('tokens.holders'), to: tokenHoldersLink },
          { label: t('tokens.inventory'), to: inventoryLink },
          { label: t('contract.code'), to: codeLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}
