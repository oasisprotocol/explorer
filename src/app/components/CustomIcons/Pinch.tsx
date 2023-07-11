import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'

export const PinchIcon: FC<SvgIconProps & { secondary?: string }> = ({ secondary, ...restProps }) => {
  const theme = useTheme()
  const secondaryColor = secondary ?? theme.palette.layout.helpScreenIconColor

  return (
    <SvgIcon width="50" height="50" viewBox="0 0 50 50" {...restProps}>
      <path
        d="M26.99 18C26.99 16.343 28.333 15 29.99 15C31.647 15 32.99 16.343 32.99 18V20C32.99 18.343 34.333 17 35.99 17C37.647 17 38.99 18.343 38.99 20V23V21.938C38.99 20.281 40.333 18.938 41.99 18.938C43.647 18.938 44.99 20.281 44.99 21.938V32C44.99 40.284 38.274 47 29.99 47C25.848 47 22.098 45.321 19.383 42.607L8.64804 29.089C7.70304 27.899 7.80103 26.19 8.87503 25.115C10.043 23.947 11.936 23.947 13.104 25.115L17.329 29.34C18.68 30.691 20.989 29.734 20.989 27.824V23V6C20.989 4.343 22.332 3 23.989 3C25.646 3 26.989 4.343 26.989 6V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M5 20L16 9"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M16 13V9H12"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        d="M5 16V20H9"
        stroke={secondaryColor}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
    </SvgIcon>
  )
}
