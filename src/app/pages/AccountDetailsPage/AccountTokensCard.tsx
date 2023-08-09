import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { CardEmptyState } from './CardEmptyState'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { EvmTokenType, Layer } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useAccount } from './hook'
import { TokenLink } from '../../components/Tokens/TokenLink'
import { AccountLink } from '../../components/Account/AccountLink'
import {
  getTokenTypePluralDescription,
  getTokenTypePluralName,
  getTokenTypeStrictName,
} from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'
import { AccountDetailsContext } from './index'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

type AccountTokensCardProps = AccountDetailsContext & {
  type: EvmTokenType
}

export const accountTokenContainerId = 'tokens'

export const ContractLink: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  return (
    <Box sx={{ display: 'flex', alignContent: 'center' }}>
      <AccountLink scope={scope} address={address} />
      <CopyToClipboard value={address} />
    </Box>
  )
}

export const AccountTokensCard: FC<AccountTokensCardProps> = ({ scope, address, type }) => {
  const { t } = useTranslation()
  const locationHash = useLocation().hash.replace('#', '')
  const tokenListLabel = getTokenTypePluralName(t, type)
  const tableColumns: TableColProps[] = [
    { key: 'name', content: t('common.name') },
    { key: 'contract', content: t('common.smartContract') },
    { key: 'balance', align: TableCellAlign.Right, content: t('common.balance') },
    { key: 'ticker', align: TableCellAlign.Right, content: t('common.ticker') },
  ]
  const { layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const { isLoading, account } = useAccount(scope, address)
  const tableRows = (account?.tokenBalances[type] || []).map(item => ({
    key: item.token_contract_addr,
    data: [
      {
        content: (
          <TokenLink
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
            <ContractLink scope={scope} address={item.token_contract_addr_eth ?? item.token_contract_addr} />
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
    ],
    highlight: item.token_contract_addr_eth === locationHash || item.token_contract_addr === locationHash,
  }))

  return (
    <Card>
      <LinkableDiv id={accountTokenContainerId}>
        <CardHeader disableTypography component="h3" title={tokenListLabel} />
        <CardContent>
          {!isLoading && !account?.tokenBalances[type]?.length && (
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
            isLoading={isLoading}
            pagination={false}
          />
        </CardContent>
      </LinkableDiv>
    </Card>
  )
}
