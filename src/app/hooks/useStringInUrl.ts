import { useSearchParams } from 'react-router-dom'

export type UrlSettingOptions = {
  /**
   * Should we replace the current state in the history, instead of appending a new state?
   *
   * Default is false
   */
  replace?: boolean

  /**
   * Should we block scrolling to the top?
   *
   * Default is true
   */
  preventScrollReset?: boolean

  /**
   * Should we delete some other params while setting this one?
   */
  deleteParams?: string[]
}

export const useStringInUrl = (paramName: string, defaultValue: string = '') => {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(paramName) ?? defaultValue
  const setValue = (newValue: string, options: UrlSettingOptions = {}) => {
    const { replace, preventScrollReset = true, deleteParams = [] } = options
    if (newValue === defaultValue) {
      searchParams.delete(paramName)
    } else {
      searchParams.set(paramName, newValue)
    }
    deleteParams.forEach(p => searchParams.delete(p))
    setSearchParams(searchParams, { replace, preventScrollReset })
  }
  return { value, setValue }
}
