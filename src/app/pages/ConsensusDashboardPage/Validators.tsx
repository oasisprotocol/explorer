import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { Validators } from '../../components/Validators'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import { RouteUtils } from 'app/utils/route-utils'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const ValidatorsCard: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope

  const validatorsQuery = useGetConsensusValidators(network, { limit })
  const validators = validatorsQuery.data?.data

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={
          <CardHeaderWithCounter
            label={t('validator.listTitle')}
            totalCount={validators?.total_count}
            isTotalCountClipped={validators?.is_total_count_clipped}
          />
        }
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getValidatorsRoute(scope.network)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <Validators
          validators={validatorsQuery.data?.data.validators}
          isLoading={validatorsQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
