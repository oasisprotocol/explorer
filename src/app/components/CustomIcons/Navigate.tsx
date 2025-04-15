import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'

export const NavigateIcon: FC<SvgIconProps & { secondary?: string }> = ({ secondary, ...restProps }) => {
  const theme = useTheme()
  const mainColor = theme.palette.layout.helpScreenMainColor
  const secondaryColor = secondary ?? theme.palette.layout.helpScreenIconColor

  return (
    <SvgIcon width="50" height="50" viewBox="0 0 50 50" {...restProps}>
      <path
        d="M14 22C14 20.343 12.657 19 11 19C9.343 19 8 20.343 8 22V32C8 40.284 14.716 47 23 47C31.284 47 38 40.284 38 32V24C38 22.343 36.657 21 35 21C33.343 21 32 22.343 32 24V22C32 20.343 30.657 19 29 19C27.343 19 26 20.343 26 22V20C26 18.343 24.657 17 23 17C21.343 17 20 18.343 20 20V6C20 4.343 18.657 3 17 3C15.343 3 14 4.343 14 6V29V22Z"
        stroke={mainColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M34 3V15"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M32 4L34 2L36 4"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M32 14L34 16L36 14"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M41 9H27"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M39 7L41 9L39 11"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M29 7L27 9L29 11"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
    </SvgIcon>
  )
}
