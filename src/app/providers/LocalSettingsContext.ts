import { createContext } from 'react'
import { LocalSettings } from '../../types/local-settings'

export interface LocalSettingsProviderContext {
  readonly settings: LocalSettings
  changeSetting: (key: keyof LocalSettings, value: any) => void
}

export const LocalSettingsContext = createContext<LocalSettingsProviderContext>(
  {} as LocalSettingsProviderContext,
)
