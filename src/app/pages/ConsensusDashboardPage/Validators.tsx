import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { Link as RouterLink } from 'react-router-dom'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { Validators } from '../../components/Validators'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { ConsensusScope } from '../../../types/searchScope'
import { RouteUtils } from 'app/utils/route-utils'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const ValidatorsTitle: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope

  const validatorsQuery = useGetConsensusValidators(network, { limit })
  const validators = validatorsQuery.data?.data

  return (
    <CardHeaderWithCounter
      label={t('validator.listTitle')}
      totalCount={validators?.total_count}
      isTotalCountClipped={validators?.is_total_count_clipped}
    />
  )
}

const ValidatorsContent: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { network } = scope
  const validatorsQuery = useGetConsensusValidators(network, { limit })

  return (
    <Validators
      validators={validatorsQuery.data?.data.validators}
      stats={validatorsQuery.data?.data.stats}
      isLoading={validatorsQuery.isLoading}
      limit={limit}
      pagination={false}
    />
  )
}

export const ValidatorsCard: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <ErrorBoundary fallbackContent={t('validator.listTitle')}>
            <Typography variant="h3">
              <ValidatorsTitle scope={scope} />
            </Typography>
          </ErrorBoundary>

          <Link asChild textColor="primary" className="font-medium px-4">
            <RouterLink to={RouteUtils.getValidatorsRoute(scope.network)}>{t('common.viewAll')}</RouterLink>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light={true}>
          <ValidatorsContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
