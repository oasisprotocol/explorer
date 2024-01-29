import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { Validator } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { StatusIcon } from '../../components/StatusIcon'
import { ValidatorImage } from '../../components/Validators/ValidatorImage'
import { ValidatorCommission } from '../../components/Validators/ValidatorCommission'
import { ValidatorCumulativeVoting } from '../../components/Validators/ValidatorCumulativeVoting'

export const ValidatorDetailsPage: FC = () => {
  return <PageLayout>{/* TODO: Implement validator details cards */}</PageLayout>
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
