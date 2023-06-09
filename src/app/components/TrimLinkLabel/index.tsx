import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import { trimLongString } from '../../utils/trimLongString'
import { tooltipDelay } from '../../../styles/theme'

type TrimLinkLabelProps = {
  label: string
  to: string
  plain?: boolean
}

export const TrimLinkLabel: FC<TrimLinkLabelProps> = ({ label, to, plain }) => {
  const trimmedLabel = trimLongString(label)

  return (
    <Tooltip arrow placement="top" title={label} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
      {plain ? (
        <>{trimmedLabel}</>
      ) : (
        <Link component={RouterLink} to={to}>
          {trimmedLabel}
        </Link>
      )}
    </Tooltip>
  )
}
