// Custom assertions
import '@testing-library/jest-dom/vitest'

// Init i18n for the tests needing it
import '../../src/locales/i18n'
import i18next from 'i18next'
i18next.init({
  interpolation: {
    defaultVariables: {
      timeZone: 'UTC',
      locale: 'en-US',
    },
  },
})
