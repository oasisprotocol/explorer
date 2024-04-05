import { FC } from 'react'
import { AddressSwitchOption } from '../AddressSwitch'
import { CopyToClipboard } from '../CopyToClipboard'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'

interface WithAddressSwitchProps {
  addressSwitchOption: AddressSwitchOption
  ethAddress?: string
  oasisAddress?: string
}

interface WrappedComponentBaseProps {
  address?: string
}

export const withAddressSwitch =
  <T extends WrappedComponentBaseProps>(Component: FC<T>) =>
  (props: Omit<T, 'address'> & WithAddressSwitchProps) => {
    const { addressSwitchOption, ethAddress, oasisAddress, ...restProps } = props

    const addressesByType = {
      [AddressSwitchOption.Oasis]: oasisAddress,
      [AddressSwitchOption.ETH]: ethAddress,
    }
    const hasAddressOfExpectedType = !!addressesByType[addressSwitchOption]
    const displayedAddress = addressesByType[addressSwitchOption] ?? ethAddress ?? oasisAddress

    return (
      <>
        <Tooltip
          arrow
          placement="top"
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InfoIcon />
              {/* TODO: Replace with translations, text to be decided?, should be probably an input to this generic withAddressSwitch */}
              {hasAddressOfExpectedType
                ? oasisAddress
                  ? 'Oasis address'
                  : 'Ethereum address'
                : 'Address not available in the expected type'}
            </Box>
          }
        >
          <Box>
            <Component {...(restProps as unknown as T)} address={displayedAddress} />
          </Box>
        </Tooltip>
        {displayedAddress && <CopyToClipboard value={displayedAddress} />}
      </>
    )
  }
