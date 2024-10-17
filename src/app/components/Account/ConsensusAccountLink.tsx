import { FC } from 'react'
import { Layer, useGetConsensusValidatorsAddressNameMap } from './../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { ValidatorLink } from '../Validators/ValidatorLink'
import { AccountLink } from './AccountLink'

type ConsensusAccountLinkProps = {
  address: string
  labelOnly?: boolean
  network: Network
}

export const ConsensusAccountLink: FC<ConsensusAccountLinkProps> = ({ address, labelOnly, network }) => {
  const { data } = useGetConsensusValidatorsAddressNameMap(network)

  if (data?.data?.[address]) {
    return <ValidatorLink address={address} network={network} alwaysTrim />
  }

  return (
    <AccountLink
      labelOnly={labelOnly}
      scope={{ network, layer: Layer.consensus }}
      address={address}
      alwaysTrim
    />
  )
}
