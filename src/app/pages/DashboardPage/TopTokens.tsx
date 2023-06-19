import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Layer, useGetRuntimeEvmTokens } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { RouteUtils } from '../../utils/route-utils'
import { TokenList } from '../../components/Tokens/TokenList'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const TopTokens: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet supported.
    // We should use useGetConsensusTransactions()
  }
  const tokensQuery = useGetRuntimeEvmTokens(network, layer, { limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('tokens.title')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getTopTokensRoute(scope)}
            sx={{ color: COLORS.brandExtraDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <TokenList
          tokens={tokensQuery.data?.data.evm_tokens}
          isLoading={tokensQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
