import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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
