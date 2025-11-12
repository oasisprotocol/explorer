import { ReactNode } from 'react'
import { useLocalSettings } from '../../hooks/useLocalSettings'

// TODO: detect misused AdvancedFields: if there are AdvancedFields on page but no ToggleAdvancedFields
export function AdvancedField(props: { children: ReactNode }) {
  const { settings } = useLocalSettings()
  if (!settings.showAdvancedFields) return null
  return props.children
}
