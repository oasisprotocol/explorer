import { render, screen } from '@testing-library/react'
import { BlockDetailView } from '../'

describe('BlockDetailView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2023, 1, 1))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should display formatted values', () => {
    render(
      <BlockDetailView
        isLoading={false}
        block={{
          round: 1158800,
          hash: '194cdf5b6a75be37f0ee6ff52bb2680ec95a7c28a89c5214ba25809600c72f92',
          timestamp: '2022-04-23T12:20:56Z',
          num_transactions: 10,
          size: 6434,
          gas_used: 673539,
        }}
      />,
    )
    expect(screen.getByText('1158800')).toBeInTheDocument()
    expect(screen.getByText('April 23, 2022 at 12:20 PM UTC (9 months ago)')).toBeInTheDocument()
    expect(screen.getByText('6,434 bytes')).toBeInTheDocument()
  })
})
