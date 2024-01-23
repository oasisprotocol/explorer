import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { Validator } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusIcon } from '../StatusIcon'
import { RoundedBalance } from '../RoundedBalance'
import { hasValidProtocol } from '../../utils/url'

type ValidatorsProps = {
  validators?: Validator[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

const StyledImage = styled('img')({
  width: '28px',
  height: '28px',
  borderRadius: 5,
  marginRight: 15,
})

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'value',
})<{ value: number }>(({ value, theme }) => ({
  position: 'relative',
  textAlign: 'center',
  '&::before': {
    content: '""',
    width: `${value}%`,
    height: `calc(100% + ${theme.spacing(5)})`,
    borderRight: 'solid 5px #6665D860',
    backgroundColor: '#6665D820',
    position: 'absolute',
    left: 0,
    top: `-${theme.spacing(4)}`,
  },
}))

export const Validators: FC<ValidatorsProps> = ({ isLoading, limit, pagination, validators }) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { align: TableCellAlign.Center, key: 'rank', content: t('common.rank') },
    { key: 'name', content: t('validator.title') },
    { align: TableCellAlign.Right, key: 'cumulativeVoting', content: t('validator.cumulativeVoting') },
    { align: TableCellAlign.Right, key: 'voting', content: t('validator.voting') },
    { align: TableCellAlign.Right, key: 'staked', content: t('validator.staked') },
    { align: TableCellAlign.Right, key: 'change', content: t('validator.change') },
    { align: TableCellAlign.Right, key: 'delegators', content: t('validator.delegators') },
    { align: TableCellAlign.Right, key: 'commission', content: t('validator.commission') },
    { key: 'status', content: t('common.status') },
    { key: 'uptime', content: t('validator.uptime') },
  ]
  const tableRows = validators?.map((validator, index) => ({
    key: validator.entity_address,
    data: [
      {
        align: TableCellAlign.Center,
        // TODO: replace index when rank is implemented in the API
        content: <div>{index + 1}</div>,
        key: 'rank',
      },
      {
        // TODO: Enable link when validator detail page is ready
        content: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <>
              {validator.media?.logotype && hasValidProtocol(validator.media?.logotype) && (
                <StyledImage
                  alt={validator.media?.name || validator.entity_address}
                  src={validator.media?.logotype}
                />
              )}
              {validator.media?.name || validator.entity_address}
            </>
          </Box>
        ),
        key: 'name',
      },
      {
        align: TableCellAlign.Right,
        // TODO: provide cumulative voting when it is implemented in the API
        content: (
          <Box>
            <StyledBox value={0}>
              <Typography component="span" sx={{ position: 'relative', zIndex: 2 }}>
                -
              </Typography>
            </StyledBox>
          </Box>
        ),
        key: 'cumulativeVoting',
      },
      {
        align: TableCellAlign.Right,
        // TODO: provide voting when it is implemented in the API
        content: <>-</>,
        key: 'voting',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={validator.escrow} ticker={validator.ticker} />,
        key: 'staked',
      },
      {
        align: TableCellAlign.Right,
        // TODO: provide change value when it is implemented in the API
        content: <>-</>,
        key: 'change',
      },
      {
        align: TableCellAlign.Right,
        // TODO: provide delegators when it is implemented in the API
        content: <>-</>,
        key: 'delegators',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <>
            {t('common.valuePair', {
              value: validator.current_rate / 100000,
              formatParams: {
                value: {
                  style: 'percent',
                  maximumFractionDigits: 2,
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </>
        ),
        key: 'commission',
      },
      {
        content: (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StatusIcon success={validator.status} error={undefined} />
          </Box>
        ),
        key: 'status',
      },
      {
        // TODO: provide uptime when it is implemented in the API
        align: TableCellAlign.Right,
        content: <>-</>,
        key: 'uptime',
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
