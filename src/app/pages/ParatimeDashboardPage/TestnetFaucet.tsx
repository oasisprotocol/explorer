import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCardExternalLink } from '../../components/Snapshots/SnapshotCardExternalLink'
import { faucet } from '../../utils/externalLinks'
import { Layer } from '../../../oasis-nexus/api'

type TestnetFaucetProps = {
  layer: Layer
}

export const TestnetFaucet: FC<TestnetFaucetProps> = ({ layer }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('testnetFaucet.description')}
      label={t('testnetFaucet.request')}
      title={t('testnetFaucet.header')}
      url={faucet[layer]}
    />
  )
}
