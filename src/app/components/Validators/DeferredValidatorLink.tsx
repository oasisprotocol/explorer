import { FC } from 'react'
import { Network } from '../../../types/network'
import { Validator } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { ValidatorLink } from './ValidatorLink'
import { HighlightPattern } from '../HighlightedText'

export const DeferredValidatorLink: FC<{
  network: Network
  address: string
  validator: Validator | undefined
  isError: boolean
  highlightPattern?: HighlightPattern
}> = ({ network, address, validator, isError, highlightPattern }) => {
  const scope: SearchScope = { network, layer: 'consensus' }

  if (isError) {
    console.log('Warning: failed to look up validators!')
  }

  return (
    <ValidatorLink
      address={address}
      network={scope.network}
      name={validator?.media?.name}
      highlightPattern={highlightPattern}
    />
  )
}
