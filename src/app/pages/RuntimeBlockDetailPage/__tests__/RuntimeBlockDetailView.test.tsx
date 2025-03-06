import { screen } from '@testing-library/react'
import { RuntimeBlock } from '../../../../oasis-nexus/api'
import { renderWithProviders } from '../../../utils/__tests__/renderWithProviders.test'
import { RuntimeBlockDetailView } from '../'
import { suggestedParsedBlock } from '../../../utils/test-fixtures'

describe('RuntimeBlockDetailView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T01:01:01Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should display formatted values', () => {
    renderWithProviders(
      <RuntimeBlockDetailView isLoading={false} block={suggestedParsedBlock as RuntimeBlock} />,
    )
    expect(screen.getByText('1,396,255')).toBeInTheDocument()
    expect(screen.getByText('May 13, 2022 at 6:39 AM UTC (8 months ago)')).toBeInTheDocument()
    expect(screen.getByText('4,214 bytes')).toBeInTheDocument()
  })
})
