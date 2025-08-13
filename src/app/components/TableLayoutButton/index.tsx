import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart'
import Tooltip from '@mui/material/Tooltip'

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
    <Tooltip arrow placement="right" title={t('tableLayoutButton.changeView')}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setTableView(tableView === TableLayout.Horizontal ? TableLayout.Vertical : TableLayout.Horizontal)
        }}
        className="hover:bg-black/[0.04]"
      >
        <PivotTableChartIcon fontSize="medium" />
      </Button>
    </Tooltip>
  )
}
