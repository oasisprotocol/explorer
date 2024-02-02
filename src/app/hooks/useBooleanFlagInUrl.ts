import { useSearchParams } from 'react-router-dom'
import { UrlSettingOptions } from './useStringInUrl'

export const useBooleanFlagInUrl = (param: string, defaultValue: boolean) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const valueString = searchParams.get(param)?.toLowerCase()
  const value = valueString === 'true' ? true : valueString === 'false' ? false : defaultValue
  const setValue = (newValue: boolean, options: UrlSettingOptions = {}) => {
    const { replace, preventScrollReset = true, deleteParams = [] } = options
    if (newValue === defaultValue) {
      searchParams.delete(param)
    } else {
      searchParams.set(param, newValue.toString())
    }
    deleteParams.forEach(p => searchParams.delete(p))
    setSearchParams(searchParams, { replace, preventScrollReset })
  }

  const toggleValue = () => setValue(!value)
  return { value, setValue, toggleValue }
}
