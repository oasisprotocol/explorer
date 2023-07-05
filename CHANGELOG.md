# Change Log

All notables changes to this project are documented in this file.

The format is inspired by [Keep a Changelog].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

<!-- markdownlint-disable no-duplicate-heading -->

<!-- NOTE: towncrier will not alter content above the TOWNCRIER line below. -->

<!-- TOWNCRIER -->

## 0.2.0 (2023-07-05)

### Removals and Breaking Changes

- Update routes to conform to [EIP-3091]
  ([#534](https://github.com/oasisprotocol/explorer/issues/534))

  [EIP-3091]: https://eips.ethereum.org/EIPS/eip-3091

- Remove explorer support for token types dropped by indexer, incl. ERC721
  ([#542](https://github.com/oasisprotocol/explorer/issues/542))

- Rename indexer to nexus
  ([#623](https://github.com/oasisprotocol/explorer/issues/623))

### Features

- Properly display creator info for contracts.
  ([#2](https://github.com/oasisprotocol/explorer/issues/2))

- When displaying a contract that describes a token, link to the token dashboard
  ([#3](https://github.com/oasisprotocol/explorer/issues/3))

- Mobile ParaTime picker
  ([#482](https://github.com/oasisprotocol/explorer/issues/482))

- Abbreviate numbers in transaction charts
  ([#511](https://github.com/oasisprotocol/explorer/issues/511))

- Use custom locale for formatting distance between dates
  ([#527](https://github.com/oasisprotocol/explorer/issues/527))

- Create transaction icons
  ([#535](https://github.com/oasisprotocol/explorer/issues/535))

- At address page, recognize contracts, and use appropriate title
  ([#544](https://github.com/oasisprotocol/explorer/issues/544))

- Add token overview page and dashboard component
  ([#546](https://github.com/oasisprotocol/explorer/issues/546))

- Implement scroll restore and scroll to the top of the page on navigate
  ([#567](https://github.com/oasisprotocol/explorer/issues/567))

- Save HelpScreen state on mobile
  ([#576](https://github.com/oasisprotocol/explorer/issues/576),
  [#593](https://github.com/oasisprotocol/explorer/issues/593))

- Add tooltip with error message to transaction status icons on lists
  ([#577](https://github.com/oasisprotocol/explorer/issues/577))

- Show contract verification and link to Sourcify
  ([#609](https://github.com/oasisprotocol/explorer/issues/609))

- For contracts, display bytecode
  ([#616](https://github.com/oasisprotocol/explorer/issues/616))

- Add token dashboard
  ([#623](https://github.com/oasisprotocol/explorer/issues/623))

- Account details: display token transfers
  ([#624](https://github.com/oasisprotocol/explorer/issues/624))

- Update graph graphics
  ([#627](https://github.com/oasisprotocol/explorer/issues/627))

- Token dashboard: add "Token Transfers" and "Code" tabs
  ([#634](https://github.com/oasisprotocol/explorer/issues/634))

- Add "Token Holders" tab to Token Dashboard
  ([#635](https://github.com/oasisprotocol/explorer/issues/635))

- Support searching for tokens by name
  ([#637](https://github.com/oasisprotocol/explorer/issues/637))

- Include contract verification info in token lists
  ([#638](https://github.com/oasisprotocol/explorer/issues/638))

- Improve displaying events
  ([#651](https://github.com/oasisprotocol/explorer/issues/651))

### Bug Fixes and Improvements

- Abbreviate tables on dashboard mobile
  ([#510](https://github.com/oasisprotocol/explorer/issues/510),
  [#574](https://github.com/oasisprotocol/explorer/issues/574))

- Show a nice error message when can't load account details.
  ([#522](https://github.com/oasisprotocol/explorer/issues/522))

- Improve/fix styling of search results on mobile
  ([#524](https://github.com/oasisprotocol/explorer/issues/524))

- Fix description list paddings for mobile variant
  ([#525](https://github.com/oasisprotocol/explorer/issues/525))

- Fix paddings in table cell
  ([#529](https://github.com/oasisprotocol/explorer/issues/529))

- Abbreviate block link on tablet
  ([#531](https://github.com/oasisprotocol/explorer/issues/531))

- Set laptop breakpoint to handle more edge cases
  ([#532](https://github.com/oasisprotocol/explorer/issues/532))

- Adjust layout to new breakpoint
  ([#532](https://github.com/oasisprotocol/explorer/issues/532))

- Fix dashboard links to latest blocks and transactions
  ([#537](https://github.com/oasisprotocol/explorer/issues/537))

- Prevent showing horizontal scrollbar on home page
  ([#554](https://github.com/oasisprotocol/explorer/issues/554))

- Fix error display when using invalid layers
  ([#557](https://github.com/oasisprotocol/explorer/issues/557))

- Don't indicate problem with nodes while loading number
  ([#560](https://github.com/oasisprotocol/explorer/issues/560))

- Wrap all long values in detail pages
  ([#571](https://github.com/oasisprotocol/explorer/issues/571))

- Show proper icon for not encrypted transaction
  ([#572](https://github.com/oasisprotocol/explorer/issues/572))

- Fix offline indicators showing out-of-date 2 minutes after opening page
  ([#578](https://github.com/oasisprotocol/explorer/issues/578))

- Differentiate user being offline and API being offline
  ([#579](https://github.com/oasisprotocol/explorer/issues/579),
  [#585](https://github.com/oasisprotocol/explorer/issues/585))

- Prevent double click on graph
  ([#583](https://github.com/oasisprotocol/explorer/issues/583))

- Fix glitchy mobile onboarding steps
  ([#594](https://github.com/oasisprotocol/explorer/issues/594))

- Fix info icon missing on mobile
  ([#601](https://github.com/oasisprotocol/explorer/issues/601))

- Freshness test: look at latest block time, not latest update
  ([#611](https://github.com/oasisprotocol/explorer/issues/611))

- Specify search suggestions per layer
  ([#617](https://github.com/oasisprotocol/explorer/issues/617))

### Internal Changes

- Update material-ui monorepo
  ([#278](https://github.com/oasisprotocol/explorer/issues/278),
  [#588](https://github.com/oasisprotocol/explorer/issues/588),
  [#653](https://github.com/oasisprotocol/explorer/issues/653))

- Refactor API bindings to support testnet using orval code generation
  ([#473](https://github.com/oasisprotocol/explorer/issues/473))

- Add strict type-checks that most switch statements cover all cases
  ([#477](https://github.com/oasisprotocol/explorer/issues/477))

- Update dependency swiper to v9.4.1
  ([#519](https://github.com/oasisprotocol/explorer/issues/519))

- Update react dependencies
  ([#521](https://github.com/oasisprotocol/explorer/issues/521),
  [#556](https://github.com/oasisprotocol/explorer/issues/556),
  [#566](https://github.com/oasisprotocol/explorer/issues/566),
  [#589](https://github.com/oasisprotocol/explorer/issues/589))

- Change release build artifact name to show version instead of commit hash
  ([#533](https://github.com/oasisprotocol/explorer/issues/533))

- Update dependency recharts to v2.7.0
  ([#538](https://github.com/oasisprotocol/explorer/issues/538))

- Update storybook dependencies to v7.0.21
  ([#539](https://github.com/oasisprotocol/explorer/issues/539))

- Update dependency recharts to v2.7.1
  ([#543](https://github.com/oasisprotocol/explorer/issues/543))

- Update react dependencies to v4.29.14
  ([#548](https://github.com/oasisprotocol/explorer/issues/548))

- Update dependency eslint to v8.43.0
  ([#550](https://github.com/oasisprotocol/explorer/issues/550))

- Update dependency markdownlint-cli to v0.35.0
  ([#551](https://github.com/oasisprotocol/explorer/issues/551))

- Update storybook dependencies to v7.0.22
  ([#552](https://github.com/oasisprotocol/explorer/issues/552))

- Update lint dependencies to v5.60.0
  ([#558](https://github.com/oasisprotocol/explorer/issues/558))

- Table column content: support ReactNode besides string
  ([#562](https://github.com/oasisprotocol/explorer/issues/562))

- Use intlFormatDistance instead of formatDistanceToNow
  ([#565](https://github.com/oasisprotocol/explorer/issues/565))

- Update dependency @storybook/testing-library to v0.2.0
  ([#569](https://github.com/oasisprotocol/explorer/issues/569))

- Update dependency recharts to v2.7.2
  ([#580](https://github.com/oasisprotocol/explorer/issues/580))

- Update storybook dependencies to v7.0.23
  ([#581](https://github.com/oasisprotocol/explorer/issues/581))

- Update parcel monorepo to v2.9.3
  ([#590](https://github.com/oasisprotocol/explorer/issues/590))

- Update lint dependencies to v5.60.1
  ([#595](https://github.com/oasisprotocol/explorer/issues/595))

- Update react dependencies to v4.29.18
  ([#596](https://github.com/oasisprotocol/explorer/issues/596))

- Update react dependencies to v4.29.19
  ([#603](https://github.com/oasisprotocol/explorer/issues/603))

- Update storybook dependencies to v7.0.24
  ([#604](https://github.com/oasisprotocol/explorer/issues/604))

- Update dependency typescript to v5.1.5
  ([#610](https://github.com/oasisprotocol/explorer/issues/610))

- Remove desktop tooltips on Graph
  ([#612](https://github.com/oasisprotocol/explorer/issues/612))

- Update dependency typescript to v5.1.6
  ([#622](https://github.com/oasisprotocol/explorer/issues/622))

- Update dependency ts-jest to v29.1.1
  ([#633](https://github.com/oasisprotocol/explorer/issues/633))

- Update dependency react-router-dom to v6.14.1
  ([#636](https://github.com/oasisprotocol/explorer/issues/636))

- Update Nexus API bindings
  ([#639](https://github.com/oasisprotocol/explorer/issues/639))

- Update dependency @types/node to v18.16.19
  ([#640](https://github.com/oasisprotocol/explorer/issues/640))

- Update dependency eslint to v8.44.0
  ([#641](https://github.com/oasisprotocol/explorer/issues/641))

- Update storybook dependencies to v7.0.25
  ([#645](https://github.com/oasisprotocol/explorer/issues/645))

- Switch back to staging API
  ([#647](https://github.com/oasisprotocol/explorer/issues/647))

- Remove feedback form from banner on staging
  ([#648](https://github.com/oasisprotocol/explorer/issues/648))

- Update lint dependencies to v5.61.0
  ([#649](https://github.com/oasisprotocol/explorer/issues/649))

- Update fontsource monorepo to ^5.0.5
  ([#652](https://github.com/oasisprotocol/explorer/issues/652))

- Update test dependencies to v29.6.0
  ([#657](https://github.com/oasisprotocol/explorer/issues/657))

- Switch to production API
  ([#661](https://github.com/oasisprotocol/explorer/issues/661))

- Fix changelog major and minor patterns
  ([#662](https://github.com/oasisprotocol/explorer/issues/662))

- Update towncrier to ignore package.json
  ([#665](https://github.com/oasisprotocol/explorer/issues/665))

## 0.1.0 (2023-06-13)

### Process Changes

- Add Change Log and the Change Log fragments process for assembling it
  ([#337](https://github.com/oasisprotocol/explorer/issues/337))

  This follows the same Change Log fragments process as is used by [Oasis Core].

  For more details, see [Change Log fragments].

  [Oasis Core]: https://github.com/oasisprotocol/oasis-core
  [Change Log fragments]: .changelog/README.md

- Initial release
