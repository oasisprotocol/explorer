import { FC } from 'react'
import logo from '../../../../public/logo512.png'

export const SmallLogo: FC<{ size?: number }> = ({ size = 25 }) => (
  <img src={logo} height={size} width={size} alt="" />
)
