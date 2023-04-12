import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import { trimLongString } from '../../utils/trimLongString'

type TrimLinkLabelProps = {
  label: string
  to: string
}

const tooltipDelay = 500

export const TrimLinkLabel: FC<TrimLinkLabelProps> = ({ label, to }) => {
  return (
    <Tooltip arrow placement="top" title={label} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
      <Link component={RouterLink} to={to}>
        {trimLongString(label)}
      </Link>
    </Tooltip>
  )
}
