import { FC } from 'react'
import { useScreenSize } from '../../hooks/useScreensize'
import { JazzIcon } from '../JazzIcon'
import { addressToJazzIconSeed } from './addressToJazzIconSeed'

type AccountAvatarProps = {
  account: {
    address: string
    address_eth?: string
  }
}

export const AccountAvatar: FC<AccountAvatarProps> = ({ account }) => {
  const { isMobile } = useScreenSize()

  if (!account.address) {
    return null
  }

  return <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToJazzIconSeed(account)} />
}
