import { render } from '@testing-library/react'
import { EventTypeIcon } from '../RuntimeEventDetails'
import { TokenTransferIcon } from '../../Tokens/TokenTransferIcon'

test('Transfer, burn, and mint icons should match in EventTypeIcon and evm TokenTransferIcon', () => {
  const transfer = render(<EventTypeIcon eventType="accounts.transfer" />).container
  const evmTransfer = render(<TokenTransferIcon method="Transfer" size={25} />).container
  expect(transfer.querySelector('svg')?.outerHTML.length).toBeGreaterThan(100)
  expect(transfer.querySelector('svg')?.outerHTML).toEqual(evmTransfer.querySelector('svg')?.outerHTML)

  const mint = render(<EventTypeIcon eventType="accounts.mint" />).container
  const evmMint = render(<TokenTransferIcon method="Minting" size={25} />).container
  expect(mint.querySelector('svg')?.outerHTML).toEqual(evmMint.querySelector('svg')?.outerHTML)

  const burn = render(<EventTypeIcon eventType="accounts.burn" />).container
  const evmBurn = render(<TokenTransferIcon method="Burning" size={25} />).container
  // compare using innerHTML as different dynamic css class is applied to svg element
  expect(burn.querySelector('svg')?.innerHTML).toEqual(evmBurn.querySelector('svg')?.innerHTML)
})
