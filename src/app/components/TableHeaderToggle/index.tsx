import { FC } from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { styled } from '@mui/material/styles'
import { tooltipDelay } from '../../../styles/theme'

const StyledButton = styled(Button)(() => ({
  padding: '0px',
  minWidth: 'auto',
  height: 'auto',
}))

type TableHeaderToggleProps = {
  label: string
  onClick: () => void
  tooltipTitle: string
}

export const TableHeaderToggle: FC<TableHeaderToggleProps> = ({ label, onClick, tooltipTitle }) => {
  return (
    <Tooltip title={tooltipTitle} enterDelay={tooltipDelay} leaveDelay={0} placement="top">
      <StyledButton variant="text" onClick={onClick}>
        <Typography className="text-primary font-semibold">{label}</Typography>
      </StyledButton>
    </Tooltip>
  )
}
