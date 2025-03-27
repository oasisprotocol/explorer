import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { RoflApp } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { RoflAppStatusBadge } from '../../components/Rofl/RoflAppStatusBadge'
import { RoflAppLink } from '../..//components/Rofl/RoflAppLink'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}))

export const RoflAppDetailsView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  detailsPage?: boolean
}> = ({ app, detailsPage, isLoading }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 15 : 10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={!detailsPage}>
      <dt>{t('common.name')}</dt>
      <dd>{app.metadata?.name || t('rofl.nameNotProvided')}</dd>
      <dt>{t('common.status')}</dt>
      <dd>
        <RoflAppStatusBadge hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      </dd>
      <dt>{t('rofl.appId')}</dt>
      <dd>
        <RoflAppLink id={app.id} network={app.network} withSourceIndicator={false} />
      </dd>
      <dt>{t('rofl.created')}</dt>
      <dd>
        {t('common.formattedDateTime', {
          value: app.date_created,
          formatParams: {
            timestamp: {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            } satisfies Intl.DateTimeFormatOptions,
          },
        })}
      </dd>
      <dt>{t('rofl.lastActivity')}</dt>
      <dd>{t('common.missing')}</dd>
    </StyledDescriptionList>
  )
}
