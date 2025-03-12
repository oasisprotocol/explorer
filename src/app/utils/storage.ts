import { AppError, AppErrors } from '../../types/errors'
import { StorageKeys } from '../../types/storage'
import { LocalSettings } from '../../types/local-settings'

interface StorageType {
  [StorageKeys.MobileHelpScreenShown]: boolean
  [StorageKeys.LocalSettings]: LocalSettings
}

export const storage = (storage = localStorage) => {
  const set = <T extends keyof StorageType>(key: T, value: StorageType[T]): void => {
    try {
      const serializedValue = JSON.stringify(value)
      storage.setItem(key, serializedValue)
    } catch (error) {
      throw new AppError(AppErrors.Storage)
    }
  }

  const get = <T extends keyof StorageType>(key: T): StorageType[T] | undefined => {
    try {
      const serializedValue = storage.getItem(key)
      if (!serializedValue) {
        return
      }
      return JSON.parse(serializedValue)
    } catch (error) {
      throw new AppError(AppErrors.Storage)
    }
  }

  const removeItem = (key: StorageKeys) => {
    storage.removeItem(key)
  }

  const clear = () => {
    storage.clear()
  }

  return {
    set,
    get,
    removeItem,
    clear,
  }
}
