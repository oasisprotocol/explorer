import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/__tests__/renderWithProviders.test'
import { TableCellAge } from '../'
import { useTableConfig } from '../../../hooks/useTableConfig'
import { TableAgeType } from '../../../../types/table-age-type'

jest.mock('../../../hooks/useTableConfig', () => ({
  useTableConfig: jest.fn(),
}))

describe('TableCellAge', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-02-05T10:14:35.000Z'))

    // Fix locale-specific mock output
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          format: () => '05-02-2024, 10:14:40',
        }) as unknown as Intl.DateTimeFormat,
    )
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.resetAllMocks()
  })

  it('should display relative time by default', () => {
    ;(useTableConfig as jest.Mock).mockReturnValue({
      state: { ageHeaderType: TableAgeType.Distance },
    })

    renderWithProviders(<TableCellAge sinceTimestamp="2024-02-05T10:14:40.000Z" />)

    expect(screen.getByText('5 sec')).toBeInTheDocument()
  })

  it('should display formatted date when ageHeaderType is DateTime', () => {
    ;(useTableConfig as jest.Mock).mockReturnValue({
      state: { ageHeaderType: TableAgeType.DateTime },
    })

    renderWithProviders(<TableCellAge sinceTimestamp="2024-02-05T10:14:40.000Z" />)

    expect(screen.getByText('05-02-2024, 10:14:40')).toBeInTheDocument()
  })

  it('should handle invalid timestamp gracefully', () => {
    ;(useTableConfig as jest.Mock).mockReturnValue({
      state: { ageHeaderType: TableAgeType.Distance },
    })

    renderWithProviders(<TableCellAge sinceTimestamp="invalid-timestamp" />)

    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument()
  })
})
