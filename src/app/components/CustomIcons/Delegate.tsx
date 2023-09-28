import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const DelegateIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <defs>
        <clipPath id="clippath">
          <rect fill="none" x="4.2" y="4.2" width="15.6" height="15.6" />
        </clipPath>
      </defs>
      <circle fill="#E8F6FF" cx="12" cy="12" r="12" />
      <g clipPath="url(#clippath)">
        <path
          fill="#6665D8"
          d="M11.46,17.36H7.18v-3.75h1.61v-2.14h2.68v-1.07h-1.61v-3.75h4.29v3.75h-1.61v1.07h2.68v2.14h1.61v3.75h-4.29v-3.75h1.61v-1.07h-4.29v1.07h1.61v3.75Z"
        />
      </g>
    </SvgIcon>
  )
}
