import { FC } from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { tooltipDelay } from '../../../styles/theme'

const StyledButton = styled(Button)(() => ({
  paddingLeft: '0px',
  paddingRight: '0px',
  minWidth: 'auto',
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
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
      </StyledButton>
    </Tooltip>
  )
}
