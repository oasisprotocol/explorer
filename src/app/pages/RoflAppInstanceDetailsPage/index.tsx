import { FC } from 'react'
import { useHref, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RoflInstance, useGetRuntimeRoflAppsIdInstancesRak } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { AppErrors } from '../../../types/errors'
import { RoflAppInstanceDetailsContext } from './hooks'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { getOasisAddressFromBase64PublicKey } from '../../utils/helpers'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { RouterTabs } from '../../components/RouterTabs'
import { RoflAppLink } from '../../components/Rofl/RoflAppLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { AccountLink } from '../../components/Account/AccountLink'
import { SimpleJsonCode } from 'app/components/CodeDisplay/SimpleJsonCode'

export const RoflAppInstanceDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()
  const id = useParams().id!
  const rak = useParams().rak!
  const txLink = useHref('')
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()
  const context: RoflAppInstanceDetailsContext = { scope, id, rak, txMethod, setTxMethod }
  const instancesQuery = useGetRuntimeRoflAppsIdInstancesRak(scope.network, scope.layer, id, rak)
  const { isLoading, isFetched, data } = instancesQuery
  const instance = data?.data

  if (!instance && isFetched) {
    throw AppErrors.NotFoundRoflAppInstance
  }

  return (
    <PageLayout>
      <SubPageCard featured title={t('rofl.replicaDetails')}>
        <RoflAppInstanceDetailsView isLoading={isLoading} appId={id} instance={instance} scope={scope} />
      </SubPageCard>
      <RouterTabs tabs={[{ label: t('common.transactions'), to: txLink }]} context={context} />
    </PageLayout>
  )
}

export const RoflAppInstanceDetailsView: FC<{
  isLoading?: boolean
  appId: string
  instance: RoflInstance | undefined
  scope: SearchScope
}> = ({ appId, instance, isLoading, scope }) => {
  const { t } = useTranslation()

  if (isLoading) return <TextSkeleton numberOfRows={6} />
  if (!instance) return <></>
  const nodeAddress = getOasisAddressFromBase64PublicKey(instance.endorsing_node_id)

  return (
    <StyledDescriptionList>
      <dt>{t('rofl.rakAbbreviation')}</dt>
      <dd>
        <span>
          {instance.rak} <CopyToClipboard value={instance.rak} />
        </span>
      </dd>
      <dt>{t('rofl.rekAbbreviation')}</dt>
      <dd>
        <span>
          {instance.rek} <CopyToClipboard value={instance.rek} />
        </span>
      </dd>
      <dt>{t('rofl.expirationEpoch')}</dt>
      <dd>{instance.expiration_epoch.toLocaleString()}</dd>
      <dt>{t('rofl.roflAppId')}</dt>
      <dd>
        <RoflAppLink id={appId} network={scope.network} withSourceIndicator={false} />
        <CopyToClipboard value={appId} />
      </dd>
      <dt>{t('rofl.endorsingNodeId')}</dt>
      <dd>
        <span>
          {instance.endorsing_node_id} <CopyToClipboard value={instance.endorsing_node_id} />
        </span>
      </dd>
      <dt>{t('rofl.endorsingNodeAddress')}</dt>
      <dd>
        <span>
          <AccountLink alwaysTrimOnTablet scope={scope} address={nodeAddress} />
          <CopyToClipboard value={nodeAddress} />
        </span>
      </dd>
      <dt>{t('rofl.extraKeys')}</dt>
      <dd>
        {instance.extra_keys.length ? (
          <table>
            <tbody>
              {instance.extra_keys.map((key, index) => {
                const entries = Object.entries(JSON.parse(key))
                const [keyType, keyValue] = entries[0]

                return (
                  <tr key={index}>
                    <td>
                      <span>{keyType}:</span>
                    </td>
                    <td>
                      <span>{String(keyValue)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          t('common.missing')
        )}
      </dd>
      {instance.metadata && Object.keys(instance.metadata).length > 0 && (
        <>
          <dt>{t('rofl.metadata')}</dt>
          <dd>
            <SimpleJsonCode className="h-[250px]" data={instance.metadata} />
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
