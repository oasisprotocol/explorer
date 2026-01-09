import { useOutletContext } from 'react-router-dom'
import { RuntimeBlockDetailsContext } from './types'

export const useRuntimeBlockDetailsProps = () => useOutletContext<RuntimeBlockDetailsContext>()
