import { FC } from 'react'
import { staking } from '@oasisprotocol/client'
import { useScreenSize } from '../../hooks/useScreensize'
import { JazzIcon } from '../JazzIcon'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

type AccountAvatarProps = {
  address?: string
}

export const AccountAvatar: FC<AccountAvatarProps> = ({ address }) => {
  const { isMobile } = useScreenSize()

  if (!address) {
    return null
  }

  return <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(address)} />
}
