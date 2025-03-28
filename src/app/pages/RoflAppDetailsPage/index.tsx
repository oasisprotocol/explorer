import { FC } from 'react'
import { useHref, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import { Layer, RoflApp, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { RoflAppStatusBadge } from '../../components/Rofl/RoflAppStatusBadge'
import { RoflAppLink } from '../../components/Rofl/RoflAppLink'
import { RouterTabs } from '../../components/RouterTabs'
import { instancesContainerId } from '../../utils/tabAnchors'
import { RoflAppDetailsContext } from '../RoflAppDetailPage/hooks'

export const RoflAppDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const id = useParams().id!
  const txLink = useHref('')
  const instancesLink = useHref(`instances#${instancesContainerId}`)
  const [method, setMethod] = useTypedSearchParam('method', 'any', {
    deleteParams: ['page'],
  })
  const context: RoflAppDetailsContext = { scope, id, method, setMethod }
  const { isFetched, isLoading, data } = useGetRuntimeRoflAppsId(scope.network, Layer.sapphire, id)
  const roflApp = data?.data

  if (!roflApp && isFetched) {
    throw AppErrors.NotFoundRoflApp
  }

  return (
    <PageLayout>
      <SubPageCard
        featured
        title={
          isLoading ? <Skeleton variant="text" /> : roflApp?.metadata['net.oasis.rofl.name'] || roflApp?.id
        }
      >
        <RoflAppDetailsView detailsPage isLoading={isLoading} app={roflApp} />
      </SubPageCard>
      <Grid container spacing={4}>
        <StyledGrid item xs={12} md={6}>
          {/* TODO: uncomment when other PRs are merged */}
          {/* <MetaDataCard isFetched={isFetched} metadata={roflApp?.metadata} /> */}
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          {/* TODO: uncomment when other PRs are merged */}
          {/* <PolicyCard isFetched={isFetched} policy={roflApp?.policy} /> */}
        </StyledGrid>
      </Grid>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          {
            label: t('rofl.instances'),
            to: instancesLink,
          },
        ]}
        context={context}
      />
    </PageLayout>
  )
}

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
      <dt>{t('rofl.lastActvity')}</dt>
      <dd>{t('common.missing')}</dd>
    </StyledDescriptionList>
  )
}
