import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { Age } from '../'

describe('Age', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-02-05T10:14:35.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should display formatted values', () => {
    renderWithProviders(<Age sinceTimestamp={'2024-02-05T10:14:40.000Z'} />)
    expect(screen.getByText('5 sec')).toBeInTheDocument()
    expect(screen.queryByText('less than a minute')).not.toBeInTheDocument()
  })
})
