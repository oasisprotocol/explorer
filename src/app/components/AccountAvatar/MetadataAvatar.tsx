import { FC } from 'react'

import { SearchScope } from '../../../types/searchScope'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import { useTokenInfo } from '../../pages/TokenDashboardPage/hook'
import { InitialsAvatar } from '../AccountAvatar/InitialsAvatar'
import { addressToJazzIconSeed } from './addressToJazzIconSeed'
import { JazzIcon } from '../JazzIcon'
import { Layer, useGetConsensusValidatorsAddress } from '../../../oasis-nexus/api'

export const MetadataAvatar: FC<{
  account: SearchScope & {
    address: string
    address_eth?: string
  }
  size: number
}> = ({ account, size }) => {
  const { metadata } = useAccountMetadata(account, account.address_eth ?? account.address)
  const { token } = useTokenInfo(account, account.address_eth ?? account.address, {
    enabled: account.layer !== Layer.consensus,
  })
  const validatorQuery = useGetConsensusValidatorsAddress(account.network, account.address, {
    query: { enabled: account.layer === Layer.consensus },
  })
  const validator = validatorQuery.data?.data.validators[0]?.media

  const name = metadata?.name || token?.name || validator?.name

  if (metadata?.icon) {
    return <img src={metadata.icon} alt="" width={size} />
  }
  if (validator?.logoUrl) {
    return <img src={validator?.logoUrl} alt="" width={size} />
  }
  if (name) {
    return <InitialsAvatar name={name} size={size} />
  }
  return <JazzIcon diameter={size} seed={addressToJazzIconSeed(account)} />
}
