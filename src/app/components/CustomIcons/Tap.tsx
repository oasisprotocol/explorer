import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'

export const TapIcon: FC<SvgIconProps & { secondary?: string }> = ({ secondary, ...restProps }) => {
  const theme = useTheme()
  const secondaryColor = secondary ?? theme.palette.layout.helpScreenIconColor

  return (
    <SvgIcon width="50" height="50" viewBox="0 0 50 50" {...restProps}>
      <path
        d="M31.8682 23.8414C34.9708 21.6721 37 18.073 37 14C37 7.37258 31.6274 2 25 2C18.3726 2 13 7.37258 13 14C13 18.073 15.0292 21.6721 18.1318 23.8414"
        stroke={secondaryColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M17.9819 47V14C17.9819 10.134 21.1159 7 24.9819 7C28.8479 7 31.9819 10.134 31.9819 14V47"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M27.9819 19C27.9819 19 26.6489 20 24.9819 20C23.3149 20 21.9819 19 21.9819 19V15C21.9819 13.343 23.3249 12 24.9819 12C26.6389 12 27.9819 13.343 27.9819 15V19Z"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M23 34H27"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 38H27"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
