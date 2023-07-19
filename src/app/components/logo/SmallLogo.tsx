import { FC } from 'react'

export const SmallLogo: FC<{ size?: number }> = ({ size = 25 }) => (
  <img src="/logo512.png" height={size} width={size} alt="" />
)
