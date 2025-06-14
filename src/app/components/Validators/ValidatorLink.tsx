import { FC } from 'react'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { useValidatorName } from '../../hooks/useValidatorName'
import { Link } from '../../components/Link'
import { HighlightPattern } from '../HighlightedText'

type ValidatorLinkProps = {
  address: string
  alwaysTrim?: boolean
  highlightPattern?: HighlightPattern
  name?: string
  network: Network
  withSourceIndicator?: boolean
}

export const ValidatorLink: FC<ValidatorLinkProps> = ({
  address,
  alwaysTrim,
  highlightPattern,
  name,
  network,
  withSourceIndicator,
}) => {
  const to = RouteUtils.getValidatorRoute(network, address)
  const validatorName = useValidatorName(network, address)
  const displayName = name ?? validatorName

  return (
    <Link
      address={address}
      alwaysTrim={alwaysTrim}
      highlightPattern={highlightPattern}
      name={displayName}
      to={to}
      withSourceIndicator={withSourceIndicator}
    />
  )
}
