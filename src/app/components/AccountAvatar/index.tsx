import { FC } from 'react'
import { JazzIcon } from '../JazzIcon'
import { addressToJazzIconSeed } from './addressToJazzIconSeed'

type AccountAvatarProps = {
  account: {
    address: string
    address_eth?: string
  }
}

export const AccountAvatar: FC<AccountAvatarProps> = ({ account }) => {
  if (!account.address) {
    return null
  }

  return (
    <div className="scale-75 sm:scale-100 origin-center">
      <JazzIcon diameter={40} seed={addressToJazzIconSeed(account)} />
    </div>
  )
}
