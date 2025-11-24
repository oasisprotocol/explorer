import { FC } from 'react'
import { useGetConsensusValidatorsAddressNameMap } from './../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { ValidatorLink } from '../Validators/ValidatorLink'
import { AccountLink } from './AccountLink'

type ConsensusAccountLinkProps = {
  address: string
  alwaysTrim?: boolean
  labelOnly?: boolean
  network: Network
}

export const ConsensusAccountLink: FC<ConsensusAccountLinkProps> = ({
  address,
  alwaysTrim = true,
  labelOnly,
  network,
}) => {
  const { data } = useGetConsensusValidatorsAddressNameMap(network)

  if (data?.data && address in data.data) {
    return <ValidatorLink address={address} network={network} alwaysTrim={alwaysTrim} mono={false} />
  }

  return (
    <AccountLink
      labelOnly={labelOnly}
      scope={{ network, layer: 'consensus' }}
      address={address}
      alwaysTrim={alwaysTrim}
    />
  )
}
