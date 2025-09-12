import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetRuntimeEvmTokens } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import { TokenList } from '../../components/Tokens/TokenList'
import { RuntimeScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const TopTokensContent: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { network, layer } = scope
  const tokensQuery = useGetRuntimeEvmTokens(network, layer, { limit })

  return (
    <TokenList
      tokens={tokensQuery.data?.data.evm_tokens}
      isLoading={tokensQuery.isLoading}
      limit={limit}
      pagination={false}
    />
  )
}

export const TopTokens: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <Typography variant="h3">{t('common.tokens')}</Typography>
        <Link asChild className="font-medium" textColor="primary">
          <RouterLink to={RouteUtils.getTopTokensRoute(scope)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>
      <CardContent>
        <ErrorBoundary light>
          <TopTokensContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
