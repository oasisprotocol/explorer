import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { GraphEndpoint, GraphEndpoints } from '../ParaTimeSelector/Graph/types'

interface MobileTooltipProviderState {
  showMobileTooltip: { [key in GraphEndpoint]: boolean }
}

interface MobileTooltipProviderContext {
  readonly state: MobileTooltipProviderState
  setShowMobileTooltip: (graphEndpoint: GraphEndpoint, show: boolean) => void
}

const mobileTooltipProviderInitialState: MobileTooltipProviderState = {
  showMobileTooltip: {
    [GraphEndpoints.Consensus]: false,
    [GraphEndpoints.Emerald]: false,
    [GraphEndpoints.Sapphire]: false,
    [GraphEndpoints.Cipher]: false,
  },
}

export const MobileTooltipContext = createContext<MobileTooltipProviderContext>(
  {} as MobileTooltipProviderContext,
)

export const MobileTooltipProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<MobileTooltipProviderState>({
    ...mobileTooltipProviderInitialState,
  })

  const setShowMobileTooltip = (graphEndpoint: GraphEndpoint, show: boolean) => {
    setState(prevState => ({
      ...prevState,
      showMobileTooltip: {
        ...prevState.showMobileTooltip,
        [graphEndpoint]: show,
      },
    }))
  }

  const providerState: MobileTooltipProviderContext = {
    state,
    setShowMobileTooltip,
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
