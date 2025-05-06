import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { CardEmptyState } from '../../components/CardEmptyState'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { EvmTokenType, Layer } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { TokenLinkWithIcon } from '../../components/Tokens/TokenLinkWithIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import {
  getTokenTypePluralDescription,
  getTokenTypePluralName,
  getTokenTypeStrictName,
} from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeAccountDetailsContext } from './index'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { tokenContainerId } from '../../utils/tabAnchors'

type AccountTokensCardProps = RuntimeAccountDetailsContext & {
  type: EvmTokenType
}

export const ContractLink: FC<{ scope: SearchScope; address: string; alwaysTrim?: boolean }> = ({
  scope,
  address,
  alwaysTrim,
}) => {
  return (
    <Box sx={{ display: 'flex', alignContent: 'center' }}>
      <AccountLink scope={scope} address={address} alwaysTrim={alwaysTrim} />
      <CopyToClipboard value={address} />
    </Box>
  )
}

export const AccountTokensCard: FC<AccountTokensCardProps> = ({ scope, account, type }) => {
  const { t } = useTranslation()
  const locationHash = useLocation().hash.replace('#', '')
  const tokenListLabel = getTokenTypePluralName(t, type)
  const isERC721 = type === EvmTokenType.ERC721
  const tableColumns: TableColProps[] = [
    { key: 'name', content: t(isERC721 ? 'common.collection' : 'common.name') },
    { key: 'contract', content: t('common.smartContract') },
    { key: 'balance', align: TableCellAlign.Right, content: t(isERC721 ? 'common.owned' : 'common.balance') },
    { key: 'ticker', align: TableCellAlign.Right, content: t('common.ticker') },
    ...(isERC721
      ? [
          {
            key: 'link',
            content: '',
          },
        ]
      : []),
  ]
  const { layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const tableRows = (account?.tokenBalances[type] || []).map(item => ({
    key: item.token_contract_addr,
    data: [
      {
        content: (
          <TokenLinkWithIcon
            scope={scope}
            address={item.token_contract_addr_eth ?? item.token_contract_addr}
            name={item.token_name || t('common.missing')}
          />
        ),
        key: 'name',
      },
      {
        content: (
          <LinkableDiv id={item.token_contract_addr_eth ?? item.token_contract_addr}>
            <ContractLink
              scope={scope}
              address={item.token_contract_addr_eth ?? item.token_contract_addr}
              alwaysTrim
            />
          </LinkableDiv>
        ),
        key: 'hash',
      },
      {
        align: TableCellAlign.Right,
        content: t('common.valueLong', getPreciseNumberFormat(item.balance)),
        key: 'balance',
      },
      {
        align: TableCellAlign.Right,
        content: item.token_symbol || t('common.missing'),
        key: 'ticker',
      },
      ...(isERC721
        ? [
            {
              align: TableCellAlign.Right,
              key: 'link',
              content: (
                <Link component={RouterLink} to={item.token_contract_addr_eth} preventScrollReset={true}>
                  {t('common.viewAll')}
                </Link>
              ),
            },
          ]
        : []),
    ],
    highlight: item.token_contract_addr_eth === locationHash || item.token_contract_addr === locationHash,
  }))

  return (
    <LinkableCardLayout containerId={tokenContainerId} title="">
      {!!account && !account?.tokenBalances[type]?.length && (
        <CardEmptyState
          label={t('account.emptyTokenList', {
            spec: getTokenTypeStrictName(t, type),
            description: getTokenTypePluralDescription(t, type),
          })}
        />
      )}

      <Table
        columns={tableColumns}
        rows={tableRows}
        rowsNumber={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
        name={tokenListLabel}
        isLoading={!account}
        pagination={false}
      />
    </LinkableCardLayout>
  )
}
