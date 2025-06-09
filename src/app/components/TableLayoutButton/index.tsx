import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart'
import { TooltipWrapper as Tooltip } from '@oasisprotocol/ui-library/src/components/ui/tooltipWrapper'

export enum TableLayout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface TableLayoutButtonProps {
  tableView: TableLayout
  setTableView: (tableView: TableLayout) => void
}

export const TableLayoutButton: FC<TableLayoutButtonProps> = ({ tableView, setTableView }) => {
  const { t } = useTranslation()

  return (
    <Tooltip title={t('tableLayoutButton.changeView')}>
      <IconButton
        color="primary"
        onClick={() => {
          setTableView(tableView === TableLayout.Horizontal ? TableLayout.Vertical : TableLayout.Horizontal)
        }}
      >
        <PivotTableChartIcon fontSize="medium" />
      </IconButton>
    </Tooltip>
  )
}
