import { useEffect, useState } from 'react'
import { getOasisAddress } from '../utils/helpers'

export const useTransformToOasisAddress = (ethOrOasisAddress: string): string | null => {
  const [oasisAddress, setOasisAddress] = useState<string | null>(null)

  useEffect(() => {
    let shouldUpdate = true

    const transformToOasisAddress = async (addr: string) => {
      const oasisAddr = await getOasisAddress(addr).catch(() => Promise.resolve(null))
      if (shouldUpdate) {
        setOasisAddress(oasisAddr)
      }
    }

    transformToOasisAddress(ethOrOasisAddress)

    return () => {
      shouldUpdate = false
    }
  }, [ethOrOasisAddress, setOasisAddress])

  return oasisAddress
}
