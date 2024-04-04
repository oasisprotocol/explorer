import { FunctionComponent } from 'react'
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
  <T extends WrappedComponentBaseProps>(
    Component: FunctionComponent<T>,
  ): FunctionComponent<T & WithAddressSwitchProps> =>
  (props: T & WithAddressSwitchProps) => {
    const { addressSwitchOption, address, ethAddress, oasisAddress, ...restProps } = props

    const isOasisAddressFormat = addressSwitchOption === AddressSwitchOption.Oasis
    const addressMatchingType = isOasisAddressFormat ? oasisAddress : ethAddress
    const defaultAddress = addressMatchingType ?? address

    return (
      <>
        <Tooltip
          arrow
          placement="top"
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InfoIcon />
              {/* TODO: Replace with translations, text to be decided?, should be probably an input to this generic withAddressSwitch */}
              {addressMatchingType
                ? isOasisAddressFormat
                  ? 'Oasis address'
                  : 'Ethereum address'
                : 'Address not available in the expected type'}
            </Box>
          }
        >
          <Box>
            <Component {...(restProps as T & WithAddressSwitchProps)} address={defaultAddress} />
          </Box>
        </Tooltip>
        {defaultAddress && <CopyToClipboard value={defaultAddress} />}
      </>
    )
  }
