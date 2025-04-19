import { FC } from 'react'
import { useScreenSize } from '../../hooks/useScreensize'
import { MetadataAvatar } from './MetadataAvatar'
import { SearchScope } from '../../../types/searchScope'

type AccountAvatarProps = {
  account: SearchScope & {
    address: string
    address_eth?: string
  }
}

export const AccountAvatar: FC<AccountAvatarProps> = ({ account }) => {
  const { isMobile } = useScreenSize()

  if (!account.address) {
    return null
  }

  return <MetadataAvatar size={isMobile ? 30 : 40} account={account} />
}
