import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const TestnetIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path d="M19.7999 18.4L13.9999 10.67V6.5L15.3499 4.81C15.6099 4.48 15.3799 4 14.9599 4H9.03993C8.61993 4 8.38993 4.48 8.64993 4.81L9.99993 6.5V10.67L4.19993 18.4C3.70993 19.06 4.17993 20 4.99993 20H18.9999C19.8199 20 20.2899 19.06 19.7999 18.4Z" />
    </SvgIcon>
  )
}
