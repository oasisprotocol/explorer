import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { BlockDetailView } from '../'
import { suggestedParsedBlock } from '../../../utils/test-fixtures'

describe('BlockDetailView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2023, 1, 1))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should display formatted values', () => {
    renderWithProviders(<BlockDetailView isLoading={false} block={suggestedParsedBlock} />)
    expect(screen.getByText('1,396,255')).toBeInTheDocument()
    expect(screen.getByText('May 13, 2022 at 6:39 AM UTC (9 months ago)')).toBeInTheDocument()
    expect(screen.getByText('4,214 bytes')).toBeInTheDocument()
  })
})
