import { FC } from 'react'
import { AccountLink } from '../Account/AccountLink'
import { Network } from '../../../types/network'
import { Layer, Validator } from '../../../oasis-nexus/api'
import Skeleton from '@mui/material/Skeleton'
import { SearchScope } from '../../../types/searchScope'
import Box from '@mui/material/Box'
import { ValidatorImage } from './ValidatorImage'

export const DeferredValidatorLink: FC<{
  network: Network
  address: string
  validator: Validator | undefined
  isLoading: boolean
  isError: boolean
  highlightedPart?: string | undefined
}> = ({ network, address, validator, isError, isLoading, highlightedPart }) => {
  const scope: SearchScope = { network, layer: Layer.consensus }

  if (isError) {
    console.log('Warning: failed to look up validators!')
  }

  const validatorImage = (
    <ValidatorImage
      address={address}
      name={validator?.media?.name}
      logotype={validator?.media?.logotype}
      highlightedPart={highlightedPart}
    />
  )
  // TODO: switch to ValidatorLink, when validator detail pages become available
  return (
    <Box sx={{ display: 'inline-flex' }}>
      <AccountLink scope={scope} address={address} title={validatorImage} />
      {isLoading && <Skeleton variant="circular" width="1em" height="1em" />}
    </Box>
  )
}
