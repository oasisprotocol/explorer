import { render, screen } from '@testing-library/react'
import { PercentageGain } from '..'

test('PercentageGain', () => {
  const { rerender } = render(<PercentageGain percentage={50} />)
  expect(screen.getByTestId('NorthIcon')).toBeInTheDocument()
  expect(screen.getByText('50%')).toBeInTheDocument()

  rerender(<PercentageGain percentage={-33.3333333} />)
  expect(screen.getByTestId('SouthIcon')).toBeInTheDocument()
  expect(screen.getByText('-33.33%')).toBeInTheDocument()
})
