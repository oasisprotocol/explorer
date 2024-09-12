import { RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'

export function isGasFeeEvent(event: RuntimeEvent) {
  const isGasEvent = event.type === RuntimeEventType.coregas_used
  const feeAccumulatorAddress = 'oasis1qp3r8hgsnphajmfzfuaa8fhjag7e0yt35cjxq0u4'
  const isFeeEvent = event.type === 'accounts.transfer' && event.body.to === feeAccumulatorAddress
  return isGasEvent || isFeeEvent
}
