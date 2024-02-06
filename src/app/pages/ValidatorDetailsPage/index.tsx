import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { Validator, useGetConsensusValidatorsEntityId } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { StatusIcon } from '../../components/StatusIcon'
import { ValidatorImage } from '../../components/Validators/ValidatorImage'
import { ValidatorCommission } from '../../components/Validators/ValidatorCommission'
import { ValidatorCumulativeVoting } from '../../components/Validators/ValidatorCumulativeVoting'
import { ValidatorTitleCard } from './ValidatorTitleCard'
import { useRequiredScopeParam } from 'app/hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import { AddressLoaderData } from 'app/utils/route-utils'
import { ValidatorSnapshot } from './ValidatorSnapshot'

export const ValidatorDetailsPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  // TODO: currently API does not work with address query param. Wait for API update or switch to entity_id
  const { address } = useLoaderData() as AddressLoaderData
  const validatorQuery = useGetConsensusValidatorsEntityId(scope.network, address)
  const { isLoading, data } = validatorQuery
  const validator = data?.data

  return (
    <PageLayout>
      <ValidatorTitleCard isLoading={isLoading} network={scope.network} validator={validator} />
      <ValidatorSnapshot scope={scope} validator={validator} />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
    </PageLayout>
  )
}

export const ValidatorDetailsView: FC<{
  isLoading?: boolean
  validator: Validator | undefined
  standalone?: boolean
}> = ({ isLoading, validator, standalone = false }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!validator) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
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
    </StyledDescriptionList>
  )
}
