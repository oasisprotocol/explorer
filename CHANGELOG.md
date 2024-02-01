# Change Log

All notables changes to this project are documented in this file.

The format is inspired by [Keep a Changelog].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

<!-- markdownlint-disable no-duplicate-heading -->

<!-- NOTE: towncrier will not alter content above the TOWNCRIER line below. -->

<!-- TOWNCRIER -->

## 1.7.0 (2024-02-01)

### Features

- In block details, add prev and next buttons
  ([#1178](https://github.com/oasisprotocol/explorer/issues/1178),
  [#1219](https://github.com/oasisprotocol/explorer/issues/1219))

### Bug Fixes and Improvements

- Fix Safari buggy display of block fill
  ([#1186](https://github.com/oasisprotocol/explorer/issues/1186))

- Show view all link only for ERC721 tokens
  ([#1210](https://github.com/oasisprotocol/explorer/issues/1210))

- Stop using mainnet block gas limit on testnet
  ([#1215](https://github.com/oasisprotocol/explorer/issues/1215))

### Internal Changes

- Switch to production API
  ([#1199](https://github.com/oasisprotocol/explorer/issues/1199))

- Update Testnet Sapphire block gas limit
  ([#1182](https://github.com/oasisprotocol/explorer/issues/1182))

- Group all renovate dependency updates under on Changelog entry
  ([#1184](https://github.com/oasisprotocol/explorer/issues/1184))

- Update dependencies
  ([#1162](https://github.com/oasisprotocol/explorer/issues/1162),
  [#1163](https://github.com/oasisprotocol/explorer/issues/1163),
  [#1166](https://github.com/oasisprotocol/explorer/issues/1166),
  [#1167](https://github.com/oasisprotocol/explorer/issues/1167),
  [#1169](https://github.com/oasisprotocol/explorer/issues/1169),
  [#1171](https://github.com/oasisprotocol/explorer/issues/1171),
  [#1180](https://github.com/oasisprotocol/explorer/issues/1180),
  [#1183](https://github.com/oasisprotocol/explorer/issues/1183),
  [#1187](https://github.com/oasisprotocol/explorer/issues/1187),
  [#1188](https://github.com/oasisprotocol/explorer/issues/1188),
  [#1195](https://github.com/oasisprotocol/explorer/issues/1195))

## 1.6.0 (2024-01-24)

### Features

- Add NFT instance token transfers tab
  ([#1066](https://github.com/oasisprotocol/explorer/issues/1066))

- Create pie chart component
  ([#1115](https://github.com/oasisprotocol/explorer/issues/1115))

- Simplify UI: remove event filtering switch
  ([#1174](https://github.com/oasisprotocol/explorer/issues/1174))

### Bug Fixes and Improvements

- Handle NFT image loading errors
  ([#1147](https://github.com/oasisprotocol/explorer/issues/1147))

- Do not change runtime to Emerald when switching network
  ([#1152](https://github.com/oasisprotocol/explorer/issues/1152))

### Internal Changes

- Switch to staging API
  ([#1173](https://github.com/oasisprotocol/explorer/issues/1173))

- Simplify search scopes and fix search on error pages
  ([#1159](https://github.com/oasisprotocol/explorer/issues/1159))
- Update dependency date-fns to v3.2.0
  ([#1132](https://github.com/oasisprotocol/explorer/issues/1132))

- Update TypeScript type definitions
  ([#1136](https://github.com/oasisprotocol/explorer/issues/1136))

- Update lint dependencies
  ([#1137](https://github.com/oasisprotocol/explorer/issues/1137),
  [#1150](https://github.com/oasisprotocol/explorer/issues/1150),
  [#1153](https://github.com/oasisprotocol/explorer/issues/1153))

- Update dependency recharts to v2.10.4
  ([#1140](https://github.com/oasisprotocol/explorer/issues/1140))

- Update material-ui monorepo
  ([#1143](https://github.com/oasisprotocol/explorer/issues/1143),
  [#1158](https://github.com/oasisprotocol/explorer/issues/1158))

- Update dependency react-router-dom to v6.21.2
  ([#1148](https://github.com/oasisprotocol/explorer/issues/1148))

- Update storybook dependencies to v7.6.10
  ([#1149](https://github.com/oasisprotocol/explorer/issues/1149))

- Update dependency ethers to ^6.10.0
  ([#1151](https://github.com/oasisprotocol/explorer/issues/1151))

- Update test dependencies
  ([#1156](https://github.com/oasisprotocol/explorer/issues/1156))

## 1.5.0 (2024-01-09)

### Features

- Support advertising specific dApps on relevant token pages
  ([#1085](https://github.com/oasisprotocol/explorer/issues/1085))

- Add icons and display appropriate fields for new event types
  ([#1082](https://github.com/oasisprotocol/explorer/issues/1082))

### Bug Fixes and Improvements

- Fix owner link formatting in NFT gallery
  ([#1109](https://github.com/oasisprotocol/explorer/issues/1109))

- Handle missing data when displaying token transfers
  ([#1126](https://github.com/oasisprotocol/explorer/issues/1126))

### Internal Changes

- Use theme to capitalize all buttons
  ([#966](https://github.com/oasisprotocol/explorer/issues/966))

- Add TypeScript type definitions group to Renovate bot config
  ([#1099](https://github.com/oasisprotocol/explorer/issues/1099))

- Update TypeScript type definitions
  ([#1100](https://github.com/oasisprotocol/explorer/issues/1100))

- Update dependency react-router-dom to v6.21.0
  ([#1096](https://github.com/oasisprotocol/explorer/issues/1096))

- Update actions/upload-artifact action to v4
  ([#1102](https://github.com/oasisprotocol/explorer/issues/1102))

- Update storybook dependencies
  ([#1103](https://github.com/oasisprotocol/explorer/issues/1103),
  [#1112](https://github.com/oasisprotocol/explorer/issues/1112),
  [#1128](https://github.com/oasisprotocol/explorer/issues/1128))

- Update lint dependencies
  ([#1104](https://github.com/oasisprotocol/explorer/issues/1104),
  [#1108](https://github.com/oasisprotocol/explorer/issues/1108),
  [#1117](https://github.com/oasisprotocol/explorer/issues/1117),
  [#1120](https://github.com/oasisprotocol/explorer/issues/1120))

- Update i18next dependencies
  ([#1101](https://github.com/oasisprotocol/explorer/issues/1101),
  [#1125](https://github.com/oasisprotocol/explorer/issues/1125),
  [#1116](https://github.com/oasisprotocol/explorer/issues/1116))

- Update material-ui monorepo
  ([#1110](https://github.com/oasisprotocol/explorer/issues/1110),
  [#1122](https://github.com/oasisprotocol/explorer/issues/1122))

- Update dependency axios to v1.6.4
  ([#1123](https://github.com/oasisprotocol/explorer/issues/1123))

- Update dependency axios to v1.6.5
  ([#1135](https://github.com/oasisprotocol/explorer/issues/1135))

- Update dependency date-fns to v3
  ([#1106](https://github.com/oasisprotocol/explorer/issues/1106))

- Update dependency ethers to ^6.9.1
  ([#1113](https://github.com/oasisprotocol/explorer/issues/1113))

- Update dependency ethers to ^6.9.2
  ([#1127](https://github.com/oasisprotocol/explorer/issues/1127))

- Update dependency react-router-dom to v6.21.1
  ([#1118](https://github.com/oasisprotocol/explorer/issues/1118))

- Update dependency @emotion/react to v11.11.3
  ([#1119](https://github.com/oasisprotocol/explorer/issues/1119))

- Update test dependencies
  ([#1124](https://github.com/oasisprotocol/explorer/issues/1124))

- Update parcel monorepo to v2.11.0
  ([#1130](https://github.com/oasisprotocol/explorer/issues/1130))

## 1.4.0 (2023-12-14)

### Features

- Add NFT feature
  ([#909](https://github.com/oasisprotocol/explorer/issues/909),
  [#1036](https://github.com/oasisprotocol/explorer/issues/1036),
  [#1038](https://github.com/oasisprotocol/explorer/issues/1038),
  [#1043](https://github.com/oasisprotocol/explorer/issues/1043),
  [#1051](https://github.com/oasisprotocol/explorer/issues/1051),
  [#1052](https://github.com/oasisprotocol/explorer/issues/1052),
  [#1069](https://github.com/oasisprotocol/explorer/issues/1069))

- Show block-level evens in block details
  ([#990](https://github.com/oasisprotocol/explorer/issues/990))

- Show events on account details page
  ([#992](https://github.com/oasisprotocol/explorer/issues/992))

- Implement searching for blocks by hash
  ([#1081](https://github.com/oasisprotocol/explorer/issues/1081))

### Bug Fixes and Improvements

- Prevent app crash when rendering new event types
  ([#1012](https://github.com/oasisprotocol/explorer/issues/1012))

- Fix address formatting on empty account
  ([#1039](https://github.com/oasisprotocol/explorer/issues/1039),
  [#1061](https://github.com/oasisprotocol/explorer/issues/1061))

- Fix Testnet Faucet links
  ([#1065](https://github.com/oasisprotocol/explorer/issues/1065))

- Fetch account balance from RPC node
  ([#1073](https://github.com/oasisprotocol/explorer/issues/1073))

### Internal Changes

- Add basic handling of new event types
  ([#893](https://github.com/oasisprotocol/explorer/issues/893))

- Install setuptools to make Towncrier fork work with Python 3.12
  ([#980](https://github.com/oasisprotocol/explorer/issues/980))

- Refactor code for showing events
  ([#991](https://github.com/oasisprotocol/explorer/issues/991))

- Don't directly include internal enum values in URLs
  ([#1079](https://github.com/oasisprotocol/explorer/issues/1079))

- Use Oasis bot token in renovate workflow
  ([#1021](https://github.com/oasisprotocol/explorer/issues/1021))

- Update API bindings
  ([#1059](https://github.com/oasisprotocol/explorer/issues/1059),
  [#1004](https://github.com/oasisprotocol/explorer/issues/1004),
  [#948](https://github.com/oasisprotocol/explorer/issues/948),
  [#977](https://github.com/oasisprotocol/explorer/issues/977),
  [#1089](https://github.com/oasisprotocol/explorer/issues/1089))

- Update lint dependencies
  ([#972](https://github.com/oasisprotocol/explorer/issues/972),
  [#986](https://github.com/oasisprotocol/explorer/issues/986),
  [#1003](https://github.com/oasisprotocol/explorer/issues/1003),
  [#1015](https://github.com/oasisprotocol/explorer/issues/1015),
  [#1029](https://github.com/oasisprotocol/explorer/issues/1029),
  [#1040](https://github.com/oasisprotocol/explorer/issues/1040),
  [#1058](https://github.com/oasisprotocol/explorer/issues/1058),
  [#1063](https://github.com/oasisprotocol/explorer/issues/1063),
  [#1091](https://github.com/oasisprotocol/explorer/issues/1091),
  [#1026](https://github.com/oasisprotocol/explorer/issues/1026),
  [#999](https://github.com/oasisprotocol/explorer/issues/999))

- Update material-ui monorepo
  ([#974](https://github.com/oasisprotocol/explorer/issues/974),
  [#1002](https://github.com/oasisprotocol/explorer/issues/1002),
  [#1016](https://github.com/oasisprotocol/explorer/issues/1016),
  [#1050](https://github.com/oasisprotocol/explorer/issues/1050),
  [#1067](https://github.com/oasisprotocol/explorer/issues/1067),
  [#1092](https://github.com/oasisprotocol/explorer/issues/1092))

- Update swiper dependencies
  ([#976](https://github.com/oasisprotocol/explorer/issues/976),
  [#1010](https://github.com/oasisprotocol/explorer/issues/1010),
  [#1034](https://github.com/oasisprotocol/explorer/issues/1034))

- Update react dependencies
  ([#982](https://github.com/oasisprotocol/explorer/issues/982),
  [#1008](https://github.com/oasisprotocol/explorer/issues/1008),
  [#1031](https://github.com/oasisprotocol/explorer/issues/1031),
  [#1032](https://github.com/oasisprotocol/explorer/issues/1032),
  [#1041](https://github.com/oasisprotocol/explorer/issues/1041),
  [#1057](https://github.com/oasisprotocol/explorer/issues/1057))

- Update recharts dependencies
  ([#983](https://github.com/oasisprotocol/explorer/issues/983),
  [#994](https://github.com/oasisprotocol/explorer/issues/994),
  [#1005](https://github.com/oasisprotocol/explorer/issues/1005),
  [#1027](https://github.com/oasisprotocol/explorer/issues/1027),
  [#1047](https://github.com/oasisprotocol/explorer/issues/1047),
  [#1055](https://github.com/oasisprotocol/explorer/issues/1055))

- Update storybook dependencies
  ([#984](https://github.com/oasisprotocol/explorer/issues/984),
  [#1044](https://github.com/oasisprotocol/explorer/issues/1044),
  [#1048](https://github.com/oasisprotocol/explorer/issues/1048),
  [#1053](https://github.com/oasisprotocol/explorer/issues/1053),
  [#1056](https://github.com/oasisprotocol/explorer/issues/1056),
  [#1078](https://github.com/oasisprotocol/explorer/issues/1078),
  [#998](https://github.com/oasisprotocol/explorer/issues/998),
  [#1017](https://github.com/oasisprotocol/explorer/issues/1017))

- Update i18next dependencies
  ([#1013](https://github.com/oasisprotocol/explorer/issues/1013),
  [#1022](https://github.com/oasisprotocol/explorer/issues/1022),
  [#1045](https://github.com/oasisprotocol/explorer/issues/1045),
  [#1076](https://github.com/oasisprotocol/explorer/issues/1076),
  [#1093](https://github.com/oasisprotocol/explorer/issues/1093),
  [#1014](https://github.com/oasisprotocol/explorer/issues/1014))

- Update test dependencies
  ([#1025](https://github.com/oasisprotocol/explorer/issues/1025),
  [#1030](https://github.com/oasisprotocol/explorer/issues/1030),
  [#1046](https://github.com/oasisprotocol/explorer/issues/1046),
  [#1054](https://github.com/oasisprotocol/explorer/issues/1054),
  [#1024](https://github.com/oasisprotocol/explorer/issues/1024))

- Update TypeScript type definitions
  ([#981](https://github.com/oasisprotocol/explorer/issues/981),
  [#987](https://github.com/oasisprotocol/explorer/issues/987),
  [#1001](https://github.com/oasisprotocol/explorer/issues/1001),
  [#1007](https://github.com/oasisprotocol/explorer/issues/1007),
  [#1000](https://github.com/oasisprotocol/explorer/issues/1000),
  [#1033](https://github.com/oasisprotocol/explorer/issues/1033),
  [#1064](https://github.com/oasisprotocol/explorer/issues/1064),
  [#1068](https://github.com/oasisprotocol/explorer/issues/1068),
  [#1087](https://github.com/oasisprotocol/explorer/issues/1087),
  [#1094](https://github.com/oasisprotocol/explorer/issues/1094))

- Update axios dependencies
  ([#1009](https://github.com/oasisprotocol/explorer/issues/1009),
  [#985](https://github.com/oasisprotocol/explorer/issues/985),
  [#1019](https://github.com/oasisprotocol/explorer/issues/1019))

- Update fontsource monorepo
  ([#968](https://github.com/oasisprotocol/explorer/issues/968),
  [#1074](https://github.com/oasisprotocol/explorer/issues/1074))

- Update Node.js to v20
  ([#973](https://github.com/oasisprotocol/explorer/issues/973))

- Update actions/setup-node action to v4
  ([#971](https://github.com/oasisprotocol/explorer/issues/971))

- Update parcel monorepo
  ([#975](https://github.com/oasisprotocol/explorer/issues/975),
  [#995](https://github.com/oasisprotocol/explorer/issues/995),
  [#1020](https://github.com/oasisprotocol/explorer/issues/1020))

- Update dependency @ethereumjs/util to v9.0.1
  ([#996](https://github.com/oasisprotocol/explorer/issues/996))

- Update dependency orval to ^6.20.0
  ([#1011](https://github.com/oasisprotocol/explorer/issues/1011))

- Update dependency react-router-dom to v6.19.0
  ([#1023](https://github.com/oasisprotocol/explorer/issues/1023))

- Update dependency typescript to v5.3.2
  ([#1028](https://github.com/oasisprotocol/explorer/issues/1028))

- Update dependency orval to ^6.21.0
  ([#1042](https://github.com/oasisprotocol/explorer/issues/1042))

- Update actions/setup-python action to v5
  ([#1072](https://github.com/oasisprotocol/explorer/issues/1072))

- Update dependency typescript to v5.3.3
  ([#1075](https://github.com/oasisprotocol/explorer/issues/1075))

- Update dependency @oasisprotocol/client to v1
  ([#1083](https://github.com/oasisprotocol/explorer/issues/1083))

- Update dependency @oasisprotocol/client-rt to v1
  ([#1084](https://github.com/oasisprotocol/explorer/issues/1084))

- Update dependency markdownlint-cli to v0.38.0
  ([#1086](https://github.com/oasisprotocol/explorer/issues/1086))

- Update dependency prettier to v3.1.1
  ([#1088](https://github.com/oasisprotocol/explorer/issues/1088))

- Update critical dependency @babel/traverse to v7.23.6
  ([#1090](https://github.com/oasisprotocol/explorer/issues/1090))

- Add CODEOWNERS
  ([#1095](https://github.com/oasisprotocol/explorer/issues/1095))

## 1.3.0 (2023-10-23)

### Features

- Show raw data for unencrypted transactions
  ([#896](https://github.com/oasisprotocol/explorer/issues/896))

- Added icons for consensus.Delegate and consensus.Undelegate
  ([#906](https://github.com/oasisprotocol/explorer/issues/906))

### Bug Fixes and Improvements

- Show precise Total Supply in token search result / vertical table
  ([#917](https://github.com/oasisprotocol/explorer/issues/917))

### Internal Changes

- Update API bindings
  ([#799](https://github.com/oasisprotocol/explorer/issues/799))

- Update react dependencies to v4.35.3
  ([#866](https://github.com/oasisprotocol/explorer/issues/866))

- Update material-ui monorepo
  ([#867](https://github.com/oasisprotocol/explorer/issues/867),
  [#875](https://github.com/oasisprotocol/explorer/issues/875),
  [#895](https://github.com/oasisprotocol/explorer/issues/895),
  [#927](https://github.com/oasisprotocol/explorer/issues/927),
  [#936](https://github.com/oasisprotocol/explorer/issues/936),
  [#952](https://github.com/oasisprotocol/explorer/issues/952))

- Update dependency react-router-dom to v6.16.0
  ([#868](https://github.com/oasisprotocol/explorer/issues/868))

- Update dependency msw to ^1.3.1
  ([#869](https://github.com/oasisprotocol/explorer/issues/869))

- Update dependency @playwright/test to ^1.38.0
  ([#870](https://github.com/oasisprotocol/explorer/issues/870))

- Update dependency @testing-library/user-event to v14.5.0
  ([#871](https://github.com/oasisprotocol/explorer/issues/871))

- Update dependency @types/node to v18.17.17
  ([#872](https://github.com/oasisprotocol/explorer/issues/872))

- Update storybook dependencies
  ([#873](https://github.com/oasisprotocol/explorer/issues/873),
  [#951](https://github.com/oasisprotocol/explorer/issues/951))

- Update test dependencies
  ([#874](https://github.com/oasisprotocol/explorer/issues/874))

- Update react dependencies
  ([#876](https://github.com/oasisprotocol/explorer/issues/876),
  [#926](https://github.com/oasisprotocol/explorer/issues/926),
  [#931](https://github.com/oasisprotocol/explorer/issues/931),
  [#935](https://github.com/oasisprotocol/explorer/issues/935),
  [#937](https://github.com/oasisprotocol/explorer/issues/937))

- Update lint dependencies to v6.7.2
  ([#877](https://github.com/oasisprotocol/explorer/issues/877))

- Update dependency @types/node to v18.17.18
  ([#879](https://github.com/oasisprotocol/explorer/issues/879))

- Update storybook dependencies to v7.4.3
  ([#880](https://github.com/oasisprotocol/explorer/issues/880))

- Update dependency swiper to v10.3.0
  ([#881](https://github.com/oasisprotocol/explorer/issues/881))

- Update dependency @playwright/test to ^1.38.1
  ([#883](https://github.com/oasisprotocol/explorer/issues/883))

- Update dependency markdownlint-cli to v0.37.0
  ([#884](https://github.com/oasisprotocol/explorer/issues/884))

- Update storybook dependencies to v7.4.5
  ([#885](https://github.com/oasisprotocol/explorer/issues/885))

- Update dependency eslint to v8.50.0
  ([#886](https://github.com/oasisprotocol/explorer/issues/886))

- Update dependency @types/node to v18.17.19
  ([#887](https://github.com/oasisprotocol/explorer/issues/887))

- Update lint dependencies to v6.7.3
  ([#889](https://github.com/oasisprotocol/explorer/issues/889))

- Update dependency @types/node to v18.18.0
  ([#890](https://github.com/oasisprotocol/explorer/issues/890))

- Use evm_log_signature to filter and paginate Token Transfers
  ([#894](https://github.com/oasisprotocol/explorer/issues/894))

- Update dependency axios to v1.5.1
  ([#897](https://github.com/oasisprotocol/explorer/issues/897))

- Update dependency swiper to v10.3.1
  ([#902](https://github.com/oasisprotocol/explorer/issues/902))

- Update dependency @types/node to v18.18.1
  ([#908](https://github.com/oasisprotocol/explorer/issues/908))

- Update dependency @fontsource-variable/figtree to ^5.0.14
  ([#911](https://github.com/oasisprotocol/explorer/issues/911))

- Update dependency msw to ^1.3.2
  ([#912](https://github.com/oasisprotocol/explorer/issues/912))

- Update dependency orval to ^6.18.1
  ([#913](https://github.com/oasisprotocol/explorer/issues/913))

- Update dependency @storybook/testing-library to v0.2.2
  ([#914](https://github.com/oasisprotocol/explorer/issues/914))

- Update dependency @types/node to v18.18.3
  ([#919](https://github.com/oasisprotocol/explorer/issues/919))

- Update lint dependencies to v6.7.4
  ([#920](https://github.com/oasisprotocol/explorer/issues/920))

- Pin the major version in github action
  ([#922](https://github.com/oasisprotocol/explorer/issues/922))

- Update fontsource monorepo
  ([#923](https://github.com/oasisprotocol/explorer/issues/923),
  [#932](https://github.com/oasisprotocol/explorer/issues/932),
  [#962](https://github.com/oasisprotocol/explorer/issues/962))

- Update storybook dependencies to v7.4.6
  ([#924](https://github.com/oasisprotocol/explorer/issues/924))

- Update dependency react-quick-pinch-zoom to v5
  ([#925](https://github.com/oasisprotocol/explorer/issues/925))

- Update dependency eslint to v8.51.0
  ([#928](https://github.com/oasisprotocol/explorer/issues/928))

- Update dependency postcss 8.4.31
  ([#929](https://github.com/oasisprotocol/explorer/issues/929))

- Update dependency @types/node to v18.18.4
  ([#930](https://github.com/oasisprotocol/explorer/issues/930))

- Update dependency msw-storybook-addon to ^1.9.0
  ([#933](https://github.com/oasisprotocol/explorer/issues/933))

- Update lint dependencies to v6.7.5
  ([#934](https://github.com/oasisprotocol/explorer/issues/934))

- Update dependency eslint-plugin-prettier to v5.0.1
  ([#938](https://github.com/oasisprotocol/explorer/issues/938))

- Update parcel monorepo to v2.10.0
  ([#939](https://github.com/oasisprotocol/explorer/issues/939))

- Update dependency @playwright/test to ^1.39.0
  ([#940](https://github.com/oasisprotocol/explorer/issues/940))

- Update dependency @testing-library/jest-dom to v6.1.4
  ([#941](https://github.com/oasisprotocol/explorer/issues/941))

- Update dependency @types/node to v18.18.5
  ([#942](https://github.com/oasisprotocol/explorer/issues/942))

- Update dependency react-i18next to v13.3.0
  ([#945](https://github.com/oasisprotocol/explorer/issues/945))

- Update dependency recharts to v2.9.0
  ([#946](https://github.com/oasisprotocol/explorer/issues/946))

- Update dependency react-router-dom to v6.17.0
  ([#949](https://github.com/oasisprotocol/explorer/issues/949))

- Update lint dependencies to v6.8.0
  ([#950](https://github.com/oasisprotocol/explorer/issues/950))

- Update dependency @types/jest to ^29.5.6
  ([#954](https://github.com/oasisprotocol/explorer/issues/954))

- Update dependency @types/node to v18.18.6
  ([#955](https://github.com/oasisprotocol/explorer/issues/955))

- Update dependency @types/react to v18.2.29
  ([#956](https://github.com/oasisprotocol/explorer/issues/956))

- Update dependency @types/react-dom to v18.2.14
  ([#957](https://github.com/oasisprotocol/explorer/issues/957))

- Update dependency i18next to v23.6.0
  ([#958](https://github.com/oasisprotocol/explorer/issues/958))

- Update dependency react-i18next to v13.3.1
  ([#959](https://github.com/oasisprotocol/explorer/issues/959))

- Update storybook dependencies to v7.5.1
  ([#960](https://github.com/oasisprotocol/explorer/issues/960))

- Update dependency @types/react to v18.2.30
  ([#961](https://github.com/oasisprotocol/explorer/issues/961))

- Update dependency @types/react to v18.2.31
  ([#964](https://github.com/oasisprotocol/explorer/issues/964))

- Update dependency eslint to v8.52.0
  ([#965](https://github.com/oasisprotocol/explorer/issues/965))

## 1.2.0 (2023-09-12)

### Features

- Enable Emerald Mainnet and Testnet
  ([#857](https://github.com/oasisprotocol/explorer/issues/857))

### Internal Changes

- Update react dependencies
  ([#748](https://github.com/oasisprotocol/explorer/issues/748))

- Update dependency react-i18next to v13.2.2
  ([#845](https://github.com/oasisprotocol/explorer/issues/845))

- Update dependency markdownlint-cli to v0.36.0
  ([#846](https://github.com/oasisprotocol/explorer/issues/846))

- Update dependency msw to ^1.3.0
  ([#847](https://github.com/oasisprotocol/explorer/issues/847))

- Update dependency @types/node to v18.17.14
  ([#849](https://github.com/oasisprotocol/explorer/issues/849))

- Update actions/checkout action to v4
  ([#850](https://github.com/oasisprotocol/explorer/issues/850))

- Update lint dependencies to v6.6.0
  ([#851](https://github.com/oasisprotocol/explorer/issues/851))

- Update material-ui monorepo
  ([#852](https://github.com/oasisprotocol/explorer/issues/852))

- Update dependency i18next to v23.4.9
  ([#853](https://github.com/oasisprotocol/explorer/issues/853))

- Update dependency @testing-library/jest-dom to v6.1.3
  ([#854](https://github.com/oasisprotocol/explorer/issues/854))

- Update dependency i18next to v23.5.0
  ([#855](https://github.com/oasisprotocol/explorer/issues/855))

- Update react dependencies to v4.35.0
  ([#856](https://github.com/oasisprotocol/explorer/issues/856))

- Update dependency i18next to v23.5.1
  ([#858](https://github.com/oasisprotocol/explorer/issues/858))

- Update dependency @types/node to v18.17.15
  ([#859](https://github.com/oasisprotocol/explorer/issues/859))

- Update dependency eslint to v8.49.0
  ([#860](https://github.com/oasisprotocol/explorer/issues/860))

- Update dependency @fontsource-variable/figtree to ^5.0.13
  ([#861](https://github.com/oasisprotocol/explorer/issues/861))

- Update storybook dependencies
  ([#862](https://github.com/oasisprotocol/explorer/issues/862))

- Update lint dependencies to v6.7.0
  ([#863](https://github.com/oasisprotocol/explorer/issues/863))

- Update test dependencies to v29.7.0
  ([#864](https://github.com/oasisprotocol/explorer/issues/864))

## 1.1.0 (2023-08-30)

### Features

- Precisely format large numbers using Intl through i18n
  ([#773](https://github.com/oasisprotocol/explorer/issues/773))

### Bug Fixes and Improvements

- Fix charts by syncing with the latest tx_volume stats API changes
  ([#812](https://github.com/oasisprotocol/explorer/issues/812))
- Homepage fixes
  ([#754](https://github.com/oasisprotocol/explorer/issues/754),
  [#759](https://github.com/oasisprotocol/explorer/issues/759),
  [#752](https://github.com/oasisprotocol/explorer/issues/752),
  [#758](https://github.com/oasisprotocol/explorer/issues/758))

- Fix alignment of fiat value tooltip in Account details
  ([#753](https://github.com/oasisprotocol/explorer/issues/753))

- Update typography in various places
  ([#756](https://github.com/oasisprotocol/explorer/issues/756))

- Make fiat conversions accurate
  ([#770](https://github.com/oasisprotocol/explorer/issues/770))

- Show used gas and fee instead of limit
  ([#800](https://github.com/oasisprotocol/explorer/issues/800))

- Remove number of transactions from Token page
  ([#768](https://github.com/oasisprotocol/explorer/issues/768))

- Improve performance when displaying token lists, using newly available data
  ([#760](https://github.com/oasisprotocol/explorer/issues/760))

- Use direct data when displaying balances and token types on token transfers
  ([#761](https://github.com/oasisprotocol/explorer/issues/761))

- When listing token balances, use locally available data
  ([#762](https://github.com/oasisprotocol/explorer/issues/762))

### Internal Changes

- Handle Renovate default commitMessageExtra description
  ([#767](https://github.com/oasisprotocol/explorer/issues/767))
- Follow Nexus API changes
  ([#737](https://github.com/oasisprotocol/explorer/issues/737))

- Replace changelog release script with github action
  ([#738](https://github.com/oasisprotocol/explorer/issues/738))

- Fix Storybook and init API mocks
  ([#787](https://github.com/oasisprotocol/explorer/issues/787))

  Resolves issues in Storybook:

  - No QueryClient set, use QueryClientProvider to set one
  - Unexpected Application Error

- Remove fallbacks for old Nexus versions
  ([#796](https://github.com/oasisprotocol/explorer/issues/796))

- Regenerate orval lockfile to bump subdependencies
  ([#798](https://github.com/oasisprotocol/explorer/issues/798))

- Re-run PR checks after appending Change Log fragment
  ([#777](https://github.com/oasisprotocol/explorer/issues/777))

- Remove unused translations
  ([#814](https://github.com/oasisprotocol/explorer/issues/814))

- Fix variable names in useRuntimeFreshness
  ([#811](https://github.com/oasisprotocol/explorer/issues/811))
- Update storybook dependencies to v7.3.2
  ([#749](https://github.com/oasisprotocol/explorer/issues/749))

- Update dependency @testing-library/jest-dom to v5.17.0
  ([#751](https://github.com/oasisprotocol/explorer/issues/751))

- Update material-ui monorepo
  ([#757](https://github.com/oasisprotocol/explorer/issues/757),
  [#783](https://github.com/oasisprotocol/explorer/issues/783),
  [#795](https://github.com/oasisprotocol/explorer/issues/795),
  [#840](https://github.com/oasisprotocol/explorer/issues/840))

- Update dependency @types/node to v18.17.0
  ([#763](https://github.com/oasisprotocol/explorer/issues/763))

- Update lint dependencies to v6.2.0
  ([#764](https://github.com/oasisprotocol/explorer/issues/764))

- Update dependency @types/testing-library\_\_jest-dom to v5.14.9
  ([#765](https://github.com/oasisprotocol/explorer/issues/765))

- Update dependency @mui/material to v5.14.2
  ([#766](https://github.com/oasisprotocol/explorer/issues/766))

- Update dependency @types/node to v18.17.1
  ([#769](https://github.com/oasisprotocol/explorer/issues/769))

- Update dependency i18next to v23.3.0
  ([#771](https://github.com/oasisprotocol/explorer/issues/771))

- Update test dependencies to v29.6.2
  ([#774](https://github.com/oasisprotocol/explorer/issues/774))

- Update dependency eslint-config-prettier to v8.9.0
  ([#776](https://github.com/oasisprotocol/explorer/issues/776))

- Update dependency eslint to v8.46.0
  ([#778](https://github.com/oasisprotocol/explorer/issues/778))

- Update dependency i18next to v23.4.1
  ([#779](https://github.com/oasisprotocol/explorer/issues/779))

- Update dependency react-i18next to v13.0.3
  ([#780](https://github.com/oasisprotocol/explorer/issues/780))

- Update lint dependencies to v6.2.1
  ([#781](https://github.com/oasisprotocol/explorer/issues/781))

- Update dependency swiper to v10.1.0
  ([#782](https://github.com/oasisprotocol/explorer/issues/782))

- Update dependency storybook-addon-react-router-v6 to v2
  ([#784](https://github.com/oasisprotocol/explorer/issues/784))

- Update fontsource monorepo to ^5.0.7
  ([#785](https://github.com/oasisprotocol/explorer/issues/785))

- Update lint dependencies
  ([#786](https://github.com/oasisprotocol/explorer/issues/786),
  [#794](https://github.com/oasisprotocol/explorer/issues/794))

- Update fontsource monorepo to ^5.0.8
  ([#788](https://github.com/oasisprotocol/explorer/issues/788))

- Update dependency @types/node to v18.17.2
  ([#789](https://github.com/oasisprotocol/explorer/issues/789))

- Update dependency @types/node to v18.17.5
  ([#790](https://github.com/oasisprotocol/explorer/issues/790))

- Update dependency eslint-config-prettier to v9
  ([#791](https://github.com/oasisprotocol/explorer/issues/791))

- Update fontsource monorepo to ^5.0.9
  ([#792](https://github.com/oasisprotocol/explorer/issues/792))

- Update i18n dependencies
  ([#793](https://github.com/oasisprotocol/explorer/issues/793),
  [#817](https://github.com/oasisprotocol/explorer/issues/817))

- Update dependency recharts to v2.7.3
  ([#801](https://github.com/oasisprotocol/explorer/issues/801))

- Update dependency @playwright/test to ^1.37.1
  ([#802](https://github.com/oasisprotocol/explorer/issues/802))

- Update dependency @ethereumjs/util to v9
  ([#803](https://github.com/oasisprotocol/explorer/issues/803))

- Update dependency @testing-library/jest-dom to v6
  ([#804](https://github.com/oasisprotocol/explorer/issues/804))

- Update dependency swiper to v10.2.0
  ([#805](https://github.com/oasisprotocol/explorer/issues/805))

- Update dependency @testing-library/jest-dom to v6.0.1
  ([#806](https://github.com/oasisprotocol/explorer/issues/806))

- Update dependency @types/node to v18.17.6
  ([#807](https://github.com/oasisprotocol/explorer/issues/807))

- Update test dependencies to v29.6.3
  ([#808](https://github.com/oasisprotocol/explorer/issues/808))

- Update lint dependencies to v6.4.1
  ([#809](https://github.com/oasisprotocol/explorer/issues/809))

- Consistently capitalize columns and description terms
  ([#810](https://github.com/oasisprotocol/explorer/issues/810))

- Update dependency @types/node to v18.17.7
  ([#813](https://github.com/oasisprotocol/explorer/issues/813))

- Update test dependencies
  ([#815](https://github.com/oasisprotocol/explorer/issues/815))

- Update dependency @types/node to v18.17.8
  ([#816](https://github.com/oasisprotocol/explorer/issues/816))

- Update dependency @testing-library/jest-dom to v6.1.1
  ([#818](https://github.com/oasisprotocol/explorer/issues/818))

- Update dependency @types/node to v18.17.9
  ([#819](https://github.com/oasisprotocol/explorer/issues/819))

- Update dependency @testing-library/jest-dom to v6.1.2
  ([#820](https://github.com/oasisprotocol/explorer/issues/820))

- Regenerate lockfile to fix issue with Storybook
  ([#821](https://github.com/oasisprotocol/explorer/issues/821))

- Update test dependencies to v29.6.4
  ([#823](https://github.com/oasisprotocol/explorer/issues/823))

- Update dependency typescript to v5.2.2
  ([#824](https://github.com/oasisprotocol/explorer/issues/824))

- Update dependency @types/node to v18.17.11
  ([#825](https://github.com/oasisprotocol/explorer/issues/825))

- Update dependency msw to ^1.2.4
  ([#826](https://github.com/oasisprotocol/explorer/issues/826))

- Update dependency recharts to v2.8.0
  ([#827](https://github.com/oasisprotocol/explorer/issues/827))

- Update dependency i18next to v23.4.6
  ([#829](https://github.com/oasisprotocol/explorer/issues/829))

- Update dependency eslint to v8.48.0
  ([#830](https://github.com/oasisprotocol/explorer/issues/830))

- Update dependency axios to v1.5.0
  ([#831](https://github.com/oasisprotocol/explorer/issues/831))

- Update dependency @types/node to v18.17.12
  ([#832](https://github.com/oasisprotocol/explorer/issues/832))

- Update dependency msw to ^1.2.5
  ([#833](https://github.com/oasisprotocol/explorer/issues/833))

- Update dependency bignumber.js to v9.1.2
  ([#834](https://github.com/oasisprotocol/explorer/issues/834))

- Update lint dependencies to v6.5.0
  ([#835](https://github.com/oasisprotocol/explorer/issues/835))

- Update storybook dependencies to v7.4.0
  ([#836](https://github.com/oasisprotocol/explorer/issues/836))

- Update dependency prettier to v3.0.3
  ([#837](https://github.com/oasisprotocol/explorer/issues/837))

- Update dependency react-i18next to v13.2.1
  ([#838](https://github.com/oasisprotocol/explorer/issues/838))

## 1.0.0 (2023-07-18)

### Removals and Breaking Changes

- Update NEXUS URLs
  ([#735](https://github.com/oasisprotocol/explorer/issues/735))

### Features

- Handle situations when a Paratime is unavailable
  ([#619](https://github.com/oasisprotocol/explorer/issues/619))

- Graph redesign
  ([#644](https://github.com/oasisprotocol/explorer/issues/644))

- Add check against sending menmonics to search
  ([#656](https://github.com/oasisprotocol/explorer/issues/656))

- Graph network dropdown
  ([#667](https://github.com/oasisprotocol/explorer/issues/667))

- Link from unverified contracts to Sourcify to encourage verifying
  ([#669](https://github.com/oasisprotocol/explorer/issues/669))

- Show a warning when search text string it too short
  ([#671](https://github.com/oasisprotocol/explorer/issues/671))

- Fully bring back support for ERC-721 tokens
  ([#681](https://github.com/oasisprotocol/explorer/issues/681))

- Display type in tokens table
  ([#685](https://github.com/oasisprotocol/explorer/issues/685))

- Properly display balance on ERC-721 token transfers
  ([#687](https://github.com/oasisprotocol/explorer/issues/687))

- Make tickers into links in account token transfers
  ([#687](https://github.com/oasisprotocol/explorer/issues/687))

- Token dashboard: make sure all cards have loading state
  ([#691](https://github.com/oasisprotocol/explorer/issues/691))

- Add icons to event names in event logs
  ([#720](https://github.com/oasisprotocol/explorer/issues/720))

- Disable automatically setting AddressSwitch based on URL
  ([#727](https://github.com/oasisprotocol/explorer/issues/727))

  Default to ETH instead. This shows more consistent information when seeing
  consensus withdrawals in transactions list (oasis tx hash, from eth, to
  oasis1) and then opening it:

  - before: oasis tx hash, from oasis1, to oasis1
  - after: oasis tx hash, from eth, to oasis1

### Bug Fixes and Improvements

- Don't die on ERC-721 tokens
  ([#679](https://github.com/oasisprotocol/explorer/issues/679))

- Recognize out of data paratime data (again)
  ([#686](https://github.com/oasisprotocol/explorer/issues/686))

- Fix contract creation info for tokens
  ([#710](https://github.com/oasisprotocol/explorer/issues/710))

- Fix issue with charts responsive container
  ([#713](https://github.com/oasisprotocol/explorer/issues/713))

- Graph feedback
  ([#716](https://github.com/oasisprotocol/explorer/issues/716))

- Separate contracts from accounts search results
  ([#725](https://github.com/oasisprotocol/explorer/issues/725))

- Add missing 0x prefix to eth hashes in runtime events
  ([#728](https://github.com/oasisprotocol/explorer/issues/728))

- Compact large numbers in token total supply
  ([#732](https://github.com/oasisprotocol/explorer/issues/732))

  Enable formatting of large numbers in token snapshot card and token list

- Implement client-side pagination for token transfers
  ([#738](https://github.com/oasisprotocol/explorer/issues/738))

- Filter token transfers consistently
  ([#743](https://github.com/oasisprotocol/explorer/issues/743))

- Un-break lots of pagination-related error pages
  ([#746](https://github.com/oasisprotocol/explorer/issues/746))

### Internal Changes

- Update i18n dependencies
  ([#540](https://github.com/oasisprotocol/explorer/issues/540))

- Update dependency swiper to v10
  ([#642](https://github.com/oasisprotocol/explorer/issues/642))

- Update storybook dependencies to v7.0.26
  ([#660](https://github.com/oasisprotocol/explorer/issues/660))

- Fix description alignment in description list
  ([#668](https://github.com/oasisprotocol/explorer/issues/668))

- Update lint dependencies
  ([#670](https://github.com/oasisprotocol/explorer/issues/670))

- Remove "Decoded" column from events to improve mobile layout
  ([#672](https://github.com/oasisprotocol/explorer/issues/672))

- Update dependency @types/testing-library\_\_jest-dom to v5.14.7
  ([#673](https://github.com/oasisprotocol/explorer/issues/673))

- Pull the API specs directly from GitHub
  ([#678](https://github.com/oasisprotocol/explorer/issues/678))

- Clean up theme.spacing usage and React imports
  ([#680](https://github.com/oasisprotocol/explorer/issues/680))

- Fix full reload when clicking on TokenPills
  ([#682](https://github.com/oasisprotocol/explorer/issues/682))

- Update test dependencies to v29.6.1
  ([#684](https://github.com/oasisprotocol/explorer/issues/684))

- Update dependency swiper to v10.0.4
  ([#692](https://github.com/oasisprotocol/explorer/issues/692))

- Update dependency orval to ^6.17.0
  ([#693](https://github.com/oasisprotocol/explorer/issues/693))

- Update fontsource monorepo to ^5.0.6
  ([#694](https://github.com/oasisprotocol/explorer/issues/694))

- Update dependency react-i18next to v13.0.2
  ([#706](https://github.com/oasisprotocol/explorer/issues/706))

- Update lint dependencies to v5.62.0
  ([#707](https://github.com/oasisprotocol/explorer/issues/707))

- Move all router access to page-level components
  ([#712](https://github.com/oasisprotocol/explorer/issues/712))

- Fix changelog fragment file name
  ([#714](https://github.com/oasisprotocol/explorer/issues/714))

- Update dependency @types/testing-library\_\_jest-dom to v5.14.8
  ([#717](https://github.com/oasisprotocol/explorer/issues/717))

- Update material-ui monorepo
  ([#718](https://github.com/oasisprotocol/explorer/issues/718))

- Update dependency i18next to v23.2.10
  ([#719](https://github.com/oasisprotocol/explorer/issues/719))

- Disable Emerald Mainnet
  ([#722](https://github.com/oasisprotocol/explorer/issues/722))

- Update storybook dependencies to v7.0.27
  ([#726](https://github.com/oasisprotocol/explorer/issues/726))

- Update dependency @types/react-dom to v18.2.7
  ([#729](https://github.com/oasisprotocol/explorer/issues/729))

- Update dependency i18next to v23.2.11
  ([#730](https://github.com/oasisprotocol/explorer/issues/730))

- Update actions/setup-python action to v4.7.0
  ([#733](https://github.com/oasisprotocol/explorer/issues/733))

- Update dependency @types/react to v18.2.15
  ([#734](https://github.com/oasisprotocol/explorer/issues/734))

- Replace indexer api urls with nexus
  ([#736](https://github.com/oasisprotocol/explorer/issues/736))

- Update react dependencies to v4.29.25
  ([#740](https://github.com/oasisprotocol/explorer/issues/740))

- Update dependency eslint to v8.45.0
  ([#741](https://github.com/oasisprotocol/explorer/issues/741))

- Update lint dependencies to v6.1.0
  ([#747](https://github.com/oasisprotocol/explorer/issues/747))

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
