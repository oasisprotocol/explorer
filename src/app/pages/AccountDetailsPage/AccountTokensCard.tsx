import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { CardEmptyState } from './CardEmptyState'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { EvmTokenType, Layer } from '../../../oasis-indexer/api'
import { AppErrors } from '../../../types/errors'
import { ScrollingDiv } from '../../components/PageLayout/ScrollingDiv'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useAccount } from './hook'

type AccountTokensCardProps = {
  type: EvmTokenType
}

export const accountTokenContainerId = 'tokens'

export const AccountTokensCard: FC<AccountTokensCardProps> = ({ type }) => {
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { t } = useTranslation()
  const locationHash = useLocation().hash.replace('#', '')
  const tokenLabel = t(`account.${type}` as any)
  const tokenListLabel = t('common.tokens') // TODO: re-enable when we want multiple token types again t('account.tokensListTitle', { token: tokenLabel })
  const tableColumns: TableColProps[] = [
    { key: 'name', content: t('common.name') },
    { key: 'contract', content: t('common.smartContract') },
    { key: 'balance', align: TableCellAlign.Right, content: t('common.balance') },
    { key: 'ticker', align: TableCellAlign.Right, content: t('common.ticker') },
  ]
  const { layer } = useRequiredScopeParam()
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const { isLoading, account } = useAccount(scope, address)
  const tableRows = (account?.tokenBalances[type] || []).map(item => ({
    key: item.token_contract_addr,
    data: [
      {
        content: item.token_name || t('common.missing'),
        key: 'name',
      },
      {
        content: (
          <ScrollingDiv id={item.token_contract_addr}>
            <Box sx={{ display: 'flex', alignContent: 'center' }}>
              <Typography variant="mono" fontWeight={400}>
                {item.token_contract_addr}
              </Typography>
              <CopyToClipboard value={item.token_contract_addr} />
            </Box>
          </ScrollingDiv>
        ),
        key: 'hash',
      },
      {
        align: TableCellAlign.Right,
        content: item.balance,
        key: 'balance',
      },
      {
        align: TableCellAlign.Right,
        content: item.token_symbol || t('common.missing'),
        key: 'ticker',
      },
    ],
    highlight: item.token_contract_addr === locationHash,
  }))

  return (
    <Card>
      <ScrollingDiv id={accountTokenContainerId}>
        <CardHeader disableTypography component="h3" title={tokenListLabel} />
        <CardContent>
          {!isLoading && !account?.tokenBalances[type].length && (
            <CardEmptyState label={t('account.emptyTokenList', { token: tokenLabel })} />
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
      </ScrollingDiv>
    </Card>
  )
}
