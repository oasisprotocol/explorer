import { ParaTime } from '../../../../../config'

export enum ConsensusParaTime {
  Consensus = 'consensus',
}

export const GraphEndpoints = {
  ...ParaTime,
  ...ConsensusParaTime,
}

export type GraphEndpoint = ParaTime | ConsensusParaTime
