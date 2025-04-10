import { FC } from 'react'

export const SmallOasisLogo: FC<{ size?: number }> = ({ size = 25 }) => (
  <img src="https://assets.oasis.io/logotypes/Icon Blue 192.png" height={size} width={size} alt="" />
)
