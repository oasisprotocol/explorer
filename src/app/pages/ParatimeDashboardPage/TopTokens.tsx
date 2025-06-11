import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetRuntimeEvmTokens } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
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
      <CardHeader
        disableTypography
        component="h3"
        title={t('common.tokens')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getTopTokensRoute(scope)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <ErrorBoundary light>
          <TopTokensContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
