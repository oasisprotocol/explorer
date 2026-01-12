import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { ExternalLink } from 'lucide-react'
import { RoflAppMetadata } from '../../../oasis-nexus/api'
import { EmptyStateCard } from './EmptyStateCard'
import { GridRow } from './GridRow'
import { isDiscordHandle, isTwitterHandle, isUrlSafe } from '../../utils/url'
import { Email } from './Email'
import { XProfileWidget } from '../../components/XProfileWidget'
import { DiscordProfileWidget } from '../../components/DiscordProfileWidget'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type MetaDataCardProps = {
  isFetched: boolean
  metadata: RoflAppMetadata | undefined
}

// Nexus is not parsing ROFL app metadata, but we can expect props with net.oasis.rofl prefix
// and object to be similar to this:
// https://github.com/oasisprotocol/cli/blob/bb1a57c13ce7bed635e5ce4306cba8ec33c9a651/build/rofl/manifest.go#L185

export const MetaDataCard: FC<MetaDataCardProps> = ({ isFetched, metadata }) => {
  const { t } = useTranslation()
  const email = metadata?.['net.oasis.rofl.author']
  const homepage = metadata?.['net.oasis.rofl.homepage']

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-3 mb-4 gap-2">
            <Typography variant="h3" className="col-span-1">
              {t('rofl.metadata')}
            </Typography>
            <Typography variant="xsmall" className="col-span-2 flex items-center" textColor="muted">
              {t('rofl.metadataInfo')}
            </Typography>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isFetched && !metadata && <EmptyStateCard />}
        {metadata && (
          <div className="grid grid-cols-3">
            <GridRow label={t('rofl.roflName')}>{metadata['net.oasis.rofl.name']}</GridRow>

            <GridRow label={t('rofl.description')}>{metadata['net.oasis.rofl.description']}</GridRow>

            <GridRow label={t('rofl.author')}>{email ? <Email email={email} /> : undefined}</GridRow>

            <GridRow label={t('rofl.license')}>{metadata['net.oasis.rofl.license']}</GridRow>

            <GridRow label={t('rofl.homePage')}>
              {!homepage ? undefined : (
                <>
                  {isUrlSafe(homepage) && (
                    <Link
                      className="inline-flex items-end break-all gap-1"
                      href={homepage}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {homepage} <ExternalLink size={18} />
                    </Link>
                  )}
                  {isTwitterHandle(homepage) && <XProfileWidget handle={homepage} />}
                  {isDiscordHandle(homepage) && <DiscordProfileWidget handle={homepage} />}
                </>
              )}
            </GridRow>

            <GridRow
              label={t('rofl.repositoryUrl')}
              tooltip={
                <Trans
                  i18nKey="rofl.verifyCommand"
                  t={t}
                  components={{
                    Command: <span className="font-mono">oasis rofl build --verify</span>,
                  }}
                />
              }
            >
              {isUrlSafe(metadata['net.oasis.rofl.repository']) ? (
                <Link
                  className="inline-flex items-end break-all gap-1"
                  href={metadata['net.oasis.rofl.repository']}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {metadata['net.oasis.rofl.repository']} <ExternalLink size={18} />
                </Link>
              ) : undefined}
            </GridRow>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
