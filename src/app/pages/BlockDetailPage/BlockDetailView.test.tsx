import { render } from '@testing-library/react'
import { BlockDetailView } from '.'

test('BlockDetailView should display formatted values', () => {
  const { container } = render(
    <BlockDetailView
      isLoading={false}
      block={{
        round: 1158800,
        hash: '194cdf5b6a75be37f0ee6ff52bb2680ec95a7c28a89c5214ba25809600c72f92',
        timestamp: '2022-04-23T12:20:56Z',
        num_transactions: 10,
        size_bytes: 6434,
        gas_used: 673539,
      }}
    />,
  )
  expect(container).toHaveTextContent('1158800')
  expect(container).toHaveTextContent('April 23, 2022 at 12:20 PM UTC (9 months ago)')
  expect(container).toHaveTextContent('6,434 bytes')
})
