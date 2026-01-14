import { ReactNode } from 'react'
import { fixedNetwork } from '../../utils/route-utils'
import { ThemeByScope } from '.'

export const withDefaultTheme = (node: ReactNode, alwaysMainnet = false) => (
  <ThemeByScope network={alwaysMainnet ? 'mainnet' : (fixedNetwork ?? 'mainnet')}>{node}</ThemeByScope>
)
