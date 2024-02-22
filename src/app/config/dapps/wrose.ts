import { dapps } from '../../utils/externalLinks'
import type { DappReference } from './index'
import type { TFunction } from 'i18next'

/**
 * A dApp that lets you wrap or unwrap ROSE on an Oasis EVM-compatible ParaTime.
 *
 * See https://github.com/oasisprotocol/dapp-wrose/tree/master
 */
export const wRose = {
  // The addresses come from https://github.com/oasisprotocol/dapp-wrose/blob/master/src/constants/config.ts for the
  mainnetAddress: '0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3',
  testnetAddress: '0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94',
  app: (t: TFunction): DappReference => ({
    description: t('dapps.wrose.description'),
    label: t('dapps.wrose.label'),
    url: dapps.wRose,
  }),
}
