import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import { fixedNetwork } from '../../utils/route-utils'
import { Layer } from '../../../oasis-nexus/api'

export const ThemeByScope: FC<{
  network: Network
  layer?: Layer
  children: React.ReactNode
}> = ({ network, children }) => <div className={network}>{children}</div>

export const withDefaultTheme = (node: ReactNode, alwaysMainnet = false) => (
  <ThemeByScope network={alwaysMainnet ? 'mainnet' : (fixedNetwork ?? 'mainnet')}>{node}</ThemeByScope>
)
