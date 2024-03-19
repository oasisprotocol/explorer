import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import { trimLongString } from '../../utils/trimLongString'
import { tooltipDelay } from '../../../styles/theme'

type TrimLinkLabelProps = {
  label: string
  to: string
}

export const TrimLinkLabel: FC<TrimLinkLabelProps> = ({ label, to }) => {
  const trimmedLabel = trimLongString(label)
  if (!trimmedLabel) {
    return null
  }
  return <TrimLink label={label} to={to} trimmedLabel={trimmedLabel} />
}

type TrimEndLinkLabelProps = TrimLinkLabelProps & {
  trimStart: number
}

export const TrimEndLinkLabel: FC<TrimEndLinkLabelProps> = ({ label, to, trimStart }) => {
  const trimmedLabel = trimLongString(label, trimStart, 0)
  if (!trimmedLabel) {
    return null
  }
  return <TrimLink label={label} to={to} trimmedLabel={trimmedLabel} />
}

type TrimLinkProps = TrimLinkLabelProps & {
  trimmedLabel: string
}

const TrimLink: FC<TrimLinkProps> = ({ label, to, trimmedLabel }) => {
  return (
    <Tooltip arrow placement="top" title={label} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
      <Link component={RouterLink} to={to}>
        {trimmedLabel}
      </Link>
    </Tooltip>
  )
}
