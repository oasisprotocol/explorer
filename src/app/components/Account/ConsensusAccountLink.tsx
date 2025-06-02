import { FC } from 'react'
import { Layer, useGetConsensusValidatorsAddressNameMap } from './../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { ValidatorLink } from '../Validators/ValidatorLink'
import { AccountLink } from './AccountLink'
import { HighlightPattern } from '../HighlightedText'

type ConsensusAccountLinkProps = {
  address: string
  alwaysTrim?: boolean
  labelOnly?: boolean
  network: Network
  highlightPattern?: HighlightPattern
}

export const ConsensusAccountLink: FC<ConsensusAccountLinkProps> = ({
  address,
  alwaysTrim = true,
  labelOnly,
  network,
  highlightPattern,
}) => {
  const { data } = useGetConsensusValidatorsAddressNameMap(network)

  if (data?.data && address in data.data) {
    return (
      <ValidatorLink
        address={address}
        network={network}
        alwaysTrim={alwaysTrim}
        highlightPattern={highlightPattern}
      />
    )
  }

  return (
    <AccountLink
      labelOnly={labelOnly}
      scope={{ network, layer: Layer.consensus }}
      address={address}
      alwaysTrim={alwaysTrim}
      highlightPattern={highlightPattern}
    />
  )
}
