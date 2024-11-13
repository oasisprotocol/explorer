import { FC } from 'react'
import { Network } from '../../../types/network'
import { Layer, Validator } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { ValidatorLink } from './ValidatorLink'

export const DeferredValidatorLink: FC<{
  network: Network
  address: string
  validator: Validator | undefined
  isError: boolean
  highlightedPart?: string | undefined
}> = ({ network, address, validator, isError, highlightedPart }) => {
  const scope: SearchScope = { network, layer: Layer.consensus }

  if (isError) {
    console.log('Warning: failed to look up validators!')
  }

  return (
    <ValidatorLink
      address={address}
      network={scope.network}
      name={validator?.media?.name}
      highlightedPartOfName={highlightedPart}
    />
  )
}
