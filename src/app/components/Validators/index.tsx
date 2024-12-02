import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusIcon } from '../StatusIcon'
import { RoundedBalance } from '../RoundedBalance'
import { ValidatorImage } from './ValidatorImage'
import { ValidatorCommission } from './ValidatorCommission'
import { ValidatorCumulativeVoting } from './ValidatorCumulativeVoting'
import { ValidatorLink } from './ValidatorLink'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { BalancesDiff } from '../BalancesDiff'
import { PercentageValue } from '../PercentageValue'

type ValidatorsProps = {
  validators?: Validator[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  stats: ValidatorAggStats | undefined
}

export const Validators: FC<ValidatorsProps> = ({ isLoading, limit, pagination, validators, stats }) => {
  const { t } = useTranslation()
  const { network } = useRequiredScopeParam()

  const tableColumns: TableColProps[] = [
    { align: TableCellAlign.Center, key: 'rank', content: t('common.rank') },
    { key: 'name', content: t('validator.title') },
    { align: TableCellAlign.Right, key: 'cumulativeVoting', content: t('validator.cumulativeVoting') },
    { align: TableCellAlign.Right, key: 'voting', content: t('validator.voting') },
    { align: TableCellAlign.Right, key: 'staked', content: t('common.staked') },
    { align: TableCellAlign.Right, key: 'change', content: t('validator.change') },
    { align: TableCellAlign.Right, key: 'delegators', content: t('validator.delegators') },
    { align: TableCellAlign.Right, key: 'commission', content: t('validator.commission') },
    { key: 'status', content: t('common.status') },
  ]
  const tableRows = validators?.map((validator, index) => ({
    key: validator.entity_address,
    data: [
      {
        align: TableCellAlign.Center,
        content: validator.rank,
        key: 'rank',
      },
      {
        content: (
          <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
            <ValidatorImage
              address={validator.entity_address}
              name={validator.media?.name}
              logotype={validator.media?.logoUrl}
            />
            <ValidatorLink
              address={validator.entity_address}
              name={validator.media?.name}
              network={network}
            />
          </Box>
        ),
        key: 'name',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <ValidatorCumulativeVoting
            containerMarginThemeSpacing={5}
            value={validator.voting_power_cumulative}
            total={stats?.total_voting_power}
          />
        ),
        key: 'cumulativeVoting',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <PercentageValue
            value={validator.voting_power}
            total={stats?.total_voting_power}
            adaptMaximumFractionDigits
          />
        ),

        key: 'voting',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={validator.escrow?.active_balance} ticker={validator.ticker} />,
        key: 'staked',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <BalancesDiff
            before={validator.escrow.active_balance_24}
            after={validator.escrow.active_balance}
            ticker={validator.ticker}
          />
        ),
        key: 'change',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <>
            {typeof validator.escrow.num_delegators === 'number'
              ? validator.escrow.num_delegators.toLocaleString()
              : t('common.missing')}
          </>
        ),
        key: 'delegators',
      },
      {
        align: TableCellAlign.Right,
        content: <ValidatorCommission commission={validator.current_rate} />,
        key: 'commission',
      },
      {
        content: (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StatusIcon success={validator.active} error={undefined} />
          </Box>
        ),
        key: 'status',
      },
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('validator.listTitle')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
