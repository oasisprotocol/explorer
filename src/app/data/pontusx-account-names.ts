import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { AccountNameInfo } from '../hooks/useAccountName'
import * as process from 'process'

const DATA_SOURCE_URL = 'https://raw.githubusercontent.com/deltaDAO/mvg-portal/main/pontusxAddresses.json'

type AccountMap = Map<string, string>
type AccountEntry = {
  name: string
  address: string
}
type AccountData = {
  map: AccountMap
  list: AccountEntry[]
}

const getPontusXAccountNames = () =>
  new Promise<AccountData>((resolve, reject) => {
    axios.get(DATA_SOURCE_URL).then(response => {
      if (response.status !== 200) reject("Couldn't load names")
      if (!response.data) reject("Couldn't load names")
      const map = new Map()
      const list: AccountEntry[] = []
      Object.entries(response.data).forEach(([address, name]) => {
        map.set(address, name)
        const normalizedEntry: AccountEntry = {
          name: name as string,
          address,
        }
        list.push(normalizedEntry)
      })
      resolve({
        map,
        list,
      })
    }, reject)
  })

export const usePontusXAccountNames = (enabled: boolean) => {
  return useQuery(['pontusXNames'], getPontusXAccountNames, {
    enabled,
    staleTime: Infinity,
  })
}

export const usePontusXAccountName = (address: string, enabled: boolean): AccountNameInfo => {
  // When running jest tests, we don't want to load from Pontus-X.
  if (process.env.NODE_ENV === 'test') {
    return {
      name: undefined,
      loading: false,
    }
  }
  // This is not a condition that can change while the app is running, so it's OK.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoading, error, data: allNames } = usePontusXAccountNames(enabled)
  if (error) {
    console.log('Failed to load Pontus-X account names', error)
  }
  return {
    name: allNames?.map.get(address),
    loading: isLoading,
  }
}
