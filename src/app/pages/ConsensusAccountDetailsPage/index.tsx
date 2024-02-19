import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import { Account, useGetConsensusAccountsAddress } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { AccountSizeBadge } from '../../components/AccountSizeBadge'
import { AccountLink } from '../../components/Account/AccountLink'
import { RoundedBalance } from '../..//components/RoundedBalance'
import { AddressLoaderData } from '../../utils/route-utils'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { ConsensusAccountDetailsCard } from './ConsensusAccountDetailsCard'

export const ConsensusAccountDetailsPage: FC = () => {
  const scope = useRequiredScopeParam()
  const { network } = scope
  const { address } = useLoaderData() as AddressLoaderData
  const accountQuery = useGetConsensusAccountsAddress(network, address)
  const { isError, isLoading, data } = accountQuery
  const account = data?.data

  return (
    <PageLayout>
      <ConsensusAccountDetailsCard account={account} isError={isError} isLoading={isLoading} />
    </PageLayout>
  )
}

export const ConsensusAccountDetailsView: FC<{
  isLoading?: boolean
  account: Account | undefined
  standalone?: boolean
}> = ({ account, isLoading, standalone = false }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!account) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
      {/* TODO: provide missing props when API is ready */}
      <dt>{t('common.size')}</dt>
      <dd>
        <AccountSizeBadge size={account.size} />
      </dd>
      <dt>{t('common.address')}</dt>
      <dd>
        <AccountLink scope={account} address={account.address} />,
      </dd>
      <dt>{t('account.birth')}</dt>
      <dd>
        <>-</>
      </dd>
      <dt>{t('account.available')}</dt>
      <dd>
        <RoundedBalance value={account.available} ticker={account.ticker} />
      </dd>
      <dt>{t('account.staked')}</dt>
      <dd>
        <>-</>
      </dd>
      <dt>{t('account.debonding')}</dt>
      <dd>
        <>-</>
      </dd>
      <dt>
        <strong>{t('account.totalBalance')}</strong>
      </dt>
      <dd>
        <strong>
          <RoundedBalance value={account.total} ticker={account.ticker} />
        </strong>
      </dd>
    </StyledDescriptionList>
  )
}