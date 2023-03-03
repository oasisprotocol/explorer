import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { Layer } from '../../../../config'

interface MobileTooltipProviderState {
  activeMobileGraphTooltip: Layer | null
}

interface MobileTooltipProviderContext {
  readonly state: MobileTooltipProviderState
  setActiveMobileGraphTooltip: (activeMobileGraphTooltip: Layer | null) => void
}

const mobileTooltipProviderInitialState: MobileTooltipProviderState = {
  activeMobileGraphTooltip: null,
}

export const MobileTooltipContext = createContext<MobileTooltipProviderContext>(
  {} as MobileTooltipProviderContext,
)

export const MobileTooltipProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<MobileTooltipProviderState>({
    ...mobileTooltipProviderInitialState,
  })

  const setActiveMobileGraphTooltip = (activeMobileGraphTooltip: Layer | null) => {
    setState({ activeMobileGraphTooltip })
  }

  const providerState: MobileTooltipProviderContext = {
    state,
    setActiveMobileGraphTooltip,
  }

  return <MobileTooltipContext.Provider value={providerState}>{children}</MobileTooltipContext.Provider>
}

export const useMobileTooltip = () => {
  const value = useContext(MobileTooltipContext)
  if (value === undefined) {
    throw new Error('[useMobileTooltip] Component not wrapped within a Provider')
  }
  return value
}
