import { FC } from 'react'
import { SnapshotCardExternalLink } from '../../components/Snapshots/SnapshotCardExternalLink'
import { getFaucetInfo } from '../../utils/faucet-links'
import { Layer } from '../../../oasis-nexus/api'
import { Ticker } from '../../../types/ticker'
import { Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'

type TestnetFaucetProps = {
  network: Network
  layer: Layer
  ticker: Ticker
}

export const TestnetFaucet: FC<TestnetFaucetProps> = ({ network, layer, ticker }) => {
  const { t } = useTranslation()
  const info = getFaucetInfo(t, network, layer, ticker)

  return info ? <SnapshotCardExternalLink {...info} /> : null
}
