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

export type ParamSetterFunction<T = string> = (
  value: T | null | undefined,
  options?: UrlSettingOptions,
) => void

export function useTypedSearchParam<T = string>(
  paramName: string,
  defaultValue: T,
  defaultSetterOptions: UrlSettingOptions = {},
): [T, ParamSetterFunction<T>] {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = (searchParams.get(paramName) as T) ?? defaultValue
  const setValue: ParamSetterFunction<T> = (newValue, options = defaultSetterOptions) => {
    const { replace, preventScrollReset = true, deleteParams = [] } = options
    if (newValue === undefined || newValue === null || newValue === defaultValue) {
      searchParams.delete(paramName)
    } else {
      searchParams.set(paramName, newValue as string)
    }
    deleteParams.forEach(p => searchParams.delete(p))
    setSearchParams(searchParams, { replace, preventScrollReset })
  }
  return [value, setValue]
}
