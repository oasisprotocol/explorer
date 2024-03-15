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
  if (!trimmedLabel) {
    return null
  }
  return <TrimLink label={label} to={to} trimmedLabel={trimmedLabel} plain={plain} />
}

type TrimEndLinkLabelProps = TrimLinkLabelProps & {
  trimStart: number
}

export const TrimEndLinkLabel: FC<TrimEndLinkLabelProps> = ({ label, to, plain, trimStart }) => {
  const trimmedLabel = trimLongString(label, trimStart, 0)
  if (!trimmedLabel) {
    return null
  }
  return <TrimLink label={label} to={to} trimmedLabel={trimmedLabel} plain={plain} />
}

type TrimLinkProps = TrimLinkLabelProps & {
  trimmedLabel: string
}

const TrimLink: FC<TrimLinkProps> = ({ label, to, trimmedLabel, plain }) => {
  return (
    <Tooltip arrow placement="top" title={label} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
      <Link component={RouterLink} to={to} sx={{ fontWeight: plain ? 400 : undefined }}>
        {trimmedLabel}
      </Link>
    </Tooltip>
  )
}
