import { RuntimeEvent } from '../../oasis-nexus/api'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export function parseEvmEvent(event: RuntimeEvent) {
  const fromAddress = event.evm_log_params?.find(param => param.name === 'from')?.value as string | undefined
  const toAddress = event.evm_log_params?.find(param => param.name === 'to')?.value as string | undefined
  const isMinting = event.evm_log_name === 'Transfer' && fromAddress === NULL_ADDRESS
  const isBurning = event.evm_log_name === 'Transfer' && toAddress === NULL_ADDRESS
  const parsedEvmLogName = isMinting ? 'Minting' : isBurning ? 'Burning' : event.evm_log_name || undefined

  return {
    fromAddress,
    toAddress,
    isMinting,
    isBurning,
    parsedEvmLogName,
  }
}
