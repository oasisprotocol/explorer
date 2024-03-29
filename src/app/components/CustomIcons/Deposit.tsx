import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const DepositIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <rect width="24" height="24" rx="12" fill="#E8FAF3" />
      <g clipPath="url(#clip0_5784_204607)">
        <path
          d="M18.1201 12.1191L17.0626 11.0616L12.8701 15.2466L12.8701 6.11914L11.3701 6.11914L11.3701 15.2466L7.17762 11.0616L6.12012 12.1191L12.1201 18.1191L18.1201 12.1191Z"
          fill="#4CD4A9"
        />
      </g>
      <defs>
        <clipPath id="clip0_5784_204607">
          <rect width="18" height="18" fill="white" transform="translate(21.1201 3.11914) rotate(90)" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
