import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { trimLongString } from '../../utils/trimLongString'
import { HighlightedTrimmedText } from '../HighlightedText/HighlightedTrimmedText'

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
  highlightedPart?: string
}

export const TrimEndLinkLabel: FC<TrimEndLinkLabelProps> = ({ label, to, trimStart, highlightedPart }) => {
  const trimmedLabel = (
    <HighlightedTrimmedText text={label} pattern={highlightedPart} fragmentLength={trimStart} />
  )
  if (!trimmedLabel) {
    return null
  }
  return <TrimLink label={label} to={to} trimmedLabel={trimmedLabel} />
}

type TrimLinkProps = TrimLinkLabelProps & {
  trimmedLabel: ReactNode
}

const TrimLink: FC<TrimLinkProps> = ({ label, to }) => {
  return (
    <Link component={RouterLink} to={to}>
      {label}
    </Link>
  )
}
