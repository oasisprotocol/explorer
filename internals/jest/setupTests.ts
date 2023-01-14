/* eslint-disable @typescript-eslint/no-var-requires */
// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

import 'react-app-polyfill/stable'

// Init i18n for the tests needing it
import '../../src/locales/i18n'

require('dotenv').config()

global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
window.TextDecoder = global.TextDecoder
window.TextEncoder = global.TextEncoder
