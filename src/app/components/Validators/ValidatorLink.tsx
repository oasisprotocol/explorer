import { FC } from 'react'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { useValidatorName } from '../../hooks/useValidatorName'
import { Link } from '../../components/Link'

type ValidatorLinkProps = {
  address: string
  alwaysTrim?: boolean
  highlightedPartOfName?: string
  name?: string
  network: Network
  withSourceIndicator?: boolean
}

export const ValidatorLink: FC<ValidatorLinkProps> = ({
  address,
  alwaysTrim,
  highlightedPartOfName,
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
      highlightedPartOfName={highlightedPartOfName}
      name={displayName}
      to={to}
      withSourceIndicator={withSourceIndicator}
    />
  )
}
