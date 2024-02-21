import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCardExternalLink } from '../../components/Snapshots/SnapshotCardExternalLink'
import { getFaucetLink } from '../../utils/faucet-links'
import { Layer } from '../../../oasis-nexus/api'
import { Ticker } from '../../../types/ticker'
import { Network } from '../../../types/network'

type TestnetFaucetProps = {
  network: Network
  layer: Layer
  ticker: Ticker
}

export const TestnetFaucet: FC<TestnetFaucetProps> = ({ network, layer, ticker }) => {
  const { t } = useTranslation()
  const link = getFaucetLink(network, layer, ticker)

  return link ? (
    <SnapshotCardExternalLink
      description={t('testnetFaucet.description')}
      label={t('testnetFaucet.request')}
      title={t('testnetFaucet.header')}
      url={link}
    />
  ) : null
}
