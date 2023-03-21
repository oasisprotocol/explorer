import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import ViewListIcon from '@mui/icons-material/ViewList'
import { FC, useState } from 'react'
import { COLORS } from '../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'

export enum TableView {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface TableViewSpeedDialProps {
  tableView: TableView
  setTableView: (tableView: TableView) => void
}

export const TableViewSpeedDial: FC<TableViewSpeedDialProps> = ({ tableView, setTableView }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <SpeedDial
      sx={{ position: 'absolute', top: 0, right: 0, marginTop: -3 }}
      direction="down"
      ariaLabel={t('tableViewSpeedDial.tableView')}
      icon={<PivotTableChartIcon />}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <SpeedDialAction
        icon={<PivotTableChartIcon sx={{ color: COLORS.brandExtraDark }} />}
        tooltipTitle={t('tableViewSpeedDial.changeView')}
        onClick={() => {
          setTableView(tableView === TableView.Horizontal ? TableView.Vertical : TableView.Horizontal)
          setOpen(false)
        }}
      />
      <SpeedDialAction
        className="interactive"
        icon={
          tableView === TableView.Vertical ? (
            <TableRowsIcon sx={{ color: COLORS.brandExtraDark }} />
          ) : (
            <TableRowsOutlinedIcon sx={{ color: COLORS.brandExtraDark }} />
          )
        }
        tooltipTitle={t('tableViewSpeedDial.table')}
        onClick={() => {
          setTableView(TableView.Vertical)
          setOpen(false)
        }}
      />
      <SpeedDialAction
        className="interactive"
        icon={
          tableView === TableView.Horizontal ? (
            <ViewListIcon sx={{ color: COLORS.brandExtraDark }} />
          ) : (
            <ViewListOutlinedIcon sx={{ color: COLORS.brandExtraDark }} />
          )
        }
        tooltipTitle={t('tableViewSpeedDial.list')}
        onClick={() => {
          setTableView(TableView.Horizontal)
          setOpen(false)
        }}
      />
    </SpeedDial>
  )
}
