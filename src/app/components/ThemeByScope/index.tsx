import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'

export const ThemeByScope: FC<{
  network: Network
  children: ReactNode
}> = ({ network, children }) => <div className={network}>{children}</div>
