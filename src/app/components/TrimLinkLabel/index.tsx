import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import { trimLongString } from '../../utils/trimLongString'
import { Typography } from '@mui/material'

type TrimLinkLabelProps = {
  label: string
  to: string
}

export const TrimLinkLabel: FC<TrimLinkLabelProps> = ({ label, to }) => {
  return (
    <Tooltip arrow placement="top" title={label}>
      <Link component={RouterLink} to={to}>
        <Typography variant="mono">{trimLongString(label)}</Typography>
      </Link>
    </Tooltip>
  )
}
