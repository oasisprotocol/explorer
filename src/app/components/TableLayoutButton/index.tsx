import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { PivotTable } from '../MuiIcons/PivotTable'

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
    <Tooltip side="left" title={t('tableLayoutButton.changeView')}>
      <Button
        variant="ghost"
        onClick={() => {
          setTableView(tableView === TableLayout.Horizontal ? TableLayout.Vertical : TableLayout.Horizontal)
        }}
        className="hover:bg-black/[0.04]"
      >
        <PivotTable className="min-h-6 min-w-6" />
      </Button>
    </Tooltip>
  )
}
