import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { useTokenInventory } from './hook'
import { TokenDashboardContext } from './index'
import { NFTInstanceThumbnail } from '../../components/NFTInstance/thumbnail'

export const tokenInventoryContainerId = 'inventory'

export const TokenInventoryCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={tokenInventoryContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.inventory')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <TokenInventoryView scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const TokenInventoryView: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isFetched, totalCount, inventory } = useTokenInventory(scope, address)

  console.log(
    'Inventory is',
    // (inventory || []).map(instance => `${instance.id}-${instance.name}`),
    (inventory || []).map(instance => instance.name),
  )

  return (
    <>
      {isFetched && !totalCount && <CardEmptyState label={t('tokens.emptyInventory')} />}
      <div>
        {(inventory || []).map(instance => (
          <NFTInstanceThumbnail
            key={`${instance.contract_addr}.${instance.id}`}
            scope={scope}
            instance={instance}
          />
        ))}
      </div>
    </>
  )
}
