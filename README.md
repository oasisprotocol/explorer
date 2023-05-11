# Oasis Explorer

[![CI build status][github-ci-build-badge]][github-ci-build-link]
[![CI test status][github-ci-test-badge]][github-ci-test-link]
[![CI lint status][github-ci-lint-badge]][github-ci-lint-link]
[![Release status][github-release-badge]][github-release-link]
[![Renovate enabled][github-renovate-badge]][github-renovate-link]

Official explorer for the Oasis Network.

:warning:
**Oasis Explorer is currently in development. Development deploy is available
at <https://explorer.dev.oasis.io>.**
:warning:

## Getting started

### Installing and running Oasis Explorer

You can quickly get started with the following commands:

```shell
yarn
yarn start
```

Then go to <http://localhost:1234> to access the app.

### Code style

This repository uses [prettier] as a code formatter and [eslint] for
JavaScript/TypeScript linting.

It also lints git commits with [gitlint] and Markdown files with [markdownlint].

You can use the following commands to run various linters:

```bash
# Lint JavaScript/TypeScript files across the whole repository.
yarn lint
# Fix JavaScript/TypeScript linting issues that were found.
yarn lint:fix

# Lint git commits.
yarn lint-git

# Lint Markdown files.
yarn lint-docs
```

#### Git Commit Messages

A quick summary:

- Separate subject from body with a blank line.
- Limit the subject line to 72 characters.
- Capitalize the subject line.
- Do not end the subject line with a period.
- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move component to..." not "Moves component to...").
- Wrap the body at 80 characters.
- Use the body to explain _what_ and _why_ vs. _how_.

A detailed post on Git commit messages: [How To Write a Git Commit Message].

### Oasis Indexer API

Deployed version is at <https://index.oasislabs.com/v1/> with OpenAPI
[HTML][indexer-html-spec] and [YAML][indexer-yaml-spec] specs.

<details>
<summary>
Bleeding-edge API version
</summary>

OpenAPI spec for the [bleeding-edge version][indexer-bleeding-edge-spec].

To quickly run latest emerald indexer locally without running a node,
[replace following lines][replace-lines-to-run-latest-emerald] with:

<!-- markdownlint-disable line-length -->

```yaml
analysis:
  analyzers:
    - name: emerald_main_damask
      chain_id: oasis-3
      rpc: grpc.oasis.dev:443
      chaincontext: b11b369e0da5bb230b220127f5e7b242d385ef8c6f54906243f30af63c815535
      # Use the latest round from oasisscan (easier than gRPC)
      # https://www.oasisscan.com/paratimes/000000000000000000000000000000000000000000000000e2eaa99fc008f87f/roundList
      to: <latest round>
      from: <latest round - 500>
```

<!-- markdownlint-enable line-length -->

and run

```sh
make docker
make start-docker-e2e
# TODO: this needs to be updated with REACT_APP_TESTNET_API too
REACT_APP_API=http://localhost:8008/v1/ yarn start
```

</details>

[prettier]: https://prettier.io/
[eslint]: https://github.com/eslint/eslint
[gitlint]: https://jorisroovers.com/gitlint/
[markdownlint]: https://github.com/DavidAnson/markdownlint
[How To Write a Git Commit Message]: https://chris.beams.io/posts/git-commit/
[github-ci-build-badge]: https://github.com/oasisprotocol/explorer/actions/workflows/ci-build.yml/badge.svg
[github-ci-build-link]: https://github.com/oasisprotocol/explorer/actions?query=workflow:ci-build+branch:master
[github-ci-test-badge]: https://github.com/oasisprotocol/explorer/actions/workflows/ci-test.yml/badge.svg
[github-ci-test-link]: https://github.com/oasisprotocol/explorer/actions?query=workflow:ci-test+branch:master
[github-ci-lint-badge]: https://github.com/oasisprotocol/explorer/actions/workflows/ci-lint.yml/badge.svg
[github-ci-lint-link]: https://github.com/oasisprotocol/explorer/actions?query=workflow:ci-lint+branch:master
[github-release-badge]: https://github.com/oasisprotocol/explorer/actions/workflows/release.yml/badge.svg
[github-release-link]: https://github.com/oasisprotocol/explorer/actions?query=workflow:release
[github-renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg
[github-renovate-link]: https://www.mend.io/renovate/
[indexer-html-spec]: https://index.oasislabs.com/v1/spec/v1.html
[indexer-yaml-spec]: https://index.oasislabs.com/v1/spec/v1.yaml
[indexer-bleeding-edge-spec]: https://github.com/oasisprotocol/oasis-indexer/blob/main/api/spec/v1.yaml
[replace-lines-to-run-latest-emerald]: https://github.com/oasisprotocol/oasis-indexer/blob/d48de37/tests/e2e/config/e2e-dev.yml#L1-L8
