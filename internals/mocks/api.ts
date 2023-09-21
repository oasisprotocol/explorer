import { RuntimeStatus, Status } from '../../src/oasis-nexus/api'

export const runtimeStatusResponse: RuntimeStatus = {
  active_nodes: 0,
  latest_block: 719374,
  latest_block_time: '2023-08-03T09:13:34Z',
  latest_update_age_ms: 749,
}

export const statusResponse: Status = {
  latest_block: 719374,
  latest_block_time: '2023-08-03T09:13:34Z',
  latest_node_block: 719374,
  latest_update_age_ms: 2000,
}
