import { FC } from 'react'
import logo from '../../../../public/Icon Blue 192.png'

export const SmallOasisLogo: FC<{ size?: number }> = ({ size = 25 }) => (
  <img src={logo} height={size} width={size} alt="" />
)
