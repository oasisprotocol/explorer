import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { Layer, useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as limit } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { RouteUtils } from '../../utils/route-utils'
import { RoflAppsList } from '../../components/Rofl/RoflAppsList'

export const LatestRoflApps: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network, layer } = scope
  if (layer !== Layer.sapphire) {
    throw AppErrors.UnsupportedLayer
  }
  const roflAppsQuery = useGetRuntimeRoflApps(network, layer, { limit })
  const { isLoading, data } = roflAppsQuery
  const roflApps = data?.data.rofl_apps

  if (!roflApps?.length) {
    return null
  }

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('rofl.listTitle')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getRoflAppsRoute(scope.network)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <RoflAppsList apps={roflApps} isLoading={isLoading} limit={limit} pagination={false} />
      </CardContent>
    </Card>
  )
}
