import { CSSProperties } from 'react'
import { COLORS } from '../../../styles/theme/colors'

function extractTwoChars(strRaw: string) {
  const str = strRaw.trim().replace(/[^A-Za-z0-9 ]/g, '')
  if (str.length < 2) return str || '  '
  const first = str[0]
  const rest = str.slice(1)
  const lastDigitInSequence = rest.match(/\d+/)?.[0].at(-1)
  const firstCharAfterSpace = rest.match(/\s+./)?.[0].at(-1)
  const firstCapitalized = rest.match(/[A-Z]/)?.[0]
  const second = lastDigitInSequence || firstCharAfterSpace || firstCapitalized || rest[0]
  return first + second
}

export const InitialsAvatar = ({
  name,
  width,
  style = {},
}: {
  name: string
  width: number
  style?: CSSProperties
}) => {
  return (
    <svg width={width} viewBox="0 0 100 100" style={style}>
      <rect width="100" height="100" rx="50" fill={COLORS.brandDark} />
      <text fontSize="40" x="50" y="50" dominantBaseline="central" textAnchor="middle" fill={COLORS.white}>
        {extractTwoChars(name)}
      </text>
    </svg>
  )
}
