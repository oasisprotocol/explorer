import { ParaTime } from '../../../../../config'

export enum ConsensusParaTime {
  Consensus = 'consensus',
}

export const GraphEndpoint = {
  ...ParaTime,
  ...ConsensusParaTime,
}

export type GraphEndpoint = ParaTime | ConsensusParaTime
