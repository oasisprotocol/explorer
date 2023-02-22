import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { GraphEndpoint } from '../ParaTimeSelector/Graph/types'

interface MobileTooltipProviderState {
  showMobileTooltip: { [key in GraphEndpoint]: boolean }
}

interface MobileTooltipProviderContext {
  readonly state: MobileTooltipProviderState
  setShowTooltip: (graphEndpoint: GraphEndpoint, show: boolean) => void
}

const mobileTooltipProviderInitialState: MobileTooltipProviderState = {
  showMobileTooltip: {
    [GraphEndpoint.Consensus]: false,
    [GraphEndpoint.Emerald]: false,
    [GraphEndpoint.Sapphire]: false,
    [GraphEndpoint.Cipher]: false,
  },
}

export const MobileTooltipContext = createContext<MobileTooltipProviderContext>(
  {} as MobileTooltipProviderContext,
)

export const MobileTooltipProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<MobileTooltipProviderState>({
    ...mobileTooltipProviderInitialState,
  })

  const setShowTooltip = (graphEndpoint: GraphEndpoint, show: boolean) => {
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
    setShowTooltip,
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
