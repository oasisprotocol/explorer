import { useOutletContext } from 'react-router'
import { RuntimeBlockDetailsContext } from './types'

export const useRuntimeBlockDetailsProps = () => useOutletContext<RuntimeBlockDetailsContext>()
