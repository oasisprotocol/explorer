import { FC } from 'react'
import { staking } from '@oasisprotocol/client'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { JazzIcon } from '../../components/JazzIcon'
import { Account as ConsensusAccount } from '../../../oasis-indexer/api'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

type AccountProps = {
  // switch to Emerald when endpoint is ready
  account: ConsensusAccount
}

export const Account: FC<AccountProps> = ({ account }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <StyledDescriptionList>
      <dt>
        <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address!)} />
      </dt>
      <dd>
        <CopyToClipboard value={account.address!} />
      </dd>
    </StyledDescriptionList>
  )
}
