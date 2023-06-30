import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import Divider from '@mui/material/Divider'
import { TokenTitleCard } from './TokenTitleCard'
import { TokenSnapshot } from './TokenSnapshot'
import { TokenDetailsCard } from './TokenDetailsCard'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useHref, useLoaderData } from 'react-router-dom'
import { useTokenInfo } from './hook'
import { AppErrors } from '../../../types/errors'
import { RouterTabs } from '../../components/RouterTabs'
import { useTranslation } from 'react-i18next'
import { contractCodeContainerId } from '../AccountDetailsPage/ContractCodeCard'
import { tokenHoldersContainerId } from './TokenHoldersCard'

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

  return (
    <PageLayout>
      <TokenTitleCard />
      <TokenSnapshot />
      {!isMobile && <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />}
      <TokenDetailsCard />
      <RouterTabs
        tabs={[
          { label: t('tokens.transfers'), to: tokenTransfersLink },
          { label: t('tokens.holders'), to: tokenHoldersLink },
          { label: t('contract.code'), to: codeLink },
        ]}
      />
    </PageLayout>
  )
}
