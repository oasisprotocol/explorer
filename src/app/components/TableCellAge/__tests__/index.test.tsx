import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/__tests__/renderWithProviders.test'
import { TableCellAge } from '../'
import { useLocalSettings } from '../../../hooks/useLocalSettings'
import { TableAgeType } from '../../../../types/table-age-type'
import { LocalSettingsProviderContext } from '../../../providers/LocalSettingsContext'

vi.mock('../../../hooks/useLocalSettings', () => ({
  useLocalSettings: vi.fn(),
}))

describe('TableCellAge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-02-05T10:14:35.000Z'))

    // Fix locale-specific mock output
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          format: () => '05-02-2024, 10:14:40',
        }) as unknown as Intl.DateTimeFormat,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('should display relative time by default', () => {
    vi.mocked(useLocalSettings).mockReturnValue({
      settings: { ageHeaderType: TableAgeType.Distance },
    } as LocalSettingsProviderContext)

    renderWithProviders(<TableCellAge sinceTimestamp="2024-02-05T10:14:40.000Z" />)

    expect(screen.getByText('5 sec')).toBeInTheDocument()
  })

  it('should display formatted date when ageHeaderType is DateTime', () => {
    vi.mocked(useLocalSettings).mockReturnValue({
      settings: { ageHeaderType: TableAgeType.DateTime },
    } as LocalSettingsProviderContext)

    renderWithProviders(<TableCellAge sinceTimestamp="2024-02-05T10:14:40.000Z" />)

    expect(screen.getByText('05-02-2024, 10:14:40')).toBeInTheDocument()
  })

  it('should handle invalid timestamp gracefully', () => {
    vi.mocked(useLocalSettings).mockReturnValue({
      settings: { ageHeaderType: TableAgeType.Distance },
    } as LocalSettingsProviderContext)

    renderWithProviders(<TableCellAge sinceTimestamp="invalid-timestamp" />)

    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument()
  })
})
