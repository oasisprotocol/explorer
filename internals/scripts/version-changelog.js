// Script runs on CI and extracts the changelog for the current version
// and writes it to CHANGELOG_SUMMARY.md which is used in the release details.
const fs = require('fs')
const semver = require('semver')

const args = process.argv.slice(2)
if (args.length === 0) {
  throw new Error('Version argument is required in semver format (e.g. 2.4.0).')
}

const version = args[0]

if (!semver.valid(version)) {
  console.log(`Invalid version: ${version}`)
  process.exit(1)
}

const changelog = fs.readFileSync('CHANGELOG.md', 'utf8')
const lines = changelog.split('\n')
let found = false
let markdown = '# Change Log\n\n'

for (const line of lines) {
  if (line.startsWith('## ')) {
    if (found) {
      // Found the next version, exit the loop
      break
    }

    if (line.startsWith(`## ${version}`)) {
      // Found the specified version, start extracting entries
      found = true
    }
  }

  if (found) {
    const githubIssueLineRegex = /\[#[0-9]+\]\((https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/[0-9]+)\)/
    // line with a issue link starts with multiple whitespaces, but we need only one
    if (line.match(githubIssueLineRegex)) {
      markdown += ` ${line.trim()}`
    } else {
      markdown += line
    }

    // We don't want to add a newline after a title line or when the last char is comma
    markdown += `${line.startsWith('- ') || line.endsWith(',') ? '' : '\n'}`
  }
}

fs.writeFileSync('CHANGELOG_SUMMARY.md', markdown)
