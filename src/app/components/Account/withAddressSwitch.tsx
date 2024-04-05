import { FC } from 'react'
import { AddressSwitchOption } from '../AddressSwitch'
import { CopyToClipboard } from '../CopyToClipboard'

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
    const displayedAddress = addressesByType[addressSwitchOption] ?? ethAddress ?? oasisAddress

    return (
      <>
        <Component {...(restProps as unknown as T)} address={displayedAddress} />
        {displayedAddress && <CopyToClipboard value={displayedAddress} />}
      </>
    )
  }
