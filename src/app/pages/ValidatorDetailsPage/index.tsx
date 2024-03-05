import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { Validator, useGetConsensusValidatorsEntityId } from '../../../oasis-nexus/api'
import { RouterTabs } from '../../components/RouterTabs'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { StatusIcon } from '../../components/StatusIcon'
import { ValidatorImage } from '../../components/Validators/ValidatorImage'
import { ValidatorCommission } from '../../components/Validators/ValidatorCommission'
import { ValidatorCumulativeVoting } from '../../components/Validators/ValidatorCumulativeVoting'
import { ValidatorTitleCard } from './ValidatorTitleCard'
import { useRequiredScopeParam } from 'app/hooks/useScopeParam'
import { AddressLoaderData } from 'app/utils/route-utils'
import { ValidatorSnapshot } from './ValidatorSnapshot'
import { ValidatorDetailsContext } from './hooks'

export const ValidatorDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  // TODO: currently API does not work with address query param. Wait for API update or switch to entity_id
  const { address } = useLoaderData() as AddressLoaderData
  const validatorQuery = useGetConsensusValidatorsEntityId(scope.network, address)
  const { isLoading, data } = validatorQuery
  const validator = data?.data
  const transactionsLink = useHref('')
  const context: ValidatorDetailsContext = { scope, address }

  return (
    <PageLayout>
      <ValidatorTitleCard isLoading={isLoading} network={scope.network} validator={validator} />
      <ValidatorSnapshot scope={scope} validator={validator} />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <ValidatorDetailsCard isLoading={isLoading} validator={validator} />
      <RouterTabs tabs={[{ label: t('common.transactions'), to: transactionsLink }]} context={context} />
    </PageLayout>
  )
}

type ValidatorDetailsCardProps = {
  isLoading: boolean
  validator: Validator | undefined
}

const ValidatorDetailsCard: FC<ValidatorDetailsCardProps> = ({ isLoading, validator }) => {
  return (
    <Card>
      <CardContent>
        <ValidatorDetailsView detailsPage isLoading={isLoading} validator={validator} />
      </CardContent>
    </Card>
  )
}

export const ValidatorDetailsView: FC<{
  detailsPage?: boolean
  isLoading?: boolean
  validator: Validator | undefined
  standalone?: boolean
}> = ({ detailsPage, isLoading, validator, standalone = false }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!validator) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
      {detailsPage && (
        <>
          {/* TODO: provide missing props when API is ready */}
          <dt>
            <ValidatorImage
              address={validator.entity_address}
              name={validator.media?.name}
              logotype={validator.media?.logotype}
            />
          </dt>
          <dd>{validator.media?.name}</dd>
          <dt>{t('common.rank')}</dt>
          <dd>-</dd>
          <dt>{t('common.address')}</dt>
          <dd>{validator.entity_address}</dd>
          <dt>{t('validator.delegators')}</dt>
          <dd>-</dd>
          <dt>{t('common.status')}</dt>
          <dd>-</dd>
          <dt>{t('validator.startDate')}</dt>
          <dd>-</dd>
          <dt>{t('validator.votingPower')}</dt>
          <dd>-</dd>
          <dt>{t('validator.totalShare')}</dt>
          <dd>-</dd>
          <dt>{t('validator.participationRate')}</dt>
          <dd>-</dd>
          <dt>{t('validator.commissionRates')}</dt>
          <dd>
            <ValidatorCommission commission={validator.current_rate} />
          </dd>
          <dt>{t('validator.commissionBounds')}</dt>
          <dd>
            {/* TODO: check with backend how no bounds is represented */}
            {validator.current_commission_bound && validator.current_commission_bound.epoch_start ? (
              <>
                <ValidatorCommission commission={validator.current_commission_bound.lower} />~
                <ValidatorCommission commission={validator.current_commission_bound.upper} />
              </>
            ) : (
              <span>{t('validator.boundsNotSet')}</span>
            )}
          </dd>
          <dt>{t('validator.entityId')}</dt>
          <dd>{validator.entity_id}</dd>
          <dt>{t('validator.nodeId')}</dt>
          <dd>{validator.node_id}</dd>
        </>
      )}
      {!detailsPage && (
        <>
          {/* TODO: provide missing props when API is ready */}
          <dt>{t('common.rank')}</dt>
          <dd>-</dd>
          <dt>{t('validator.title')}</dt>
          <dd>
            <ValidatorImage
              address={validator.entity_address}
              name={validator.media?.name}
              logotype={validator.media?.logotype}
            />
          </dd>
          <dt>{t('validator.cumulativeVoting')}</dt>
          <dd>
            <ValidatorCumulativeVoting containerMarginThemeSpacing={4} value={0} />
          </dd>
          <dt>{t('validator.voting')}</dt>
          <dd>-</dd>
          <dt>{t('validator.staked')}</dt>
          <dd>-</dd>
          <dt>{t('validator.change')}</dt>
          <dd>-</dd>
          <dt>{t('validator.delegators')}</dt>
          <dd>-</dd>
          <dt>{t('validator.commission')}</dt>
          <dd>
            <ValidatorCommission commission={validator.current_rate} />
          </dd>
          <dt>{t('common.status')}</dt>
          <dd>
            <StatusIcon success={validator.status} error={undefined} />
          </dd>
          <dt>{t('validator.uptime')}</dt>
          <dd>-</dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
