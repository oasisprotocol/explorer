import { useContext } from 'react'
import { TableConfigContext } from '../providers/TableConfigContext'

export const useTableConfig = () => {
  const value = useContext(TableConfigContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useTableConfig] Component not wrapped within a Provider')
  }

  return value
}
