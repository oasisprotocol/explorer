import { Runtime, RuntimeSdkBalance } from '../../oasis-nexus/api'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Network } from '../../types/network'
import { getTokensForScope, paraTimesConfig } from '../../config'
import { fromBaseUnits } from './helpers'

const grpcUrls: { [key in Network]: string } = {
  [Network.mainnet]: 'https://grpc.oasis.dev',
  [Network.testnet]: 'https://testnet.grpc.oasis.dev',
}

export async function getRPCAccountBalances(
  oasisAddress: string,
  scope: {
    network: Network
    layer: Runtime
  },
): Promise<RuntimeSdkBalance[]> {
  const paratimeConfig = paraTimesConfig[scope.layer][scope.network]
  if (!paratimeConfig.runtimeId) throw new Error('Paratime is not configured')

  const nic = new oasis.client.NodeInternal(grpcUrls[scope.network])
  const accountsWrapper = new oasisRT.accounts.Wrapper(oasis.misc.fromHex(paratimeConfig.runtimeId))

  const rawBalances = (
    await accountsWrapper
      .queryBalances()
      .setArgs({ address: oasis.staking.addressFromBech32(oasisAddress) })
      .query(nic)
  ).balances

  return [...rawBalances.entries()]
    .map(([denomination, amount]) => {
      return {
        balance: oasis.quantity.toBigInt(amount).toString(),
        token_symbol: oasis.misc.toStringUTF8(denomination) || getTokensForScope(scope)[0].ticker,
        token_decimals: paraTimesConfig[scope.layer].decimals, // TODO: differentiate by token
      }
    })
    .map(token => {
      return {
        ...token,
        balance: fromBaseUnits(token.balance, token.token_decimals),
      }
    })
}
