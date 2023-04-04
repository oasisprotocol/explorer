// @ts-check
const execSync = require('child_process').execSync
const { buildDatetime, buildSha, buildVersion } = require('../getBuildData')

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.REACT_APP_BUILD_VERSION = buildVersion

execSync('yarn clean && parcel build --target web --dist-dir build', { stdio: 'inherit' })
execSync('cp public/robots.txt build/robots.txt', { encoding: 'utf8' })
