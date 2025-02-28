import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflApp, Runtime, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useScreenSize } from '../../hooks/useScreensize'
import { AppErrors } from '../../../types/errors'
import { TextSkeleton } from '../../components/Skeleton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { useParams } from 'react-router-dom'

export const RoflAppDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const id = useParams().id!
  const { isLoading, data } = useGetRuntimeRoflAppsId(scope.network, scope.layer as Runtime, id)
  const roflApp = data?.data

  if (!roflApp && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      <SubPageCard featured title={t('rofl.header')}>
        <RoflAppDetailView detailsPage isLoading={isLoading} app={roflApp} />
      </SubPageCard>
    </PageLayout>
  )
}

export const RoflAppDetailView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  detailsPage?: boolean
  showLayer?: boolean
}> = ({ app, detailsPage, isLoading, showLayer }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 15 : 10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={!detailsPage}>
      {showLayer && (
        <>
          <dt>{t('common.paratime')}</dt>
          <dd>
            <DashboardLink scope={app} />
          </dd>
        </>
      )}
      <dt>TODO</dt>
      <dd>TODO</dd>

      {detailsPage && (
        <>
          <dt>TODO</dt>
          <dd>TODO</dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
