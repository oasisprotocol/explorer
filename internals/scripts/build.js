// @ts-check
const execSync = require('child_process').execSync
const { buildDatetime, buildSha, buildVersion } = require('../getBuildData')
const args = process.argv.slice(2)

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.REACT_APP_BUILD_VERSION = buildVersion
process.env.REACT_APP_BUILD_PREVIEW = args.includes('--preview') ? 'preview' : ''

execSync('yarn clean && parcel build --target web --dist-dir build', { stdio: 'inherit' })
execSync('cp public/robots.txt build/robots.txt', { encoding: 'utf8' })
