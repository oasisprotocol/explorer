import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const MainnetIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path d="M11.99 18.54L4.62 12.81L3 14.07L12 21.07L21 14.07L19.37 12.8L11.99 18.54V18.54ZM12 16L19.36 10.27L21 9L12 2L3 9L4.63 10.27L12 16Z" />
    </SvgIcon>
  )
}
