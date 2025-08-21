import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PercentageGain } from '..'

test('PercentageGain', () => {
  const { rerender } = render(<PercentageGain earliestValue={2} latestValue={3} />)
  expect(screen.getByText('+50%')).toBeInTheDocument()

  rerender(<PercentageGain earliestValue={3} latestValue={2} />)
  expect(screen.getByText('-33.33%')).toBeInTheDocument()
})
