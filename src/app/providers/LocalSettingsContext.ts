import { createContext } from 'react'
import { LocalSettings } from '../../types/local-settings'

export interface LocalSettingsProviderContext {
  readonly settings: LocalSettings
  changeSetting<T extends keyof LocalSettings>(key: T, value: LocalSettings[T]): void
}

export const LocalSettingsContext = createContext<LocalSettingsProviderContext>(
  {} as LocalSettingsProviderContext,
)
